import React, { useState, useEffect, Fragment } from 'react';
import "./sprintStatisticsAside.scss"
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { useSelector } from "tiklab-plugin-core-ui";
import { getVersionInfo } from "tiklab-core-ui";

const StatisticsAsicde = (props) => {
    const pluginStore = useSelector(state => state.pluginStore);
    const versionInfo = getVersionInfo();
    const workReportList = [
        {
            key: "workItem",
            title: "事项字段统计",
            type: "work"
        },
        // {
        //     key: "workBulidEnd",
        //     title: "事项创建与解决统计",
        //     type: 'bulidend',
        // },
        // {
        //     key: "workNewTrend",
        //     title: "事项新增趋势",
        //     type: 'newtrend',
        // },
        // {
        //     key: "workEndTrend",
        //     title: "事项完成趋势",
        //     type: 'endtrend'
        // },
        // {
        //     key: "workNewTotalTrend",
        //     title: "事项累计新建趋势",
        //     type: 'newtotaltrend'
        // },
        // {
        //     key: "workEndTotalTrend",
        //     title: "事项累计完成趋势",
        //     type: "endtotaltrend"
        // }
    ]

    // const logReportList = [
    //     {
    //         key: "logProjectUser",
    //         title: "日志项目成员统计",
    //         type: "logprojectuser"
    //     },
    //     {
    //         key: "logProjectWork",
    //         title: "日志项目事项统计",
    //         type: "logprojectwork"
    //     },
    // ]
    const [workMenuList, setWorkMenuList] = useState([])

    const [logMenuList, setLogMenuList] = useState([])
    const [selectRouter, setSelectRouter] = useState("workItem")

    const [expandedTree, setExpandedTree] = useState([])
    const [reportList, setReportList] = useState([])
    const { statisticsStore } = props;
    const { findReportList, deleteReport } = statisticsStore;
    const projectId = props.match.params.id;
    const path = props.match.path.split("/")[2];
    console.log(props)
    useEffect(() => {
        findReportList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                setReportList(res.data)
            }
        })
        return
    }, [])

    useEffect(() => {
        if (versionInfo.expired === false) {
            const workConfigList = pluginStore.filter(item => item.key === "work-statistics");
            if (workConfigList.length > 0) {
                workConfigList.map(item => {
                    workMenuList.push({
                        key: item.id,
                        title: item.extraProps.title,
                        type: item.extraProps.type
                    })
                })
                setWorkMenuList([...workMenuList])
            }


            const logConfigList = pluginStore.filter(item => item.key === "log-statistics");
            if (logConfigList.length > 0) {
                logConfigList.map(item => {
                    logMenuList.push({
                        key: item.id,
                        title: item.extraProps.title,
                        type: item.extraProps.type
                    })
                })
                setLogMenuList([...logMenuList])
            }
        }
    }, [])

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

    const selectKey = (type) => {
        let url = '';
        console.log(props.match.path, props.route.path)
        console.log(props.route.path === "/index/:id/sprintdetail/:sprint/statistics")
        if (props.match.path === "/index/:id/sprintdetail/:sprint/statistics") {
            url = `/index/${projectId}/sprintdetail/${props.match.params.sprint}/statistics/${type}`;
        }
        if (props.match.path === "/index/projectScrumDetail/:id/statistics") {
            url = `/index/${path}/${projectId}/statistics/${type}`
        }
        setSelectRouter(type)
        props.history.push(url);
    }

    return (
        <div className="sprint-statistics-aside">
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
            <div key={'workItem'}>
                <div
                    className={`statistics-menu-firstmenu ${workReportList[0].key === selectRouter ? "statistics-menu-select" : ""}`}
                    onClick={() => selectKey(workReportList[0].key)}
                    key={workReportList[0].key}
                >
                    <span>
                        {workReportList[0].title}
                    </span>
                </div>
            </div>
            {
                workMenuList && workMenuList.length > 0 ? <Fragment>
                    {
                        !isExpandedTree("work") && <div className="statistics-menu">
                            {
                                workMenuList && workMenuList.map((item, index) => {
                                    return <div key={index}>
                                        <div
                                            className={`statistics-menu-firstmenu ${item.key === selectRouter ? "statistics-menu-select" : ""}`}
                                            onClick={() => selectKey(item.key)}
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
                                logMenuList && logMenuList.map((item, index) => {
                                    return <div key={index}>
                                        <div
                                            className={`statistics-menu-firstmenu ${item.key === selectRouter ? "statistics-menu-select" : ""}`}
                                            onClick={() => selectKey(item.key)}
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
                </Fragment>
                :
                <div key={"moreMenu"}>
                    <div
                        className={`statistics-menu-firstmenu ${"moreMenu" === selectRouter ? "statistics-menu-select" : ""}`}
                        onClick={() => selectKey("moreMenu")}
                        key={"moreMenu"}
                    >
                        <span>
                            更多统计
                        </span>
                    </div>
                </div>
            }


        </div>
    )
}

export default withRouter(inject('statisticsStore')(observer(StatisticsAsicde)));