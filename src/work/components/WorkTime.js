import React,{ useEffect, useState, useRef, Fragment } from "react";
import { observer, inject } from "mobx-react";
import { Graph } from '@antv/x6';
import { PlusCircleOutlined,MinusCircleOutlined } from '@ant-design/icons';

const WorkTime=(props) => {
    const todayDate = new Date()
    const currentYear = todayDate.getFullYear()
    const currentMonth = todayDate.getMonth()
    const currentDay = todayDate.getDate()  
    const [ganttWidth,setGanttWidth] = useState()  
    const [ganttHeight,setGanttHeight] = useState() 

    const {workStore } =props
    const projectId = props.match.params.id;
    const {workListTime} = workStore;
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
        getData()
        // 获取图数据
        // 进入页面显示当前时间
        const scrollWidth = currentMonth >1 ? (isLeapYear(currentYear)? 366*24 : 365*24): (isLeapYear(currentYear-1)? 366*24 : 365*24)
        document.getElementById('ganttflow').scrollTo({left: scrollWidth});
        const graph = new Graph({
            container: document.getElementById('tableGantt'),
            width: graphWidth,
            // height: graphHeight,
            grid: {
                size: 1,
                visible: true,
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
            }
        })
        getGraph(graph)
        return;
    },[])
    

    const setGarph = ()=> {
        // graph.clearCells(false)
        graph.fromJSON(ganttdata)
        
    }


    //解决异步问题
    useEffect(()=> {
        if(ganttdata !== undefined){
            setGarph(ganttWidth,ganttHeight)
        }
        return
    },[ganttdata])


    useEffect(()=> {
        if(workListTime.length > 0){
            setGantt(setNode(workListTime))
        }
        return
    },[workListTime,expandedTree])

    
    const getData = ()=> {
        let initValues = {}
        if(props.location.pathname === "/index/work/worklist"){
            initValues = {project: null,sprint: null}
        }
        // if(props.location.pathname === "/index/sprintdetail/sprintwork"){
        //     initValues = {project: projectId,sprint: sprintId}
        // }
        if(props.location.pathname === "/index/prodetail/work"){
            initValues = {project: projectId,sprint: null}
        }
        getWorkGanttListTree(initValues).then((res)=> {
            const graphHeight = 15* 50
            setGanttHeight(graphHeight)
            // setGantt({nodes: setNode(res)})
        })
    }
    
    
    // 画布节点数据
    let ylength = 0;
    const setNode = (data)=> {
        let nodes = [];
        let edges = []
        data.map((item,index)=> {
            // 字符串转数组
            let start = item.planBeginTime.split(" ");
            let startPra = Date.parse(start[0]);

            let end = item.planEndTime.split(" ");
            let endPra = Date.parse(end[0]);

            // 画布开始时间
            let firstDate = `${currentYear-1}.${currentMonth+1}.${currentDay}`
            firstDate = Date.parse(firstDate);

            // 
            let xAxis = Math.abs(startPra-firstDate);
            xAxis = Math.floor(xAxis / (3600 * 1000));

            let length = Math.abs(endPra-startPra);
            length = Math.floor(length / (3600 * 1000));
            
            
            let yAxis = ylength++ * 50 + 18;

            // 进度
            let percent = length * item.percent / 100
            nodes.push(
                {
                    id: item.id,
                    x: xAxis,
                    y: yAxis,
                    width: length,
                    height: 14,
                    attrs: { 
                        body: {
                        fill: '#63B8FF', // 背景颜色
                        stroke: '#63B8FF',  // 边框颜色
                        },
                    }
                },
                {
                    id: `pre${item.id}`,
                    x: xAxis,
                    y: yAxis,
                    width: percent,
                    height: 14,
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


    const tableTd = (data,fid)=> {
        return (data && data.map((item,index)=> {
                return (    
                            <Fragment key={item.id}>
                                <ul className={isExpandedTree(fid) ?  "table-hidden": null}>
                                    <li  style={{listStyleType: "none"}}>
                                        <div key={item.id} className="table-tr">
                                            <div className="table-td table-border" >
                                                {item.children && item.children.length>0 &&    
                                                    <span className="table-icon">
                                                    {
                                                        isExpandedTree(item.id) ? 
                                                            <PlusCircleOutlined onClick={() => setOpenOrClose(item.id)} style={{color: "var(--tiklab-gray-400)"}}/> : 
                                                                <MinusCircleOutlined onClick={() => setOpenOrClose(item.id)} style={{color: "var(--tiklab-gray-400)"}}/>
                                                    }</span>}
                                                {item.title}
                                            </div>
                                            <div className="table-td table-border">{item.planBeginTime}</div>
                                            <div className="table-td table-border">{item.planEndTime}</div>
                                            <div className="table-gatter table-border"></div>
                                        </div>
                                            {
                                                item.children && item.children.length>0 && tableTd(item.children,item.id)
                                            }
                                    </li>
                                </ul>
                            </Fragment>
                        )
            }
        ))
    }


    const [dateArray,setdateArray] = useState(getDate())


    return (
        <>
            <div className="work-time">
                <div style={{position: "relative"}}>
                    <div className="time-table">
                        <div className="table-hearder">
                            <div className="table-hearder-text table-border">
                                标题
                            </div>
                            <div className="table-hearder-text table-border">
                                开始时间
                            </div>
                            <div className="table-hearder-text table-border">
                                结束时间
                            </div>
                            <div className="table-hearder-gatter table-border">
                                {}
                            </div>
                        </div>
                        <div className="table-body ">
                            <li style={{listStyleType: "none"}}>
                                {
                                    tableTd(workListTime)
                                }
                            </li>
                        
                        </div>
                    </div>
                    <div className="table-pic" style={{height: "101%"}}>
                        <div className="table-overflow" id="ganttflow">
                            <div className="table-timer">
                                <div className="table-month">
                                {   
                                    dateArray && dateArray.map((item,index)=> {
                                        return <div style={{width: `${24*item.day.length}px`,height:"25px"}} key={index} className="table-month-td">
                                                    {item.month}
                                                </div>
                                    })

                                }
                                    
                                    
                                </div>
                                <div className="table-date">
                                        {
                                            dateArray.map((item,index)=> {
                                                return item.day.map ((dayitem,dayindex)=> {
                                                    return <div style={{width: "24px",height:"25px"}} className="table-day" key={`${index}${dayindex}`}>
                                                                {dayitem}
                                                            </div>
                                                })
                                                
                                            })
                                        }
                                        
                                        
                                </div>
                            </div>
                            <div id="tableGantt" style={{width: ganttWidth,height: "100%"}} className="gantt-box">   
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default inject(
    "workStore"
)(observer(WorkTime));