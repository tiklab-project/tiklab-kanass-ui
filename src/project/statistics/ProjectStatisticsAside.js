/*
 * @Descripttion: 项目统计右侧菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useState, useEffect, Fragment } from 'react';
import "./ProjectStatisticsAside.scss"
import { withRouter } from "react-router-dom";
import { useSelector } from "tiklab-plugin-core-ui";
import { getVersionInfo } from "tiklab-core-ui";
const StatisticsAsicde = (props) => {
    const pluginStore = useSelector(state => state.pluginStore);
    const versionInfo = getVersionInfo();
    // 统计菜单
    const workReportList = [
        {
            key: "workItem",
            title: "事项字段统计",
            type: "work"
        }
    ];
    // const workReportLiswt = [
    //     {
    //         key: "workItem",
    //         title: "事项字段统计",
    //         type: "work"
    //     },
    //     {
    //         key: "workBulidEnd",
    //         title: "事项创建与解决统计",
    //         type: 'bulidend',
    //     },
    //     {
    //         key: "workNewTrend",
    //         title: "事项新增趋势",
    //         type: 'newtrend',
    //     },
    //     {
    //         key: "workEndTrend",
    //         title: "事项完成趋势",
    //         type: 'endtrend'
    //     },
    //     {
    //         key: "workNewTotalTrend",
    //         title: "事项累计新建趋势",
    //         type: 'newtotaltrend'
    //     },
    //     {
    //         key: "workEndTotalTrend",
    //         title: "事项累计完成趋势",
    //         type: "endtotaltrend"
    //     }
    // ]

    // const logReportListw = [
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
        return;
    }, [])
    // 选中的菜单
    const [selectRouter, setSelectRouter] = useState("workItem")
    // 已展开子级的阶段id集合
    const [expandedTree, setExpandedTree] = useState([])


    // 项目id
    const projectId = props.match.params.id;

    /**
    * 判断树是否展开
    * @param {上级的id} key 
    * @returns 
    */
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    /**
     * 树的展开与闭合
     * @param {上级的id} key 
     */
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    /**
     * 点击菜单
     * @param {} id 
     * @param {*} type 
     */
    const selectKey = (type) => {
        let url = `/index/projectDetail/${projectId}/statistics/${type}`;
        setSelectRouter(type)
        props.history.push(url);
    }

    return (
        <div className="project-statistics-aside">
            <div className="statistics-top-title">
                <span>统计dd</span>
            </div>
            <div className='statistics-type-title'  onClick={() => setOpenOrClose("work")}>
                <div className="statistics-type-title-left">
                    <svg className="menu-icon" aria-hidden="true" >
                        <use xlinkHref="#icon-statistics-work"></use>
                    </svg>

                    事项统计
                </div>
                <div>
                    {
                        !isExpandedTree("work") ?
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-statistics-down"></use>
                            </svg> :
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-statistics-up"></use>
                            </svg>
                    }
                </div>

            </div>
            {
                !isExpandedTree("work") && <div key={'workItem'}>
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
            }

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
                    {
                        logMenuList && logMenuList.length > 0 && <Fragment>
                            <div className='statistics-type-title' onClick={() => setOpenOrClose("log")}>
                                <div className="statistics-type-title-left">
                                    <svg className="menu-icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-statistics-work"></use>
                                    </svg>

                                    日志统计
                                </div>
                                <div>
                                    {
                                        !isExpandedTree("log") ?
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-statistics-down"></use>
                                            </svg> :
                                            <svg className="svg-icon" aria-hidden="true">
                                                <use xlinkHref="#icon-statistics-up"></use>
                                            </svg>
                                    }
                                </div>
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

export default withRouter(StatisticsAsicde);