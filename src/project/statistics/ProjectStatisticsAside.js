/*
 * @Descripttion: 项目统计右侧菜单
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useState, useEffect } from 'react';
import "./ProjectStatisticsAside.scss"
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";

const StatisticsAsicde = (props) => {
    // 统计菜单
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
    // 菜单分类
    const logReportList = [
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
    // 选中的菜单
    const [selectRouter, setSelectRouter] = useState()
    // 已展开子级的阶段id集合
    const [expandedTree, setExpandedTree] = useState([])
    // 项目id
    const projectId = props.match.params.id;
    // 项目类型
    const path = props.match.path.split("/")[2];

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
    const selectKey = (id, type) => {
        let url = `/index/${path}/${projectId}/statistics/${type}`;
        setSelectRouter(type)
        props.history.push(url);
    }

    return (
        <div className="project-statistics-aside">
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