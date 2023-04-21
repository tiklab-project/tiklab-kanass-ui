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
import RowScroll from "./RowScroll";
import ColScroll from "./CoLScroll"
const SprintLineMap = (props) => {
    // 获取当前年月日
    const todayDate = new Date()
    const currentYear = todayDate.getFullYear()
    const currentMonth = todayDate.getMonth()
    const currentDay = todayDate.getDate()

    const [dateArray, setdateArray] = useState()
    // 路线图的宽
    const [ganttWidth, setGanttWidth] = useState()
    // 展示的原始数组
    const { data, type } = props;
    console.log(data)

    // 使用于路线图显示的数据
    const [ganttdata, setGantt] = useState()

    // 画布
    const [graph, getGraph] = useState()

    useEffect(() => {
        setdateArray(getDate())
        // 开始与结束日期，解析一个表示某个日期的字符串，
        // 并返回从1970-1-1 00:00:00 UTC 到该日期对象（该日期对象的UTC时间）的毫秒数
        let start = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`;
        let end = `${currentYear + 1}.${currentMonth + 1}.${currentDay}`
        start = Date.parse(start);
        end = Date.parse(end);

        // 用开始日期与结束日期定义画布的宽度
        let graphWidth = Math.abs(start - end);
        graphWidth = Math.floor(graphWidth / (3600 * 1000));

        setGanttWidth(graphWidth)
        // 进入页面显示当前时间

        // 画布参数
        const graph = new Graph({
            container: document.getElementById(type),
            width: graphWidth,
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
            },
            resizing: {
                enabled: true
            },
            translating: {
                restrict(cellView) {
                    const cell = cellView.cell
                    if (cell.isNode()) {
                        const parent = cell.getParent()
                        if (parent) {
                            return parent.getBBox()
                        }
                    }

                    return null
                },
            }
        })
        getGraph(graph)
        return;
    }, [])

    /**
     * 渲染画布
     */
    const setGarph = () => {
        graph.fromJSON(ganttdata)
    }

    /**
     * 解决异步问题
     * 路线渲染数据变化就从新渲染画布
     */
    const [scrollLeft,setScrollLeft] = useState()
    useEffect(() => {
        if (ganttdata !== undefined) {
            setGarph()
        }
        const scrollWidth = currentMonth > 1 ? (isLeapYear(currentYear) ? 366 * 24 : 365 * 24) : (isLeapYear(currentYear - 1) ? 366 * 24 : 365 * 24);
        setScrollLeft(scrollWidth)

        document.getElementById('table-pic').scrollTo({ left: scrollWidth });
        document.getElementById('table-timer').scrollTo({ left: scrollWidth });
        return
    }, [ganttdata])

    /**
     * 原始数据变化重新计算路线渲染数据
     */
    useEffect(() => {
        if (data.length > 0) {
            setGantt(setNode(data))
        }
        return
    }, [data])


    // 画布节点数据
    let ylength = 0;
    /**
     * 路线节点数据
     * @param {*} data 
     * @returns 
     */
    const setNode = (data) => {
        let nodes = [];
        let edges = []
        data.map((item) => {
            //每个事项的开始结束日期转化为毫秒
            let startPra, endPra;
            if (type === "version") {
                let start = item?.startTime.split(" ");
                startPra = Date.parse(start[0]);

                let end = item?.publishDate?.split(" ");
                endPra = Date.parse(end[0]);
            } else {
                if (item.startTime) {
                    let start = item?.startTime?.split(" ");
                    startPra = Date.parse(start[0]);
                } else {
                    startPra = 0;
                }
                if (item.endTime) {
                    let end = item?.endTime.split(" ");
                    endPra = Date.parse(end[0]);
                } else {
                    endPra = 0;
                }
            }

            // 画布开始时间转化为毫秒
            let firstDate = `${currentYear - 1}.${currentMonth + 1}.${currentDay}`
            firstDate = Date.parse(firstDate);

            // 每个事项的x轴
            let xAxis = Math.abs(startPra - firstDate);
            xAxis = Math.floor(xAxis / (3600 * 1000));

            // 每个事项的y轴
            let yAxis = ylength++ * 50 + 18;

            // 每个事项持续时间
            let length = Math.abs(endPra - startPra);
            length = Math.floor(length / (3600 * 1000));
            nodes.push(
                {
                    id: "parent" + item.id,
                    x: 0,
                    y: yAxis,
                    width: ganttWidth,
                    height: 14,
                    attrs: {
                        body: {
                            stroke: '#fff',  // 边框颜色
                        },
                    }
                }
            )
            nodes.push(
                {
                    id: item.id,
                    x: xAxis,
                    y: yAxis,
                    width: length,
                    height: 14,
                    attrs: {
                        body: {
                            fill: 'var(--tiklab-blue)', // 背景颜色
                            stroke: 'var(--tiklab-gray-400)',  // 边框颜色
                        },
                    },
                    parent: "parent" + item.id,
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
            return nodes;
        })
        let item = { nodes: nodes, edges: edges }
        console.log(item)
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


    /**
     * 绘制表格
     * @param {*} data 
     * @returns 
     */
    const tableTd = (data) => {
        return (data && data.map((item) => {
            return (
                <Fragment key={item.id}>
                    <ul >
                        <li style={{ listStyleType: "none" }}>
                            <div key={item.id} className="table-tr">
                                <div className="table-td table-border" style={{ borderRight: "solid #d8d8dd 1px" }}>
                                    {item.sprintName || item.name || item.epicName}
                                </div>
                                {/* <div className="table-td table-border">{item.startTime}</div>
                                    <div className="table-td table-border">{item.endTime}</div> */}
                                <div className="table-gatter table-border"></div>
                            </div>
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
        <>
            <div className="sprint-linemap">
                <div className="linemap-time">
                    <div className="time-table">
                        <div className="table-hearder">
                            <div className="table-hearder-text table-border">
                                标题
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
                                        tableTd(data)
                                    }
                                </li>
                                <div className="table-pic" id="table-pic" ref={ganttOuter}>
                                    <div id={type} ref={ganttCore} style={{ width: ganttWidth, height: data?.length * 50 }} className="gantt-box" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <RowScroll 
                    timerCore = {timerCore}
                    timerOuter = {timerOuter}
                    ganttCore = {ganttCore}
                    ganttOuter = {ganttOuter}
                    ganttWidth = {ganttWidth}
                    scrollLeft = {scrollLeft}
                />
                {
                    data && data.length > 15 && <ColScroll 
                    timerCore = {timerColCore}
                    timerOuter = {timerColOuter}
                    ganttCore = {ganttCore}
                    ganttOuter = {ganttOuter}
                />
                }
            </div>
        </>
    )
}

export default inject(
    "workStore"
)(observer(SprintLineMap));