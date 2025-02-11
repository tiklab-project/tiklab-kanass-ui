/*
 * @Descripttion: 统计左侧导航
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 15:37:52
 */
import React, { useState, Fragment } from 'react';
import "./StatisticsAside.scss"
import { withRouter } from "react-router-dom";
import { getVersionInfo } from "tiklab-core-ui";
import StatisticsFree from './StatisticsFree';
const StatisticsAsicde = (props) => {
    const { workReportList, logReportList} = props;
    const versionInfo = getVersionInfo();
    const [workMenuList, setWorkMenuList] = useState(workReportList)
    // 项目id
    const projectId = props.match.params.id;
    const projectSetId = props.match.params.projectSetId;
    const sprintId = props.match.params.sprint;
    const [logMenuList, setLogMenuList] = useState(logReportList)
    const [statisticsFreeVisable, setStatisticsFreeVisable] = useState(false);
    // 选中的菜单
    const [selectRouter, setSelectRouter] = useState("workItem")
    // 已展开子级的计划id集合
    const [expandedTree, setExpandedTree] = useState([])


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
        let url = '';
        if (props.match.path === "/:id/sprint/:sprint/statistics") {
            url = `/${projectId}/sprint/${sprintId}/statistics`;
        }
        if (props.match.path === "/project/:id/statistics") {
            url = `/project/${projectId}/statistics`;
        }
        if (props.match.path === "/projectSet/:projectSetId/statistics") {
            url = `/projectSet/${projectSetId}/statistics`;
        }
        if (versionInfo.expired === false || type === "workItem") {
            url = `${url}/${type}`;
            setSelectRouter(type)
            props.history.push(url);
        } else {
            // url = `${url}/${type}`;
            // url = `${url}/advert`;
            setStatisticsFreeVisable(true)
        }

    }

    return (
        <div className="project-statistics-aside">
            <div className="statistics-top-title">
                <span>统计</span>
            </div>
            <div className='statistics-type-title' onClick={() => setOpenOrClose("work")}>
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
            <Fragment>
                {
                    !isExpandedTree("work") && <div className="statistics-menu">
                        {
                            workMenuList && workMenuList.map((item, index) => {
                                return <div key={index}>
                                    <div
                                        className={`statistics-menu-firstmenu ${item.type === selectRouter ? "statistics-menu-select" : ""}`}
                                        onClick={() => selectKey(item.type)}
                                        key={item.key}
                                    >
                                        <span>
                                            {item.title}
                                        </span>
                                        {
                                            versionInfo.expired === true && index > 0 && <svg className="img-icon" aria-hidden="true" >
                                                <use xlinkHref="#icon-member"></use>
                                            </svg>
                                        }

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
                                    <use xlinkHref="#icon-statistics-log"></use>
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
                                                className={`statistics-menu-firstmenu ${item.type === selectRouter ? "statistics-menu-select" : ""}`}
                                                onClick={() => selectKey(item.type)}
                                                key={item.key}
                                            >
                                                <span>
                                                    {item.title}
                                                </span>
                                                {
                                                    versionInfo.expired === true && <svg className="img-icon" aria-hidden="true" >
                                                        <use xlinkHref="#icon-member"></use>
                                                    </svg>
                                                }
                                            </div>
                                        </div>

                                    })
                                }
                            </div>
                        }
                    </Fragment>

                }
                <StatisticsFree
                    statisticsFreeVisable={statisticsFreeVisable}
                    setStatisticsFreeVisable={setStatisticsFreeVisable}
                />
            </Fragment>


        </div>
    )
}

export default withRouter(StatisticsAsicde);