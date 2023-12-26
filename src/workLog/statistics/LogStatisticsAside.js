import React, { useEffect, useState, useRef, Fragment } from "react";
import "./LogStatisticsAside.scss";
import { Layout } from "antd";
const { Sider, Content } = Layout;
const LogStatisticsAside = (props) => {
    // 已展开子级的阶段id集合
    const [expandedTree, setExpandedTree] = useState([])
    // 选中的菜单
    const [selectRouter, setSelectRouter] = useState("logprojectuser")
    /**
    * 判断树是否展开
    * @param {上级的id} key 
    * @returns 
    */
    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }
    const logReportList = [
        {
            key: "logProjectUser",
            title: "日志成员统计",
            type: "logprojectuser"
        },
        {
            key: "logProjectWork",
            title: "日志事项统计",
            type: "logprojectwork"
        },
        {
            key: "logUserProject",
            title: "日志项目统计",
            type: "loguserproject"
        },
    ]

    /**
     * 点击菜单
     * @param {} id 
     * @param {*} type 
     */
    const selectKey = (type) => {

        setSelectRouter(type)
        props.history.push(url);
    }

    return (
        <Sider width={232} >
            <div className="log-statistics-aside">
                <div className='statistics-type-title'>
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
                            logReportList && logReportList.map((item, index) => {
                                return <div key={index}>
                                    <div
                                        className={`statistics-menu-firstmenu ${item.type === selectRouter ? "statistics-menu-select" : ""}`}
                                        onClick={() => selectKey(item.type)}
                                        key={item.key}
                                    >
                                        <span>
                                            {item.title}
                                        </span>
                                        {/* {
                                        versionInfo.expired === true && <svg className="img-icon" aria-hidden="true" >
                                            <use xlinkHref="#icon-member"></use>
                                        </svg>
                                    } */}
                                        <svg className="img-icon" aria-hidden="true" >
                                            <use xlinkHref="#icon-member"></use>
                                        </svg>
                                    </div>
                                </div>

                            })
                        }
                    </div>
                }
            </div>
        </Sider>
    )
}

export default LogStatisticsAside;