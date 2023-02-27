import React, { useState, useEffect } from 'react';
import "./ProjectSetStatisticsAside.scss"
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";

const StatisticsAsicde = (props) => {
    const workReportList = [
        {
            key: "workItem",
            title: "事项字段统计",
            type: "work"
        },
        {
            key: "workBulidEnd",
            title: "事项创建与解决统计",
            type: 'bulidend',
        },
        {
            key: "workNewTrend",
            title: "事项新增趋势",
            type: 'newtrend',
        },
        {
            key: "workEndTrend",
            title: "事项完成趋势",
            type: 'endtrend'
        },
        {
            key: "workNewTotalTrend",
            title: "事项累计新建趋势",
            type: 'newtotaltrend'
        },
        {
            key: "workEndTotalTrend",
            title: "事项累计完成趋势",
            type: "endtotaltrend"
        }
    ]

    const logReportList = [
        {
            key: "logUserProject",
            title: "日志成员项目统计",
            type: "logprojectuser"
        },
        {
            key: "logProjectUser",
            title: "日志项目成员统计",
            type: "logprojectuser"
        },
        {
            key: "logProjectWork",
            title: "日志项目事项统计",
            type: "logprojectwork"
        },
    ]

    const [selectRouter, setSelectRouter] = useState()
    
    const [expandedTree, setExpandedTree] = useState([])
    const [reportList, setReportList] = useState([])
    const { statisticsStore } = props;
    const { findReportList, deleteReport } = statisticsStore;
    const projectSetId = props.match.params.projectSetId;
    const path = props.match.path.split("/")[2];
    console.log(props)
    // useEffect(() => {
    //     findReportList({ projectId: projectId}).then(res => {
    //         if(res.code === 0){
    //             setReportList(res.data)
    //         }
    //     })
    //     return
    // }, [])
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const selectKey = (id, type) => {
        let url = `/index/projectSetdetail/${projectSetId}/statistics/${type}`
        // setReportId(id)
        setSelectRouter(type)
        props.history.push(url);
    }

    return (
        <div className="projectSet-statistics-aside">
            <div className="statistics-aside-title">
                <span>统计</span>
            </div>
            <div className='statistics-type-title'>
                {
                    !isExpandedTree("work") ?
                        <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose("work")}>
                            <use xlinkHref="#icon-workDown"></use>
                        </svg> :
                        <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose("work")}>
                            <use xlinkHref="#icon-workRight"></use>
                        </svg>
                }
      
                事项统计
            </div>
            {
                !isExpandedTree("work") && <div className="statistics-menu">
                    {
                        workReportList && workReportList.map((item, index) => {
                            return <div key={index}>
                                <div
                                    className={`statistics-menu-firstmenu ${item.key === selectRouter ? "statistics-menu-select" : ""}`}
                                    onClick={() => selectKey(item.id, item.key)}
                                    key={item.key}
                                >
                                    <span>
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                        }
                        )
                    }
                </div>
            }

            <div className='statistics-type-title'>
                {
                    !isExpandedTree("log") ?
                        <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose("log")}>
                            <use xlinkHref="#icon-workDown"></use>
                        </svg> :
                        <svg className="svg-icon" aria-hidden="true" onClick={() => setOpenOrClose("log")}>
                            <use xlinkHref="#icon-workRight"></use>
                        </svg>
                }
                日志统计
            </div>
            {
                !isExpandedTree("log") && <div className="statistics-menu">
                    {
                        logReportList && logReportList.map((item, index) => {
                            return <div key={index}>
                                <div
                                    className={`statistics-menu-firstmenu ${item.key === selectRouter ? "statistics-menu-select" : ""}`}
                                    onClick={() => selectKey(item.id, item.key)}
                                    key={item.key}
                                >
                                    <span>
                                        {item.title}
                                    </span>
                                </div>
                            </div>

                        })
                    }
                </div>
            }

        </div>
    )
}

export default withRouter(inject('statisticsStore')(observer(StatisticsAsicde)));