import React, { useEffect, useState, Fragment, useRef } from "react";
import { Graph } from '@antv/x6';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import "./gantt.scss";
import RowScroll from "./RowScroll";
import ColScroll from "./ColScroll";
import dayjs from 'dayjs';
import moment from "moment";
import ImgComponent from "../../common/imgComponent/ImgComponent";
const Gantt = (props) => {
    const { workList, editWork, archiveView, projectId, workStore,WorkDetailDrawer } = props;
    const {createRecent, setWorkIndex, setWorkId, } = workStore;
    const todayDate = new Date()
    const currentYear = todayDate.getFullYear()
    const currentMonth = todayDate.getMonth()
    const currentDay = todayDate.getDate()
    const [ganttWidth, setGanttWidth] = useState()
    const [ganttHeight, setGanttHeight] = useState()

    const startDate = dayjs().subtract(1, "year").format("YYYY-MM-DD");
    const endDate = dayjs().add(1, "year").format("YYYY-MM-DD");

    const firstDateMillisecond = Date.parse(startDate);

    const [ganttdata, setGantt] = useState()
    const [expandedTree, setExpandedTree] = useState([])
    const [graph, getGraph] = useState()

    const archiveBase = archiveView === "month" ? 3600 * 1000 * 2.4 : 3600 * 1000;
    const unitLength = archiveView === "month" ? 10 : 24;

    // 事项详情是否显示
    const modelRef = useRef()
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        // let start = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`;
        // let end = `${currentYear + 1}.${currentMonth + 1}.${currentDay}`
        let start = Date.parse(startDate);
        let end = Date.parse(endDate);
        start = Date.parse(start);
        end = Date.parse(end);
        let graphWidth = Math.abs(start - end);
        graphWidth = Math.floor(graphWidth / (3600 * 1000));
        setGanttWidth(graphWidth)
        const graph = new Graph({
            container: document.getElementById('tableGantt'),
            width: graphWidth,
            // height: graphHeight,
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


        graph.on("node:change:size", ({ node, options }) => {
            const nodeBox = node.getBBox();

            const workId = node.id;



            const direction = options.relativeDirection;
            const startX = nodeBox.x;
            const nodeWidth = nodeBox.width;
            if (direction === "left") {
                let params = { id: "", planBeginTime: "", updateField: "" };
                params.id = workId;
                let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
                firstDate = Date.parse(firstDate);
                const dataTime = startX * (1000 * 3600) + firstDate;
                let day = moment(dataTime).format('YYYY-MM-DD HH:mm:ss');
                params.planBeginTime = day;
                params.updateField = "planBeginTime"
            }
            if (direction === "right") {
                let params = { id: "", planEndTime: "", updateField: "" };
                params.id = workId;
                let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
                firstDate = Date.parse(firstDate);
                const dataTime = (startX + nodeWidth) * (1000 * 3600) + firstDate;
                let day = moment(dataTime).format('YYYY-MM-DD HH:mm:ss');
                params.planEndTime = day;
                params.updateField = "planEndTime";
                editWork(params);
            }


        })

        graph.on("node:moved", ({ node, options }) => {
            console.log("sss")
            const nodeBox = node.getBBox();
            const workId = node.id;
            const startX = nodeBox.x;
            const nodeWidth = nodeBox.width;
            let params = { id: "", planBeginTime: "", planEndTime: "" };
            params.id = workId;
            let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
            firstDate = Date.parse(firstDate);


            let planBeginTime = startX * (1000 * 3600) + firstDate;
            planBeginTime = moment(planBeginTime).format('YYYY-MM-DD HH:mm:ss');
            params.planBeginTime = planBeginTime;
            params.updateField = "planBeginTime"
            editWork(params)

            let planEndTime = (startX + nodeWidth) * (1000 * 3600) + firstDate;
            planEndTime = moment(planEndTime).format('YYYY-MM-DD HH:mm:ss');
            params.planEndTime = planEndTime;
            params.updateField = "planEndTime"
            editWork(params)
        })
        getGraph(graph);
        return;
    }, [])


    const setGarph = () => {
        // graph.clearCells(false)
        graph.fromJSON(ganttdata)

    }


    //解决异步问题
    const [scrollLeft, setScrollLeft] = useState()
    const [isShowCol, setIsShowCol] = useState(false)
    useEffect(() => {
        if (ganttdata !== undefined) {
            document.getElementById("tableGantt").style.height = (ganttdata.nodes.length * 50);
            document.getElementById("table-date-background").style.height = (ganttdata.nodes.length * 50);
            const picBoxHeight = document.getElementById('table-pic').offsetHeight;
            if (picBoxHeight < ganttdata.nodes.length * 50) {
                setIsShowCol(true)
                document.getElementById("tableGantt").style.height = (ganttdata.nodes.length * 50 + 30);
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


    useEffect(() => {
        let gantt;
        if (workList && workList.length > 0) {
            setGantt()
            gantt = setNode(workList)
            setGantt(gantt)
            setGanttHeight(gantt.length / 2 * 50)
        }

        return
    }, [workList, expandedTree])

    // 画布节点数据
    let ylength = 0;

    const goWorkDetail = (workItem, index) => {
        const params = {
            name: workItem.title,
            model: "workItem",
            modelId: workItem.id,
            project: { id: projectId },
            iconUrl: workItem.workTypeSys.iconUrl
        }

        createRecent(params)

        setWorkIndex(index)
        setWorkId(workItem.id)
        setIsModalVisible(true)
        sessionStorage.setItem("detailCrumbArray", JSON.stringify([{ id: workItem.id, code: workItem.code, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }]));
        props.history.replace(`/project/${projectId}/workgantt/${workItem.id}`)

        setIsModalVisible(true)

    }

    const setNode = (data) => {
        let nodes = [];
        let edges = []
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

    // 时间轴数据
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
        monthArray.map((item, index) => {
            for (let i = item.firstmonth; i <= item.lastmonth; i++) {
                array.push({ month: `${item.year}年${i + 1}月`, day: getMonthCount(item.year, i) })
            }
            return array
        })
        return array;
    }


    // 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
    const isLeapYear = (year) => {
        return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
    };


    // 2.获得每个月的日期有多少，注意 month - [0-11]
    const getMonthCount = (year, month) => {
        let arr = [
            31, null, 31, 30,
            31, 30, 31, 31,
            30, 31, 30, 31
        ];
        let count = arr[month] || (isLeapYear(year) ? 29 : 28);
        if (currentMonth === month && year === currentYear - 1) {
            if(dayjs().format("MM-DD") === "02-29"){
                return [28]
            }else {
                return Array.from(new Array(count - currentDay + 1), (item, value) => value + currentDay);
            }
        } else if (currentMonth === month && year === currentYear + 1) {
            return Array.from(new Array(currentDay), (item, value) => value + 1);
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
            backgroundColor: "var(--thoughtware-blue)",
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

    

    const [dateArray, setdateArray] = useState(getDate())
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

    const tableTd = (data, fid, deep) => {
        return (data && data.length > 0 && data.map((item, index) => {
            return (
                <Fragment key={item.id}>
                    <ul className={`${index % 2 !== 0 && deep === 0 ? "table-grey" : ""}`}>
                        <li style={{ listStyleType: "none" }}>
                            <div key={item.id} className={`table-tr`}>
                                <div className="table-td table-border table-td-name" style={{ paddingLeft: deep * 16 + 10 }}>
                                    <div className="table-work-name">
                                        {
                                            item.children && item.children.length > 0 ?
                                                <>

                                                    {
                                                        isExpandedTree(item.id) ?
                                                            <svg className="img-icon-right" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-workDown"></use>
                                                            </svg> :
                                                            <svg className="img-icon-right" aria-hidden="true" onClick={() => setOpenOrClose(item.id)}>
                                                                <use xlinkHref="#icon-workRight"></use>
                                                            </svg>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <svg className="img-icon-right" aria-hidden="true">
                                                        <use xlinkHref="#icon-point"></use>
                                                    </svg>
                                                </>
                                        }
                                         <ImgComponent
                                            src = {item.workTypeSys?.iconUrl}
                                            alt=""
                                            className="img-icon"
                                        />
                                        <span className="table-work-id">{item.id}</span>
                                        <div className="table-work-text" onClick={() => goWorkDetail(item, index)}>{item.title}</div>
                                    </div>
                                </div>
                                <div className={`table-td table-border table-td-status`}>
                                    <span className={`work-status ${setStatuStyle(item.workStatusNode.id)}`}>
                                        {item.workStatusNode.name}
                                    </span>
                                </div>
                                <div className={`table-td table-border table-td-assigner`}>
                                    {item.assigner?.name}
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

    return (
        <>
            <div className="work-time">
                <div style={{ position: "relative" }}>
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
                        <div className="table-body" id="table-body" ref={timerColOuter}>
                            <div ref={timerColCore}>
                                <li style={{ listStyleType: "none" }}>
                                    {
                                        tableTd(workList, 0, 0)
                                    }
                                </li>
                                <div className="table-pic" id="table-pic" ref={ganttOuter}>
                                    <div id="tableGantt" ref={ganttCore} style={{ width: ganttWidth }} className="gantt-box" />
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
                            </div>
                        </div>
                    </div>
                </div>

                {
                    ganttdata && (ganttdata.nodes.length / 2) > 15 && <ColScroll
                        timerCore={timerColCore}
                        timerOuter={timerColOuter}
                        ganttCore={ganttCore}
                        ganttOuter={ganttOuter}
                    />
                }
            </div>
            {
                scrollLeft && <RowScroll
                    timerCore={timerCore}
                    timerOuter={timerOuter}
                    ganttCore={ganttCore}
                    ganttOuter={ganttOuter}
                    ganttWidth={ganttWidth}
                    scrollLeft={scrollLeft}
                />
            }

            <WorkDetailDrawer
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                modelRef={modelRef}
                {...props}
            />
            {/* <Pagination className="work-gantee-pagetion" defaultCurrent={1} total={total} onChange ={(page, pagesize) => changePage(page)}/> */}
        </>
    )
}

export default Gantt;