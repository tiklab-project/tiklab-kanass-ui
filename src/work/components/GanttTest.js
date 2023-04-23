import React,{ useEffect, useState, Fragment, useRef } from "react";
import { Graph } from '@antv/x6';
import { PlusCircleOutlined,MinusCircleOutlined } from '@ant-design/icons';
import "./GanttTest.scss";
import RowScroll from "./RowScroll";
import ColScroll from "./colScroll";
import moment from "moment";
const Gantt=(props) => {
    const {workList, editWork}= props;
    const todayDate = new Date()
    const currentYear = todayDate.getFullYear()
    const currentMonth = todayDate.getMonth()
    const currentDay = todayDate.getDate()  
    const [ganttWidth,setGanttWidth] = useState()  
    const [ganttHeight,setGanttHeight] = useState() 
    
    
    const [ganttdata,setGantt] = useState()
    const [expandedTree, setExpandedTree] = useState([])
    const [graph,getGraph] = useState()
   
    useEffect(()=> {
        let start = `${currentYear-1}.${currentMonth+1}.${currentDay}`;
        let end = `${currentYear+1}.${currentMonth+1}.${currentDay}`
        start = Date.parse(start);
        end = Date.parse(end);
        let graphWidth = Math.abs(start-end);
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
                let day = moment(dataTime).format('YYYY-MM-DD');
                params.planBeginTime = day;
                params.updateField = "planBeginTime"
            }
            if (direction === "right") {
                let params = { id: "", planEndTime: "", updateField: "" };
                params.id = workId;
                let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
                firstDate = Date.parse(firstDate);
                const dataTime = (startX + nodeWidth) * (1000 * 3600) + firstDate;
                let day = moment(dataTime).format('YYYY-MM-DD');
                params.planEndTime = day;
                params.updateField = "planEndTime";
                editWork(params);
            }
            
            
        })

        graph.on("node:moved",({ node, options }) => {
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
            planBeginTime = moment(planBeginTime).format('YYYY-MM-DD');
            params.planBeginTime = planBeginTime;
            params.updateField = "planBeginTime"
            editWork(params)

            let planEndTime = (startX + nodeWidth) * (1000 * 3600) + firstDate;
            planEndTime = moment(planEndTime).format('YYYY-MM-DD');
            params.planEndTime = planEndTime;
            params.updateField = "planEndTime"
            editWork(params)
        })
        getGraph(graph);
        return;
    },[])
    

    const setGarph = ()=> {
        // graph.clearCells(false)
        graph.fromJSON(ganttdata)
        
    }


    //解决异步问题
    const [scrollLeft,setScrollLeft] = useState()
    useEffect(()=> {
        if(ganttdata !== undefined){
            document.getElementById("tableGantt").style.height = (ganttdata.nodes.length / 2 * 50);
            setGarph()
        }
        const scrollWidth = currentMonth > 1 ? (isLeapYear(currentYear) ? 366 * 24 : 365 * 24) : (isLeapYear(currentYear - 1) ? 366 * 24 : 365 * 24);
        setScrollLeft(scrollWidth)

        document.getElementById('table-pic').scrollTo({ left: scrollWidth });
        document.getElementById('table-timer').scrollTo({ left: scrollWidth });
        return
    },[ganttdata])


    useEffect(()=> {
        let gantt;
        if(workList && workList.length > 0){
            setGantt()
            gantt = setNode(workList)
            setGantt(gantt)
            setGanttHeight(gantt.length / 2 * 50)
        }

        return
    },[workList,expandedTree])

    // 画布节点数据
    let ylength = 0;
    const setNode = (data)=> {
        let nodes = [];
        let edges = []
        data.map((item,index)=> {
            // 字符串转数组
            let xAxis = 0;
            let yAxis = 0;
            let percent = 0;
            let length = 0;
            if(item.planBeginTime && item.planEndTime){
                let startPra = Date.parse(item.planBeginTime);
                let endPra = Date.parse(item.planEndTime);
    
                // 画布开始时间
                let firstDate = `${currentYear-1}.${currentMonth+1}.${currentDay}`
                firstDate = Date.parse(firstDate);
    
                // 
                xAxis = Math.abs(startPra-firstDate);
                xAxis = Math.floor(xAxis / (3600 * 1000));
    
                length = Math.abs(endPra-startPra);
                length = Math.floor(length / (3600 * 1000));
                
                yAxis = ylength++ * 50 + 13;
    
                // 进度
                percent = length * item.percent / 100
            }else {
                yAxis = ylength++ * 50 + 13;
                xAxis = 0;
                percent = 0;
                length = 0;
            }
            nodes.push(
                {
                    id: item.id,
                    x: xAxis,
                    y: yAxis,
                    width: length,
                    height: 24,
                    attrs: { 
                        body: {
                        fill: '#5d70ea', // 背景颜色
                        stroke: '#5d70ea',  // 边框颜色
                        },
                    }
                },
                {
                    id: `pre${item.id}`,
                    x: xAxis,
                    y: yAxis,
                    width: percent,
                    height: 24,
                    attrs: { 
                        body: {
                        fill: '#2ECC71', // 背景颜色
                        stroke: '#2ECC71',  // 边框颜色
                        },
                    }
                },
                
            )
            if(item.preDependWorkItem && item.preDependWorkItem.id){
                edges.push({
                    source: item.id, // String，必须，起始节点 id
                    target: item.preDependWorkItem.id, // String，必须，目标节点 id
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
            
            if(item.children && item.children.length>0 && !isExpandedTree(item.id)){
                let childrenData = setNode(item.children)
                nodes = nodes.concat(childrenData.nodes)
                edges = edges.concat(childrenData.edges)
                setGanttHeight()
            }
            return nodes;
            
        })
        let item = {nodes: nodes,edges: edges}
        return item;
    }
    
    // 时间轴数据
    const getDate = ()=> {
        const monthArray = [
            {
                year: currentYear-1,
                firstmonth: currentMonth,
                lastmonth: 11,
            },
            {
                year: currentYear,
                firstmonth: 0,
                lastmonth: 11
            },
            {
                year: currentYear+1,
                firstmonth: 0,
                lastmonth: currentMonth
            }
        ]
        const array = []
        monthArray.map((item,index)=> {
            for(let i = item.firstmonth;i<=item.lastmonth;i++){
                array.push({month: `${item.year}年${i+1}月`,day: getMonthCount(item.year,i)})
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
        if(currentMonth===month && year=== currentYear-1){
            return Array.from(new Array(count-currentDay+1), (item, value) => value + currentDay);
        } else if(currentMonth===month && year===currentYear+1){
            return Array.from(new Array(currentDay), (item, value) => value+1);
        }else {
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


    const tableTd = (data,fid,deep)=> {
        return (data && data.length > 0 && data.map((item,index)=> {
                return (    
                        <Fragment key={item.id}>
                            <ul className={isExpandedTree(fid) ?  "table-hidden": null}>
                                <li  style={{listStyleType: "none"}}>
                                    <div key={item.id} className="table-tr">
                                        <div className="table-td table-border" style={{paddingLeft: `${deep * 20 + 25}`}}>
                                            {item.children && item.children.length>0 &&    
                                                <span className="table-icon">
                                                {
                                                    isExpandedTree(item.id) ? 
                                                        <PlusCircleOutlined onClick={() => setOpenOrClose(item.id)} style={{color: "var(--tiklab-gray-400)"}}/> : 
                                                            <MinusCircleOutlined onClick={() => setOpenOrClose(item.id)} style={{color: "var(--tiklab-gray-400)"}}/>
                                                }</span>}
                                            {item.title}
                                        </div>
                                        {/* <div className="table-td table-border">{item.planBeginTime}</div>
                                        <div className="table-td table-border">{item.planEndTime}</div> */}
                                        <div className="table-gatter table-border"></div>
                                    </div>
                                    {
                                        item.children && item.children.length>0 && tableTd(item.children,item.id,deep+1)
                                    }
                                </li>
                            </ul>
                        </Fragment>
                        )
            }
        ))
    }



    const [dateArray,setdateArray] = useState(getDate())
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

    return (
        <>
            <div className="work-time">
                <div style={{position: "relative"}}>
                    <div className="time-table">
                        <div className="table-hearder">
                            <div className="table-hearder-text table-border">
                                标题
                            </div>
                            {/* <div className="table-hearder-text table-border">
                                开始时间
                            </div>
                            <div className="table-hearder-text table-border">
                                结束时间
                            </div> */}
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
                        <div className="table-body" id="tale-body" ref={timerColOuter}>
                            <div ref={timerColCore}>
                                <li style={{listStyleType: "none"}}>
                                    {
                                        tableTd(workList, 0, 0)
                                    }
                                </li>
                                <div className="table-pic" id="table-pic" ref={ganttOuter}>
                                    <div id="tableGantt" ref={ganttCore} style={{ width: ganttWidth}} className="gantt-box" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
                {
                    ganttdata && (ganttdata.nodes.length / 2)> 15 && <ColScroll 
                    timerCore = {timerColCore}
                    timerOuter = {timerColOuter}
                    ganttCore = {ganttCore}
                    ganttOuter = {ganttOuter}
                />
                }
            </div>
            {
                scrollLeft && <RowScroll 
                    timerCore = {timerCore}
                    timerOuter = {timerOuter}
                    ganttCore = {ganttCore}
                    ganttOuter = {ganttOuter}
                    ganttWidth = {ganttWidth}
                    scrollLeft = {scrollLeft}
                />
            }
            
            {/* <Pagination className="work-gantee-pagetion" defaultCurrent={1} total={total} onChange ={(page, pagesize) => changePage(page)}/> */}
        </>
    )
}

export default Gantt;