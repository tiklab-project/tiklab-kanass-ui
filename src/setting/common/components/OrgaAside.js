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
import orgaRouter from "./OrgaRouter"

const OrgaAside = (props) => {
    const [selectKey, setSelectKey] = useState("/index/organ/organ");
    // const {pluginConfig} = pluginsStore;
    const select = (key) => {
        setSelectKey(key)
        props.history.push(key)
    }

    const [router, setRouter] = useState(orgaRouter)

    const renderMenu = (data, deep) => {
        return (
            <li
                style={{ cursor: "pointer", paddingLeft: `${deep * 20 + 20}` }}
                className={`orga-aside-li orga-aside-second ${data.key === selectKey ? "orga-aside-select" : ""}`}
                onClick={() => select(data.key)}
                key={data.code}
                code={data.encoded}
            >

                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref={`#icon-${data.icon}`}></use>
                </svg>
                <span>{data.title}</span>
            </li>
        )
    }
    
    // 树的展开与闭合
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

    const renderSubMenu = (item, deep) => {
        return (
            <li key={item.code} title={item.title} className="orga-aside-li">
                <div className="orga-aside-item orga-aside-first" style={{ paddingLeft: `${deep * 20 + 20}` }} onClick={() => setOpenOrClose(item.key)}>
                    <span to={item.key}>
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
                                renderSubMenu(item, deepnew) : renderMenu(item, deepnew)
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
                        router && router.map(firstItem => {
                            return firstItem.children && firstItem.children.length > 0 ?
                                renderSubMenu(firstItem, 0) : renderMenu(firstItem, 0)
                        })
                    }
                </ul>
                <div className="orga-change" onClick={() => props.history.push("/index/setting/projectType")}>
                    设置
                </div>
            </div>
        </Fragment>
    )
}
export default withRouter(OrgaAside);
