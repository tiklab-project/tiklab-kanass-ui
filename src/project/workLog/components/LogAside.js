/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-12 13:59:12
 */
import React, { Fragment, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import { withRouter } from 'react-router';

const LogSide = (props) => {
    const { logStore } = props;
    const [selectMenu, setSelectMenu] = useState("log")

    const [selectKey,setSelectKey] = useState("log");

    const goLogStatistics = (value) => {
        setSelectMenu(value)
        setSelectKey(value)
        switch (value) {
            case "log":
                props.history.push("/index/log/list")
                break;
            case "projectStatistics":
                props.history.push("/index/log/projectLogStatistics")
                break;
            case "userStatistics":
                props.history.push("/index/log/userStatistics")
                break;
            default:
                break;
        }

    }

    const [expandedTree, setExpandedTree] = useState(["/index/organ/organ"])

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item ===key)
    }

    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
    }


    return (
        <Fragment>
            <div className="log-aside">
                <div className="log-title"
                >
                    <div>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-log"></use>
                        </svg> 工时
                    </div>
                </div>
                <li key={1} className={`log-aside-li ${"log" === selectKey ? "log-aside-select" : ""}`} onClick={() =>goLogStatistics("log") }>
                    <div className="log-aside-item log-aside-first" style={{ paddingLeft: 20 }} >
                        <span to={"log"}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-statisticslog"></use>
                            </svg>
                            <span className="log-aside-title">工时查询</span>
                        </span>
                    </div>
                </li>
                <li key={2} className="log-aside-li">
                    <div className="log-aside-item log-aside-first" style={{ paddingLeft: 20 }}  onClick={() => setOpenOrClose("project")}>
                        <span to={"project"}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-statisticslog"></use>
                            </svg>
                            <span className="log-aside-title">工时统计</span>
                        </span>
                        <div className="log-aside-item-icon">
                            {
                                isExpandedTree("project") ?
                                    <DownOutlined style={{ fontSize: "10px" }} /> :
                                    <UpOutlined style={{ fontSize: "10px" }} />
                                    
                            }
                        </div>
                    </div>

                    <ul className={`log-aside-ul ${isExpandedTree("project") ? null : 'log-aside-hidden'}`}>
                        <li
                            style={{ cursor: "pointer", paddingLeft: 40 }}
                            className={`log-aside-li log-aside-second ${"projectStatistics" === selectKey ? "log-aside-select" : ""}`}
                            onClick={() =>goLogStatistics("projectStatistics") }
                        >

                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-statisticslog"></use>
                            </svg>
                            <span>项目工时统计</span>
                        </li>
                        <li
                            style={{ cursor: "pointer", paddingLeft: 40 }}
                            className={`log-aside-li log-aside-second ${"userStatistics" === selectKey ? "log-aside-select" : ""}`}
                            onClick={() =>goLogStatistics("userStatistics") }
                        >

                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-statisticslog"></use>
                            </svg>
                            <span>人员工时统计</span>
                        </li>
                    </ul>
                </li>
            </div>
        </Fragment>
    )
}
export default withRouter(inject('logStore')(observer(LogSide)));