/**
 * 统计侧边栏
 */
import React, { Fragment, useState, useEffect } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import "./StatisticsAside.scss"
import { getVersionInfo } from "tiklab-core-ui";
import LogStatisticsFree from "../../workLog/components/LogStatisticsFree";
const StatisticsAside = (props) => {
    // 无子级菜单处理
    const path = props.location.pathname;
    const [selectKey, setSelectKey] = useState("/statistics/project/memberItem");
    const versionInfo = getVersionInfo();
    const [logStatisticsFreeVisable, setLogStatisticsFreeVisable] = useState(false);
    const select = (data) => {
        if (data.type === "proStatistics") {
            // 判断是否是付费用户，付费用户能使用统计，普通用户点击弹出引导消费页面
            if (versionInfo.expired === false) {
                props.history.push(data.path)
                setSelectKey(data.path)
            } else {
                // props.history.push("/log/advert")
                setLogStatisticsFreeVisable(true)
            }
        } else {
            props.history.push(data.path)
            setSelectKey(data.path)
        }
    }

    // 统计菜单
    const statisticsMenuList = [
        {
            title: '概览',
            path: "/statistics/overview",
            key: "overview",
            icon: "survey-default",
        },
        {
            title: '项目统计',
            path: "/statistics/project",
            key: "projectStatistics",
            type: "statistics",
            icon: "statistics-project",
            children: [
                {
                    title: "成员事项",
                    path: "/statistics/project/memberItem",
                    key: "projectMemberItem",
                    type: "statistics"
                }
            ]
        },
        {
            title: '项目集统计',
            path: "/statistics/projectSet",
            key: "projectSetStatistics",
            icon: "statistics-projectSet",
            children: [
                {
                    title: "项目成员",
                    path: "/statistics/projectSet/member",
                    key: "projectSetMember",
                    type: "statistics"
                },
                {
                    title: "项目事项",
                    path: "/statistics/projectSet/workItem",
                    key: "projectSetWorkItem",
                    type: "statistics"
                },
                {
                    title: "项目进展",
                    path: "/statistics/projectSet/projectProgress",
                    key: "projectSetProjectProgress",
                    type: "statistics"
                }
            ]
        },
        {
            title: '事项统计',
            path: "/statistics/workItem",
            key: "workItemStatistics",
            icon: "statistics-work",
            children: [
                {
                    title: "新增事项趋势",
                    path: "/statistics/workItem/newTrend",
                    key: "newTrend",
                    type: "statistics"
                },
                {
                    title: "完成事项趋势",
                    path: "/statistics/workItem/completeTrend",
                    key: "completeTrend",
                    type: "statistics"
                },
                {
                    title: "事项趋势",
                    path: "/statistics/workItem/workItemTrend",
                    key: "workItemTrend",
                    type: "statistics"
                },
                {
                    title: "事项概览",
                    path: "/statistics/workItem/overview",
                    key: "workItemOverview",
                    type: "statistics"
                }
            ]
        },
        {
            title: '工时统计',
            path: "/statistics/log",
            key: "logStatistics",
            type: "statistics",
            icon: "statistics-log",
            children: [
                {
                    title: "项目成员统计",
                    path: "/statistics/log/projectuser",
                    key: "projectStatistic",
                    type: "proStatistics"
                },
                {
                    title: "日志事项统计",
                    path: "/statistics/log/projectwork",
                    key: "workStatistic",
                    type: "proStatistics"
                },
                {
                    title: "日志项目统计",
                    path: "/statistics/log/userproject",
                    key: "userProject",
                    type: "proStatistics"
                }
            ]
        },
    ]

    // 渲染菜单
    const renderMenu = (data, deep, index) => {
        return (
            <li
                style={{  paddingLeft: `${deep * 20 + 20}` }}
                className={`statistics-aside-li statistics-aside-second ${data.path === selectKey ? "statistics-aside-select" : ""}`}
                onClick={() => select(data)}
                key={data.key}
            >
                <span className="statistics-aside-item-left">
                    {
                        data.icon && <svg className="img-icon-right" aria-hidden="true">
                            <use xlinkHref={`#icon-${data.icon}`}></use>
                        </svg>
                    }

                    <span>{data.title}</span>
                </span>
                {
                    // versionInfo.expired === true && data.type === "statistics" && <svg className="img-icon" aria-hidden="true" >
                    //     <use xlinkHref="#icon-member"></use>
                    // </svg>
                }

            </li>

        )
    }

    // 树的展开与闭合
    const [expandedTree, setExpandedTree] = useState(["projectStatistics"])

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    // 菜单的展开与闭合
    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }

    const renderSubMenu = (item, deep, index) => {

        return (
            <li key={item.key} title={item.title} className="statistics-aside-li">
                <div className="statistics-aside-item statistics-aside-first" style={{ paddingLeft: `${deep * 20 + 20}` }} onClick={() => setOpenOrClose(item.key)}>
                    <span to={item.path} className="statistics-aside-item-left">
                        {
                            item.icon && <svg className="img-icon-right" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.icon}`}></use>
                            </svg>
                        }

                        <span className="statistics-aside-title">{item.title}</span>
                    </span>
                    <div className="statistics-aside-item-icon">
                        {
                            item.children ?
                                (isExpandedTree(item.key) ?
                                        <DownOutlined style={{ fontSize: "10px" }} /> :
                                        <UpOutlined style={{ fontSize: "10px" }} />
                                ) : ""
                        }
                    </div>
                </div>

                <ul title={item.title} className={`statistics-aside-ul ${isExpandedTree(item.key) ? null : 'statistics-aside-hidden'}`}>
                    {
                        item.children && item.children.map(item => {
                            const deepnew = deep + 1
                            return item.children && item.children.length ?
                                renderSubMenu(item, deepnew, index) : renderMenu(item, deepnew, index)
                        })
                    }
                </ul>
            </li>

        )
    }

    return (
        <Fragment>
            <div className="statistics-aside">
                <div className="statistics-aside-name">
                    统计
                </div>
                <ul style={{ padding: 0 }} key="0" className="statistics-aside-content">
                    {
                        statisticsMenuList && statisticsMenuList.map((firstItem, index) => {
                            return firstItem.children && firstItem.children.length > 0 ?
                                renderSubMenu(firstItem, 0, index) : renderMenu(firstItem, 0, index)
                        })
                    }
                </ul>
            </div>
            <LogStatisticsFree
                logStatisticsFreeVisable={logStatisticsFreeVisable}
                setLogStatisticsFreeVisable={setLogStatisticsFreeVisable}
            />
        </Fragment>
    )
}
export default withRouter(StatisticsAside);
