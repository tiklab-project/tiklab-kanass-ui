/*
 * @Descripttion: 项目统计右侧菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useState, useEffect, Fragment } from 'react';
import "./StatisticsAside.scss"
import { withRouter } from "react-router-dom";
import { useSelector } from "thoughtware-plugin-core-ui";
import { getVersionInfo } from "thoughtware-core-ui";
const StatisticsAsicde = (props) => {
    const { workReportList, logReportList, workKey, logKey } = props;
    const pluginStore = useSelector(state => state.pluginStore);
    const versionInfo = getVersionInfo();
    const [workMenuList, setWorkMenuList] = useState(workReportList)
    // 项目id
    const projectId = props.match.params.id;
    const projectSetId = props.match.params.projectSetId;
    const sprintId = props.match.params.sprint;
    const [logMenuList, setLogMenuList] = useState(logReportList)

    useEffect(() => {
        // if (versionInfo.expired === false) {
        //     const workConfigList = pluginStore.filter(item => item.key === workKey);
        //     if (workConfigList.length > 0) {
        //         let list = [
        //             {
        //                 key: "workItem",
        //                 title: "事项字段统计",
        //                 type: "workItem"
        //             }
        //         ]
        //         workConfigList.map(item => {
        //             list.push({
        //                 key: item.id,
        //                 title: item.extraProps.title,
        //                 type: item.menu
        //             })
                    
        //         })
        //         console.log(list)
        //         setWorkMenuList([...list])
        //     }


        //     const logConfigList = pluginStore.filter(item => item.key === logKey);
        //     if (logConfigList.length > 0) {
        //         let list = []
        //         logConfigList.map(item => {
        //             list.push({
        //                 key: item.id,
        //                 title: item.extraProps.title,
        //                 type: item.menu
        //             })
                    
        //         })
        //         setLogMenuList([...list])
        //     }
        // }
        return;
    }, [])
    // 选中的菜单
    const [selectRouter, setSelectRouter] = useState("workItem")
    // 已展开子级的阶段id集合
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
        if (props.match.path === "/:id/sprintdetail/:sprint/statistics") {
            url = `/${projectId}/sprintdetail/${sprintId}/statistics`;
        }
        if (props.match.path === "/projectDetail/:id/statistics") {
            url = `/projectDetail/${projectId}/statistics`;
        }
        if (props.match.path === "/projectSetdetail/:projectSetId/statistics") {
            url = `/projectSetdetail/${projectSetId}/statistics`;
        }
        if (versionInfo.expired === false || type === "workItem"  ) {
            url = `${url}/${type}`;
        } else {
            url = `${url}/advert`;
        }

        setSelectRouter(type)
        props.history.push(url);
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
            </Fragment>


        </div>
    )
}

export default withRouter(StatisticsAsicde);