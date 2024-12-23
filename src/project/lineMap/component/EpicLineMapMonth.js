/*
 * @Descripttion: 路线图表格页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useEffect, useState, Fragment, useRef } from "react";
import { observer, inject } from "mobx-react";
import { Graph } from '@antv/x6';
import "./LineMap.scss";
import "./Epic.scss"
import RowScroll from "./RowScroll";
import ColScroll from "./CoLScroll"
import { withRouter } from "react-router";
import moment from 'moment';
const EpicLineMap = (props) => {
    // 获取当前年月日
    const { data, setShowEpicAddModal, setAddChild, setParentId, lineMapStore, } = props;
    const { updateEpic, createRecent } = lineMapStore;
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

    const projectId = props.match.params.id;
    // 画布
    const [graph, getGraph] = useState()

    useEffect(() => {
        // 画布参数
        if (ganttCore?.current) {
            setdateArray(getDate())
            creatGraph()
        }

        return;
    }, [])


    const creatGraph = () => {
        // 开始与结束日期，解析一个表示某个日期的字符串，
        // 并返回从1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的UTC时间）的毫秒数
        let start = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`;
        let end = `${currentYear + 1}.${currentMonth + 1}.${currentDay}`
        start = Date.parse(start);
        end = Date.parse(end);

        // 用开始日期与结束日期定义画布的宽度
        let graphWidth = Math.abs(start - end);
        graphWidth = Math.floor(graphWidth / (3600 * 1000)) + 24;
        setGanttWidth(graphWidth)
        const graph = new Graph({
            container: document.getElementById("epic"),
            width: graphWidth,
            grid: {
                size: 24,
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

        graph.on("node:change:position", ({ node, options }) => {
            const nodeBox = node.getBBox();
            const sprintId = node.id;
            const startX = nodeBox.x;
            const nodeWidth = nodeBox.width;
            let params = { id: "", startTime: "", endTime: "" };
            params.id = sprintId;
            let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
            firstDate = Date.parse(firstDate);

            let endTime = (startX + nodeWidth) * (1000 * 3600) + firstDate;
            endTime = moment(endTime).format('YYYY-MM-DD');
            params.endTime = endTime;

            let startTime = startX * (1000 * 3600) + firstDate;
            startTime = moment(startTime).format('YYYY-MM-DD');
            params.startTime = startTime;
            updateEpic(params)
        })

        graph.on("node:change:size", ({ node, options }) => {
            const nodeBox = node.getBBox();

            const sprintId = node.id;
            let params = { id: "", startTime: "", endTime: "" };
            params.id = sprintId;

            const direction = options.relativeDirection;
            const startX = nodeBox.x;
            const nodeWidth = nodeBox.width;
            if (direction === "right") {
                let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
                firstDate = Date.parse(firstDate);
                const dataTime = (startX + nodeWidth) * (1000 * 3600) + firstDate;
                let day = moment(dataTime).format('YYYY-MM-DD');
                params.endTime = day;
            }
            if (direction === "left") {
                let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
                firstDate = Date.parse(firstDate);
                const dataTime = startX * (1000 * 3600) + firstDate;
                let day = moment(dataTime).format('YYYY-MM-DD');
                params.startTime = day;
            }
            updateEpic(params)

        })

        getGraph(graph)
    }

    //渲染画布
    const setGarph = () => {
        graph.fromJSON(ganttdata)
    }

    /**
     * 解决异步问题
     * 路线渲染数据变化就从新渲染画布
     */
    const [scrollLeft, setScrollLeft] = useState()
    useEffect(() => {
        if (ganttdata !== undefined) {
            document.getElementById("epic").style.height = (ganttdata.nodes.length * 50);
            setGarph()
        }
        const scrollWidth = currentMonth > 1 ? (isLeapYear(currentYear) ? 366 * 24 : 365 * 24) : (isLeapYear(currentYear - 1) ? 366 * 24 : 365 * 24);
        setScrollLeft(scrollWidth)

        document.getElementById('table-pic').scrollTo({ left: scrollWidth });
        document.getElementById('table-timer').scrollTo({ left: scrollWidth });
        return
    }, [ganttdata])

    //原始数据变化重新计算路线渲染数据
    useEffect(() => {
        if (data.length > 0) {
            setGantt(setNode(data))
        }
        return
    }, [data])

    useEffect(() => {
        if (data.length > 0) {
            setGantt(setNode(data))
        }
        return
    }, [expandedTree])


    // 画布节点数据
    let ylength = 0;

    //路线节点数据
    const setNode = (data) => {
        let nodes = [];
        let edges = []
        data.map((item) => {
            //每个事项的开始结束日期转化为毫秒
            let startPra, endPra;
            let start = item?.planBeginTime;
            startPra = Date.parse(start);

            let end = item?.planEndTime;
            endPra = Date.parse(end);

            // 画布开始时间转化为毫秒
            let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
            firstDate = Date.parse(firstDate);

            // 每个事项的x轴
            let xAxis = Math.abs(startPra - firstDate);
            xAxis = Math.floor(xAxis / (3600 * 1000));

            // 每个事项的y轴
            let yAxis = ylength++ * 50 + 13;

            // 每个事项持续时间
            let length = Math.abs(endPra - startPra);
            length = Math.floor(length / (3600 * 1000));

            nodes.push(
                {
                    id: item.id,
                    x: xAxis,
                    y: yAxis,
                    width: length,
                    height: 24,
                    attrs: {
                        body: {
                            fill: 'var(--tiklab-blue)', // 背景颜色
                            stroke: 'var(--tiklab-gray-400)',  // 边框颜色
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

            if (item.children && item.children.length > 0 && !isExpandedTree(item.id)) {
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
                array.push({ month: `${item.year}年${i + 1}月`, day: getMonthCount(item.year, i) })
            }
            return array
        })
        return array;
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

    const goEpicDetail = (item) => {
        props.history.push(`/project/${projectId}/epic/${item.id}`)

    }
    //绘制表格
    const tableTd = (data, fid, deep) => {
        return (data && data.length > 0 && data.map((item) => {
            return (
                <Fragment key={item.id}>
                    <ul className={isExpandedTree(fid) ? "table-hidden" : null}>
                        <li style={{ listStyleType: "none" }}>
                            <div key={item.id} className="table-tr ">
                                <div className="table-td table-border table-td-name">
                                    <div>
                                        {
                                            item.children && item.children.length > 0 &&
                                            <>
                                                {
                                                    isExpandedTree(item.id) ?
                                                        <svg className="botton-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                            <use xlinkHref="#icon-down"></use>
                                                        </svg>
                                                        :
                                                        <svg className="botton-icon" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                            <use xlinkHref="#icon-right"></use>
                                                        </svg>
                                                }
                                            </>
                                        }
                                    </div>
                                    <div
                                        className="epic-name-left-name"
                                        onClick={() => goEpicDetail(item)}>
                                        {item.title}
                                    </div>
                                </div>
                                <div className="table-td table-border table-td-status">{item.workStatusNode.name}</div>
                                <div className="table-td table-border table-td-time">{item.planBeginTime} ~ {item.planEndTime}</div>
                                <div className="table-gatter table-border"></div>
                            </div>
                            {
                                item.children && item.children.length > 0 && tableTd(item.children, item.id, deep + 1)
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

    //  const ganttOuter = useRef();
    //  const ganttCore = useRef();


    return (
        <div className="epic-linemap">
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
                            <div className="table-hearder-text table-border table-hearder-time">
                                时间
                            </div>
                            <div className="table-hearder-gatter table-border" id="table-timer" ref={timerOuter}>
                                <div className="table-timer" >
                                    <div className="table-month" id="table-month" ref={timerCore}>
                                        {
                                            dateArray && dateArray.map((item, index) => {
                                                return <div style={{ width: `${24 * item.day.length}px`, height: "25px" }} key={index} className="table-month-td">
                                                    {item.month}
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className="table-date" id="table-date">
                                        {
                                            dateArray && dateArray.map((item, index) => {
                                                return item.day.map((dayitem, dayindex) => {
                                                    return <div style={{ width: "24px", height: "25px" }} className="table-day" key={`${index}${dayindex}`}>
                                                        {dayitem}
                                                    </div>
                                                })

                                            })
                                        }
                                    </div>
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
                                    <div id="epic" ref={ganttCore} style={{ width: ganttWidth }} className="gantt-box" />
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

export default withRouter(inject("lineMapStore")(observer(EpicLineMap))); 