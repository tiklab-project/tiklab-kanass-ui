/*
 * @Descripttion: 路线图表格页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useEffect, useState, Fragment, useRef, useImperativeHandle } from "react";
import { observer, inject } from "mobx-react";
import { Graph } from '@antv/x6';
import "./LineMap.scss";
import RowScroll from "./RowScroll";
import ColScroll from "./CoLScroll"
import { withRouter } from "react-router";
import moment from 'moment';
import { useDebounce } from "../../../common/utils/debounce";
const SprintLineMap = (props) => {
    // 获取当前年月日
    const { data, setShowEpicAddModal, setAddChild, setParentId,
        archiveView, setGraph, graph, lineMapStore, sprintLineRef } = props;


    const { updateSprint } = lineMapStore;
    const todayDate = new Date()
    const currentYear = todayDate.getFullYear()
    const currentMonth = todayDate.getMonth()
    const currentDay = todayDate.getDate()

    const [dateArray, setdateArray] = useState()
    // 路线图的宽
    const [ganttWidth, setGanttWidth] = useState(0)

    // 使用于路线图显示的数据
    const [ganttdata, setGantt] = useState();
    const [expandedTree, setExpandedTree] = useState([])

    const archiveBase = archiveView === "month" ? 3600 * 1000 * 2.4 : 3600 * 1000;
    const unitLength = archiveView === "month" ? 10 : 24;

    const firstDate = moment().subtract(1, "year").format("YYYY-MM-DD");
    const firstDateMillisecond = Date.parse(firstDate);

    useEffect(() => {
        if (data.length > 0) {
            console.log(setNode(data))
            setGantt(setNode(data))
        }
        return
    }, [data, expandedTree])

    useEffect(() => {
        // 画布参数
        if (ganttCore?.current) {
            setdateArray(getDate())
            creatGraph()
            setGantt(setNode(data))
        }

        return;
    }, [archiveView])

    const creatGraph = () => {
        // 开始与结束日期，解析一个表示某个日期的字符串，
        // 并返回从1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的UTC时间）的毫秒数
        let start = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`;
        let end = `${currentYear + 1}.${currentMonth + 1}.${currentDay}`
        start = Date.parse(start);
        end = Date.parse(end);

        // 用开始日期与结束日期定义画布的宽度
        let graphWidth = Math.abs(start - end);


        graphWidth = Math.floor(graphWidth / archiveBase) + unitLength
        setGanttWidth(graphWidth)


        const graph = new Graph({
            container: document.getElementById("sprint"),
            width: graphWidth,
            grid: {
                size: unitLength,
                visible: false,
                type: 'doubleMesh',
                args: [
                    {
                        color: '#ddd', // 主网格线颜色
                        thickness: 2,     // 主网格线宽度
                    },
                    {
                        color: '#aaa', // 次网格线颜色
                        thickness: 1,     // 次网格线宽度
                        factor: 5,        // 主次网格线间隔
                    },
                ],
            },
            resizing: {
                enabled: true
            },
            translating: {
                restrict(cellView) {
                    const cell = cellView.cell
                    if (cell.isNode()) {
                        const cellRange = cell.getBBox()
                        cellRange.x = 0;
                        cellRange.width = graphWidth;
                        return cellRange;
                    }
                    return null
                },
            }
        })

        graph.on("node:change:position", ({ node, options }) => updateByChangeNodePosition({node}))

        graph.on("node:change:size", ({ node, options }) => updateByChangeNodeSize({ node, options }))
        setGraph(graph)
    }

    const updateByChangeNodePosition = useDebounce(({ node, options }) => {
        const nodeBox = node.getBBox();
        const sprintId = node.id;
        const startX = nodeBox.x;
        const nodeWidth = nodeBox.width;
        const index = node.store.data.index;
        let params = { id: "", startTime: "", endTime: "" };
        params.id = sprintId;

        let endTime = (startX + nodeWidth) * archiveBase + firstDateMillisecond;
        endTime = moment(endTime).subtract(1, "day").format('YYYY-MM-DD');
        params.endTime = endTime;

        let startTime = startX * archiveBase  + firstDateMillisecond;
        startTime = moment(startTime).format('YYYY-MM-DD');
        params.startTime = startTime;
        updateSprint(params).then(res => {
            if(res.code === 0){
                data[index].endTime = endTime;
                data[index].startTime = startTime;
            }
        })
    }, [500])

    const updateByChangeNodeSize = useDebounce(({ node, options }) => {
        const nodeBox = node.getBBox();

        const sprintId = node.id;
        let params = { id: "", startTime: "", endTime: "" };
        params.id = sprintId;
        const index = node.store.data.index;

        const direction = options.relativeDirection;
        const startX = nodeBox.x;
        const nodeWidth = nodeBox.width;
        if (direction === "right") {

            const dataTime = (startX + nodeWidth) * archiveBase + firstDateMillisecond;
            let day = moment(dataTime).subtract(1, "day").format('YYYY-MM-DD');
            params.endTime = day;
            updateSprint(params).then(res => {
                if(res.code === 0){
                    data[index].endTime = day;
                }
            })
        }
        if (direction === "left") {

            const dataTime = startX * archiveBase + firstDateMillisecond;
            let day = moment(dataTime).format('YYYY-MM-DD');
            params.startTime = day;
            updateSprint(params).then(res => {
                if(res.code === 0){
                    data[index].startTime = day;
                }
                
            })
        }
    
    }, [500])


    //渲染画布
    const setGarph = () => {
        graph.fromJSON(ganttdata)
    }

    const goToday = () => {
        document.getElementById('table-pic').scrollLeft = scrollLeft;
        document.getElementById('table-timer').scrollLeft = scrollLeft;
    }

    useImperativeHandle(sprintLineRef, () => ({
        goToday: goToday
    }))

    /**
     * 解决异步问题
     * 路线渲染数据变化就从新渲染画布
     */
    const [scrollLeft, setScrollLeft] = useState()
    useEffect(() => {
        if (ganttdata !== undefined) {
            document.getElementById("sprint").style.height = (ganttdata.nodes.length * 50);
            setGarph()
        }
        const scrollWidth = currentMonth > 1 ? (isLeapYear(currentYear) ? 366 * unitLength : 365 * unitLength) : (isLeapYear(currentYear - 1) ? 366 * unitLength : 365 * unitLength);
        setScrollLeft(scrollWidth)

        document.getElementById('table-pic').scrollTo({ left: scrollWidth });
        document.getElementById('table-timer').scrollTo({ left: scrollWidth });
        return
    }, [ganttdata])

    // 画布节点数据
    

    //路线节点数据
    const setNode = (data) => {
        let nodes = [];
        let edges = [];
        let ylength = 0;
        data.map((item, index) => {
            //每个事项的开始结束日期转化为毫秒
            let startPra, endPra;
            let start = item?.startTime;
            startPra = Date.parse(start);

            let end = item?.endTime;
            endPra = Date.parse(end) + 86400000;
            if (startPra === endPra) {
                endPra = 86400000 + endPra;
            }
            // 每个事项的x轴
            let xAxis = Math.abs(startPra - firstDateMillisecond);
            xAxis = Math.floor(xAxis / archiveBase);

            // 每个事项的y轴
            let yAxis = ylength++ * 50 + 13;
            console.log(ylength, item.sprintName)
            // 每个事项持续时间
            let length = Math.abs(endPra - startPra);
            length = Math.floor(length / archiveBase);

            nodes.push(
                {
                    id: item.id,
                    index: index,
                    x: xAxis,
                    y: yAxis,
                    width: length,
                    height: 24,
                    attrs: {
                        body: {
                            rx: 5,
                            ry: 5,
                            fill: setTimeAxisStyle(item.sprintState.id), // 背景颜色
                            stroke: setTimeAxisStyle(item.sprintState.id),  // 边框颜色
                        },
                    }
                }
            )

            // 连接线的数据
            if (item.preDependWorkItem && item.preDependWorkItem.id) {
                edges.push({
                    // String，必须，起始节点 id
                    source: item.id,
                    // String，必须，目标节点 id
                    target: item.preDependWorkItem.id,
                    router: {
                        name: 'manhattan',
                    },
                    attrs: {
                        line: {
                            stroke: '#cfdef1',
                        },
                    },
                })
            }

            if (item.children && item.children.length > 0 && isExpandedTree(item.id)) {
                let childrenData = setNode(item.children)
                nodes = nodes.concat(childrenData.nodes)
                edges = edges.concat(childrenData.edges)
                // setGanttHeight()
            }
            return nodes;
        })
        let item = { nodes: nodes, edges: edges }
        return item;
    }

    /**
     * 时间轴数据
     * @returns 
     */
    const getDate = () => {
        const monthArray = [
            {
                year: currentYear - 1,
                firstmonth: currentMonth,
                lastmonth: 11,
            },
            {
                year: currentYear,
                firstmonth: 0,
                lastmonth: 11
            },
            {
                year: currentYear + 1,
                firstmonth: 0,
                lastmonth: currentMonth
            }
        ]
        const array = []
        monthArray.map((item) => {
            for (let i = item.firstmonth; i <= item.lastmonth; i++) {
                const year = item.year;
                const month = i + 1;
                const days = getMonthCount(item.year, i);
                // const date = `${year}-${month}-${day}`
                array.push({ month: `${year}年${month}月`, day: days, week: getWeekDay(year, month, days) })
            }
            return array
        })
        return array;
    }

    const getWeekDay = (year, month, days) => {
        const weeks = days.map(day => {
            const dateArray = `${year}-${month}-${day}`;
            const date = new Date(dateArray);
            const weekNum = date.getDay();
            const weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
            const week = weekArray[weekNum];
            return week;
        })
        return weeks;
    }

    /**
     * 1.获得每个月的日期有多少，判断平年闰年[四年一闰，百年不闰，四百年再闰]
     * @param {*} year 
     * @returns 
     */
    const isLeapYear = (year) => {
        return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
    };

    /**
     * 2.获得每个月的日期有多少，month - [0-11]
     * @param {*} year 
     * @param {*} month 
     * @returns 
     */
    const getMonthCount = (year, month) => {
        let arr = [
            31, null, 31, 30,
            31, 30, 31, 31,
            30, 31, 30, 31
        ];
        let count = arr[month] || (isLeapYear(year) ? 29 : 28);
        if (currentMonth === month && year === currentYear - 1) {
            return Array.from(new Array(count - currentDay + 1), (item, value) => value + currentDay);
        } else if (currentMonth === month && year === currentYear + 1) {
            return Array.from(new Array(currentDay), (item, value) => value + 1);
        } else {
            return Array.from(new Array(count), (item, value) => value + 1);
        }
    };

    const addChidEpic = (id) => {
        setShowEpicAddModal(true)
        setParentId(id)
        setAddChild("child")
    }

    // 树的展开与闭合

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }
    const setOpenOrClose = (key) => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }


    //绘制表格
    const tableTd = (data, fid, deep) => {
        return (data && data.length > 0 && data.map((item, index) => {
            return (
                <Fragment key={item.id}>
                    <ul className={`${index % 2 !== 0 && deep === 0 ? "table-grey" : ""}`}>
                        <li style={{ listStyleType: "none" }}>
                            <div key={item.id} className="table-tr ">
                                <div className="table-td table-border table-td-name" style={{ paddingLeft: deep * 16 + 10 }}>
                                    <div>
                                        {
                                            item.children && item.children.length > 0 ?
                                                <>

                                                    {
                                                        isExpandedTree(item.id) ?
                                                            <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-workDown"></use>
                                                            </svg> :
                                                            <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-workRight"></use>
                                                            </svg>
                                                    }
                                                </>
                                                :
                                                <>

                                                </>
                                        }
                                    </div>
                                    <div
                                        className="sprint-name"
                                        onClick={() => goEpicWorkDetail(item, index)}>
                                        {item.sprintName}
                                    </div>
                                </div>
                                <div className="table-td table-border table-td-status">
                                    <span className={`sprint-status ${setStatuStyle(item.sprintState.id)}`}>
                                        {item.sprintState.name}
                                    </span>
                                </div>
                                <div className="table-td table-border table-td-assigner">{item.master.name}</div>
                                {/* <div className="table-td table-border table-td-time">{item.startTime} ~ {item.endTime}</div> */}
                                <div className="table-gatter table-border"></div>
                            </div>
                            {
                                isExpandedTree(item.id) && <div>
                                    {
                                        item.children && item.children.length > 0 && tableTd(item.children, item.id, deep + 1)
                                    }
                                </div>
                            }


                        </li>
                    </ul>
                </Fragment>
            )
        }
        ))
    }

    /**
     * 横向滚动轴的拖动
     */
    const timerOuter = useRef();
    const timerCore = useRef();

    const ganttOuter = useRef();
    const ganttCore = useRef();

    /**
     * 纵向滚动轴的拖动
     */
    const timerColOuter = useRef();
    const timerColCore = useRef();

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "000000":
                name = "sprint-status-todo";
                break;
            case "111111":
                name = "sprint-status-process";
                break;
            case "222222":
                name = "sprint-status-done";
                break;
            default:
                name = "sprint-status-todo";
                break;
        }
        return name;
    }

    // 时间轴的样式
    const setTimeAxisStyle = (id) => {
        let color = "";
        switch (id) {
            case "000000":
                color = "#e2e1e4"
                break;
            case "111111":
                color = "#b0d5dfa1"
                break;
            case "222222":
                color = "#dfecd5e3"
                break;
            default:
                color = "#e2e1e4"
                break;
        }
        return color;
    }

    return (
        <div className="sprint-linemap">
            <div>
                <div className="linemap-time">
                    <div className="time-table">
                        <div className="table-hearder">
                            <div className="table-hearder-text table-border table-hearder-title">
                                标题
                            </div>
                            <div className="table-hearder-text table-border table-hearder-status">
                                状态
                            </div>
                            <div className="table-hearder-text table-border table-hearder-assigner">
                                负责人
                            </div>
                            {/* <div className="table-hearder-text table-border table-hearder-time">
                                时间
                            </div> */}
                            <div className="table-hearder-gatter table-border" id="table-timer" ref={timerOuter}>
                                <div className="table-timer" >
                                    <div className="table-month" id="table-month" ref={timerCore}>
                                        {
                                            dateArray && dateArray.map((item, index) => {
                                                return <div style={{ width: `${unitLength * item.day.length}px`, height: archiveView === "week" ? "25px" : "50px", lineHeight: archiveView === "week" ? "25px" : "50px" }} key={index} className="table-month-td">
                                                    {item.month}
                                                </div>
                                            })
                                        }
                                    </div>
                                    {
                                        archiveView === "week" && <div className="table-date" id="table-date">
                                            {
                                                dateArray && dateArray.map((item, index) => {
                                                    return item.day.map((dayitem, dayindex) => {
                                                        return <div style={{ width: unitLength, maxWidth: unitLength, height: "25px", flexShrink: 0 }}
                                                            className={`table-day ${(item.week[dayindex] === "日" || item.week[dayindex] === "六") ? "table-week" : ""} ${(item.week[dayindex] === "日") ? "table-weekday" : ""}`}
                                                            key={`${index}${dayindex}`}
                                                        >
                                                            {dayitem}
                                                        </div>
                                                    })
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="table-body " id="tale-body" ref={timerColOuter}>
                            <div ref={timerColCore}>
                                <li style={{ listStyleType: "none" }} id="table-content" >
                                    {
                                        tableTd(data, 0, 0)
                                    }
                                </li>
                                <div className="table-pic" id="table-pic" ref={ganttOuter}>
                                    <div id="sprint" ref={ganttCore} style={{ width: ganttWidth, zIndex: 1 }} className="gantt-box" />
                                    <div className="table-date-background">
                                        {
                                            archiveView === "month" && dateArray && dateArray.map((item, index) => {
                                                return <div
                                                    style={{ width: `${unitLength * item.day.length}px` }}
                                                    key={index}
                                                    className="table-month"
                                                />
                                            })
                                        }
                                        {
                                            archiveView === "week" && dateArray && dateArray.map((item, index) => {
                                                return item.day.map((dayitem, dayindex) => {
                                                    return <div style={{ width: unitLength, maxWidth: unitLength }}
                                                        className={`${(item.week[dayindex] === "日") ? "table-weekday" : ""}`}
                                                        key={`${index}${dayindex}`}
                                                    >
                                                    </div>
                                                })

                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <RowScroll
                    timerCore={timerCore}
                    timerOuter={timerOuter}
                    ganttCore={ganttCore}
                    ganttOuter={ganttOuter}
                    ganttWidth={ganttWidth}
                    scrollLeft={scrollLeft}
                />
                {
                    data && data.length > 15 && <ColScroll
                        timerCore={timerColCore}
                        timerOuter={timerColOuter}
                        ganttCore={ganttCore}
                        ganttOuter={ganttOuter}
                    />
                }
            </div>


        </div>
    )
}

export default withRouter(inject("lineMapStore")(observer(SprintLineMap))); 