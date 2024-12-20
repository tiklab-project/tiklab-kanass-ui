/*
 * @Descripttion: 路线图表格页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:49:26
 */
import React, { useEffect, useState, Fragment, useRef } from "react";
import { observer, inject } from "mobx-react";
import { Graph } from '@antv/x6';
import "./LineMap.scss";
// import "./Epic.scss"
import RowScroll from "./RowScroll";
import ColScroll from "./CoLScroll"
import { withRouter } from "react-router";
import dayjs from 'dayjs';
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import { setSessionStorage } from "../../../common/utils/setSessionStorage";
import WorkCreatDropdown from "../../../work/components/workCreatDropdown";
import { useDebounce } from "../../../common/utils/debounce";
import { getUser } from "tiklab-core-ui";
import { removeNodeInTree } from "../../../common/utils/treeDataAction";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";

const EpicLineMap = (props) => {
    // 获取当前年月日
    const { data, totalPage, total, currentPage,
        archiveView, setGraph, graph, workStore, changePage, workTypeList } = props;
    const { setWorkId, setWorkIndex, createRecent, editWork, setWorkList,
        getWorkConditionPageTree, deleteWorkItem, workList } = workStore;

    const todayDate = new Date()
    const currentYear = todayDate.getFullYear()
    const currentMonth = todayDate.getMonth() + 1;
    const currentDay = todayDate.getDate()
    const startDate = dayjs().subtract(1, "year").format("YYYY-MM-DD");
    const endDate = dayjs().add(1, "year").format("YYYY-MM-DD");
    const firstDateMillisecond = Date.parse(startDate);
    const [dateArray, setdateArray] = useState()
    // 路线图的宽
    const [ganttWidth, setGanttWidth] = useState(0)
    // 使用于路线图显示的数据
    const [ganttdata, setGantt] = useState();
    const [expandedTree, setExpandedTree] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modelRef = useRef()


    const archiveBase = archiveView === "month" ? 3600 * 1000 * 2.4 : 3600 * 1000;
    const unitLength = archiveView === "month" ? 10 : 24;
    const project = JSON.parse(localStorage.getItem("project"));

    const projectId = props.match.params.id;



    useEffect(() => {
        if (data.length > 0) {
            setGantt(setNode(data))
        }
        return
    }, [data, expandedTree])

    useEffect(() => {
        if (data.length > 0) {
            setGantt(setNode(data))
        }
    }, [currentPage])

    // 切换视图
    useEffect(() => {
        // 画布参数
        if (ganttCore?.current) {
            setdateArray(getDate())
            creatGraph()

            setGantt(setNode(data))
        }

        return;
    }, [archiveView])

    // 删除事项
    const deleteWork = (id) => {
        deleteWorkItem(id).then(() => {
            removeNodeInTree(workList, null, id)
            setIsModalVisible(false)
            if (workList.length == 0) {
                getWorkConditionPageTree()
            } else {
                setWorkList([...workList])
            }
        })

    }



    const creatGraph = () => {
        if (graph) {
            graph.dispose()
        }
        // 开始与结束日期，解析一个表示某个日期的字符串，
        // 并返回从1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的UTC时间）的毫秒数
        // let start = `${currentYear - 1}.${currentMonth}.${currentDay}`;
        // let end = `${currentYear + 1}.${currentMonth}.${currentDay}`;
        let start = Date.parse(startDate);
        let end = Date.parse(endDate);

        // 用开始日期与结束日期定义画布的宽度
        let graphWidth = Math.abs(start - end);


        graphWidth = Math.floor(graphWidth / archiveBase) + unitLength
        setGanttWidth(graphWidth)


        const graph = new Graph({
            container: document.getElementById("epic"),
            width: graphWidth,
            autoResize: true,
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

        graph.on("node:change:position", ({ node }) => updateByChangeNodePosition({ node }))

        graph.on("node:change:size", ({ node, options }) => updateByChangeNodeSize({ node, options }))

        setGraph(graph)
    }

    const updateByChangeNodePosition = useDebounce(({ node, options }) => {

        const nodeBox = node.getBBox();
        const workItemId = node.id;
        const index = node.store.data.index;
        const startX = nodeBox.x;
        const nodeWidth = nodeBox.width;

        let endTime = (startX + nodeWidth) * archiveBase + firstDateMillisecond;
        endTime = dayjs(endTime).subtract(1, "day").format('YYYY-MM-DD');
        const params1 = {
            id: workItemId,
            updateField: "planEndTime",
            planEndTime: endTime
        }
        editWork(params1)

        let startTime = startX * archiveBase + firstDateMillisecond;
        startTime = dayjs(startTime).format('YYYY-MM-DD');
        const params2 = {
            id: workItemId,
            updateField: "planBeginTime",
            planBeginTime: startTime
        }
        editWork(params2)
        data[index].planBeginTime = startTime;
        data[index].planEndTime = endTime;
    }, [500])

    const updateByChangeNodeSize = useDebounce(({ node, options }) => {
        const nodeBox = node.getBBox();
        const index = node.store.data.index;
        const workItemId = node.id;
        const direction = options.relativeDirection;
        const startX = nodeBox.x;
        const nodeWidth = nodeBox.width;

        if (direction === "right") {
            const dataTime = (startX + nodeWidth) * archiveBase + firstDateMillisecond;
            let day = dayjs(dataTime).subtract(1, "day").format('YYYY-MM-DD');
            const params = {
                id: workItemId,
                updateField: "planEndTime",
                planEndTime: day
            }
            editWork(params).then(res => {
                if (res.code === 0) {
                    data[index].planEndTime = day;
                }
            })
        }
        if (direction === "left") {
            const dataTime = startX * archiveBase + firstDateMillisecond;
            let day = dayjs(dataTime).format('YYYY-MM-DD');
            // params.planBeginTime = day;

            const params = {
                id: workItemId,
                updateField: "planBeginTime",
                planBeginTime: day
            }
            editWork(params).then(res => {
                if (res.code === 0) {
                    data[index].planBeginTime = day;
                }
            })
        }

    }, [500])

    //渲染画布
    const setGarph = () => {
        graph.fromJSON(ganttdata)
    }

    /**
     * 解决异步问题
     * 路线渲染数据变化就从新渲染画布
     */
    const [scrollLeft, setScrollLeft] = useState()
    const [isShowCol, setIsShowCol] = useState(false)
    useEffect(() => {
        if (ganttdata !== undefined) {
            document.getElementById("epic").style.height = (ganttdata.nodes.length * 50);
            document.getElementById("table-date-background").style.height = (ganttdata.nodes.length * 50);
            const picBoxHeight = document.getElementById('table-pic').offsetHeight;
            if (picBoxHeight < ganttdata.nodes.length * 50) {
                setIsShowCol(true)
                document.getElementById("epic").style.height = (ganttdata.nodes.length * 50 + 30);
                document.getElementById("table-date-background").style.height = (ganttdata.nodes.length * 50 + 30);
            } else {
                setIsShowCol(false)
            }
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
            let start = item?.planBeginTime;
            startPra = Date.parse(start?.substring(0, 10));

            let end = item?.planEndTime;
            endPra = Date.parse(end?.substring(0, 10)) + 86400000;
            // 画布开始时间转化为毫秒

            // 每个事项的x轴
            let xAxis = startPra - firstDateMillisecond;
            xAxis = Math.floor(xAxis / archiveBase);

            // 每个事项的y轴
            let yAxis = ylength++ * 50 + 13;

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
                            fill: setTimeAxisStyle(item.workStatusNode.id).backgroundColor, // 背景颜色
                            stroke: setTimeAxisStyle(item.workStatusNode.id).backgroundColor,  // 边框颜色
                        },
                    }
                }
            )

            // 连接线的数据
            if (item.preDependWorkItem && item.preDependWorkItem.id && havePreDependWorkItem(data, item.preDependWorkItem.id)) {
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
     * 判断前置事项是否在当前列表中
     */
    const havePreDependWorkItem = (list, preWorkItemId) => {
        return list.some(item => item.id === preWorkItemId)
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
                lastmonth: 12,
            },
            {
                year: currentYear,
                firstmonth: 1,
                lastmonth: 12
            },
            {
                year: currentYear + 1,
                firstmonth: 1,
                lastmonth: currentMonth
            }
        ]
        const array = []
        monthArray.map((item) => {
            for (let i = item.firstmonth; i <= item.lastmonth; i++) {
                const year = item.year;
                const month = i;
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
     * 2.获得每个月的日期有多少，month - [1-12]
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
        let count = arr[month - 1] || (isLeapYear(year) ? 29 : 28);
        if (currentMonth === month && year === currentYear - 1) {
            // 如果今天是2024年2月29号
            if (dayjs().format("MM-DD") === "02-29") {
                return [28]
            } else {
                return Array.from(new Array(count - currentDay + 1), (item, value) => value + currentDay);
            }
        } else if (currentMonth === month && year === currentYear + 1) {
            // 如果今天是2024年2月29号
            if (dayjs().format("MM-DD") === "02-29") {
                return Array.from(new Array(currentDay - 1), (item, value) => value + 1);
            } else {
                return Array.from(new Array(currentDay), (item, value) => value + 1);
            }
        } else {
            return Array.from(new Array(count), (item, value) => value + 1);
        }
    };


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

    const goEpicWorkDetail = (workItem, index) => {
        const params = {
            name: workItem.title,
            model: "workItem",
            modelId: workItem.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: workItem.workTypeSys.iconUrl
        }

        createRecent(params)

        setWorkIndex(index)
        setWorkId(workItem.id)
        setIsModalVisible(true)
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, code: workItem.code, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])
        props.history.replace(`/project/${projectId}/linemap/${workItem.id}`)

        setIsModalVisible(true)

    }
    //绘制表格
    const tableTd = (data, fid, deep) => {
        return (data && data.length > 0 && data.map((item, index) => {
            return (
                <Fragment key={item.id}>
                    <ul className={`${index % 2 !== 0 && deep === 0 ? "table-grey" : ""}`}>
                        <li style={{ listStyleType: "none" }}>
                            <div key={item.id} className={`table-tr`}>
                                <div className="table-td table-border table-td-name" style={{ paddingLeft: deep * 16 + 10 }}>
                                    <div className="epic-name">
                                        {
                                            item.children && item.children.length > 0 ?
                                                <>

                                                    {
                                                        isExpandedTree(item.id) ?
                                                            <svg className="icon-10" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-workDown"></use>
                                                            </svg> :
                                                            <svg className="icon-10" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-workRight"></use>
                                                            </svg>
                                                    }
                                                </>
                                                :
                                                <div className="icon-10">
                                                </div>
                                        }
                                        <ImgComponent
                                            src={item.workTypeSys?.iconUrl}
                                            alt=""
                                            className="img-25"
                                        />
                                        <div className="epic-title">
                                            <span className="epic-key">{item.code}</span>
                                            <div className="epic-text" onClick={() => goEpicWorkDetail(item, index)}>{item.title}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`table-td table-border table-td-status`}>
                                    <span className={`work-status ${setStatuStyle(item.workStatusNode.id)}`}>
                                        {item.workStatusNode.name}
                                    </span>
                                </div>
                                <div className={`table-td table-border table-td-assigner`}>
                                    <UserIcon name={item.master?.nickname} size="small" />
                                    {item.assigner?.nickname}
                                </div>
                                {/* <div className="table-td table-border table-td-time">{item.planBeginTime?.slice(0, 10)} ~ {item.planEndTime?.slice(0, 10)}</div> */}
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

    // 表格的状态样式
    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case "todo":
                name = "work-status-todo";
                break;
            case "done":
                name = "work-status-done";
                break;
            default:
                name = "work-status-process";
                break;
        }
        return name;
    }

    // 时间轴的样式
    const setTimeAxisStyle = (id) => {
        let color = {
            backgroundColor: "var(--tiklab-blue)",
            borderColor: "#fff"
        };
        switch (id) {
            case "todo":
                color = {
                    backgroundColor: "#e2e1e4",
                    borderColor: "#e2e1e4"
                }
                break;
            case "done":
                color = {
                    backgroundColor: "#dfecd5e3",
                    borderColor: "#dfecd5e3"
                }
                break;
            default:
                color = {
                    backgroundColor: "#b0d5dfa1",
                    borderColor: "#b0d5dfa1"
                }
                break;
        }
        return color;
    }

    const delectCurrentWorkItem = () => {

    }
    return (
        <div className="epic-linemap">
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
                                <div id="epic" ref={ganttCore} style={{ width: ganttWidth, zIndex: 1 }} className="gantt-box" />
                                <div className="table-date-background" id="table-date-background">
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
                            {
                                data.length <= 0 && <div className="epci-empty">
                                    没有需求和需求集，点击<WorkCreatDropdown workTypeList={workTypeList}  {...props} modelStyle={{ right: 0 }} />添加
                                </div>
                            }
                            {
                                totalPage > 0 && <>
                                    {
                                        <div className="epic-change-page" >
                                            <div>{data.length}个, 共{total}个</div>
                                            {
                                                currentPage < totalPage ? <div className="change-page-button" onClick={() => changePage()}>点击加载</div>
                                                    :
                                                    <div style={{ paddingLeft: "10px" }}>已加载全部</div>

                                            }
                                        </div>
                                    }
                                </>
                            }

                        </div>

                    </div>
                </div>
            </div>
            {
                totalPage > 0 && <>
                    {
                        <div className="epic-change-page" >
                            <div>{workList.length}个, 共{total}个</div>
                            {
                                currentPage < totalPage ? <div className="change-page-button">点击加载</div>
                                    :
                                    <div style={{ paddingLeft: "10px" }}>已加载全部</div>

                            }
                        </div>
                    }
                </>
            }
            {
                isShowCol && <ColScroll
                    timerCore={timerColCore}
                    timerOuter={timerColOuter}
                    ganttCore={ganttCore}
                    ganttOuter={ganttOuter}
                    isModalVisible={isModalVisible}
                />
            }
            <RowScroll
                timerCore={timerCore}
                timerOuter={timerOuter}
                ganttCore={ganttCore}
                ganttOuter={ganttOuter}
                ganttWidth={ganttWidth}
                scrollLeft={scrollLeft}
            />
            <WorkDetailDrawer
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                modelRef={modelRef}
                showPage={true}
                // deleteWork = {deleteWork}
                delectCurrentWorkItem={deleteWork}
                {...props}
            />


        </div>
    )
}

export default withRouter(inject("lineMapStore", "workStore")(observer(EpicLineMap))); 