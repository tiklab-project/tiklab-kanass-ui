/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-28 16:34:32
 */
import React, { Fragment, useState, useEffect } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import "./LogAside.scss";
import { getVersionInfo } from "thoughtware-core-ui";
const SetAside = (props) => {
    // 无子级菜单处理
    const path = props.location.pathname;
    const [selectKey, setSelectKey] = useState(path);
    const versionInfo = getVersionInfo();
    const select = (data) => {

        setSelectKey(data.path)
        if (data.type === "statistics") {
            if (versionInfo.expired === false) {
                props.history.push(data.path)
            } else {
                props.history.push("/log/advert")
            }
        }else {
            props.history.push(data.path)
        }

    }


    const logMenuList = [
        {
            title: '工时查看',
            path: "/log/list",
            key: "log",
            children: [
                {
                    title: "全部工时",
                    path: "/log/list",
                    key: "logList"
                },
                {
                    title: "我的工时",
                    path: "/log/userList",
                    key: "userList"
                },
            ]
        },
        {
            title: '工时统计',
            path: "/log/projectStatistic",
            key: "statistics",
            type: "statistics",
            children: [
                {
                    title: "项目成员统计",
                    path: "/log/projectuser",
                    key: "projectStatistic",
                    type: "statistics"
                },
                {
                    title: "日志事项统计",
                    path: "/log/projectwork",
                    key: "workStatistic",
                    type: "statistics"
                },
                {
                    title: "日志项目统计",
                    path: "/log/userproject",
                    key: "userProject",
                    type: "statistics"
                }
            ]
        },
    ]


    const renderMenu = (data, deep, index) => {
        return (
            <li
                style={{ cursor: "pointer", paddingLeft: `${deep * 20 + 20}` }}
                className={`orga-aside-li orga-aside-second ${data.path === selectKey ? "orga-aside-select" : ""}`}
                onClick={() => select(data, index)}
                key={data.key}
            >
                <span className="orga-aside-item-left">
                    {
                        data.icon && <svg className="img-icon-right" aria-hidden="true">
                            <use xlinkHref={`#icon-${data.icon}`}></use>
                        </svg>
                    }

                    <span>{data.title}</span>
                </span>

            </li>

        )
    }

    // 树的展开与闭合
    const [expandedTree, setExpandedTree] = useState(["log"])

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

    const renderSubMenu = (item, deep, index) => {

        return (
            <li key={item.key} title={item.title} className="orga-aside-li">
                <div className="orga-aside-item orga-aside-first" style={{ paddingLeft: `${deep * 20 + 20}` }} onClick={() => setOpenOrClose(item.key)}>
                    <span to={item.path} className="orga-aside-item-left">
                        {
                            item.icon && <svg className="img-icon-right" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.icon}`}></use>
                            </svg>
                        }

                        <span className="orga-aside-title">{item.title}</span>
                    </span>
                    <div className="orga-aside-item-icon">
                        {
                            item.children ?
                                (isExpandedTree(item.key) ?
                                    <DownOutlined style={{ fontSize: "10px" }} /> :
                                    <UpOutlined style={{ fontSize: "10px" }} />
                                ) : ""
                        }
                    </div>
                </div>

                <ul title={item.title} className={`orga-aside-ul ${isExpandedTree(item.key) ? null : 'orga-aside-hidden'}`}>
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
            <div className="orga-aside">
                <ul style={{ padding: 0 }} key="0" className="orga-aside-top">
                    {
                        logMenuList && logMenuList.map((firstItem, index) => {
                            return firstItem.children && firstItem.children.length > 0 ?
                                renderSubMenu(firstItem, 0, index) : renderMenu(firstItem, 0, index)
                        })
                    }
                </ul>
            </div>

        </Fragment>
    )
}
export default withRouter(SetAside);
