/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-12 13:59:12
 */
import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router';
import "./InsightSide.scss";

const InsightSide = (props) => {
    const { logStore } = props;
    const [selectMenu, setSelectMenu] = useState("list")

    const [selectKey, setSelectKey] = useState();

    const goLogStatistics = (value) => {
        setSelectMenu(value)
        setSelectKey(value)
        switch (value) {
            case "list":
                props.history.push("/index/insight/list")
                break;
            default:
                break;
        }

    }

    const [expandedTree, setExpandedTree] = useState(["/index/organ/organ"])

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


    return (
        <Fragment>
            <div className="insight-aside">
                <div className="insight-title">
                    <div>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-statisticslog"></use>
                        </svg>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-insight"></use>
                        </svg> 仪表盘
                    </div>
                </div>
                <li key={1} className= {`insight-aside-li ${selectMenu === "list" ?  "insight-menu-select": ""}`} onClick={() => goLogStatistics("list")}>
                    <div className="insight-aside-item insight-aside-first" style={{ paddingLeft: 20 }} >
                        <span to={"list"}>
                            <svg  aria-hidden="true" className="svg-icon">
                                <use xlinkHref="#icon-statisticslog"></use>
                            </svg>
                            <span className="insight-aside-title">仪表盘列表</span>
                        </span>
                    </div>
                </li>
            </div>
        </Fragment>
    )
}
export default withRouter(InsightSide);