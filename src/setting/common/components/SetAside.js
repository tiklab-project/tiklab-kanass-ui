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
import { setDevRouter, setPrdRouter } from "./SetRouter";
import { PrivilegeButton } from "thoughtware-privilege-ui";
import SettingHomeStore from "../../home/store/SettingHomeStore";
import Logo from "../../../home/common/components/Logo"
import { observer } from 'mobx-react';
import useLocalStorageListener from '../../../common/utils/useLocalStorageListener';
const SetAside = (props) => {
    const { setSelectKey, selectKey } = SettingHomeStore;
    // 无子级菜单处理
    // const [selectKey, setSelectKey] = useState("/organ/organ");
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default");
    
    const [router, setRouterMenu] = useState(setDevRouter);
    const authType = JSON.parse(localStorage.getItem("authConfig"))?.authType;
    // const env = localStorage.getItem("authType").authType;
    const select = (data) => {
        const id = data.id;
        if (data.islink && !authType) {
            const authUrl = JSON.parse(localStorage.getItem("authConfig")).authServiceUrl + "#" + data.id;
            window.open(authUrl, '_blank');
        } else {
            props.history.push(id)
            setSelectKey(id)
        }
    }


    useEffect(() => {
        if (env === "local") {
            setRouterMenu(setDevRouter)
        }
        if (env !== "local") {
            setRouterMenu(setPrdRouter)
        }

        return
    }, [])


    const renderMenu = (data, deep, index) => {
        return (
            <PrivilegeButton code={data.purviewCode} key={data.code}>
                <li
                    style={{ cursor: "pointer", paddingLeft: `${deep * 20 + 20}` }}
                    className={`orga-aside-item ${data.id === selectKey ? "orga-aside-select" : ""}`}
                    onClick={() => select(data)}
                    key={data.code}
                    code={data.encoded}
                >
                    <span className="orga-aside-item-left">
                        {
                            data.icon && <svg className="img-icon-right" aria-hidden="true">
                                <use xlinkHref={`#icon-${data.icon}`}></use>
                            </svg>
                        }
                        <span>{data.title}</span>

                    </span>
                    {
                        (data.islink && !authType) && <div className="orga-aside-item-icon">
                            <svg className="img-icon" aria-hidden="true">
                                <use xlinkHref={`#icon-outside`}></use>
                            </svg>
                        </div>
                    }


                </li>
            </PrivilegeButton>

        )
    }

    // 树的展开与闭合
    const [expandedTree, setExpandedTree] = useState(["/setting/version"])

    const isExpandedTree = (key) => {
        return expandedTree.some(item => item === key)
    }

    const setOpenOrClose = key => {
        if (isExpandedTree(key)) {
            setExpandedTree(expandedTree.filter(item => item !== key))
        } else {
            setExpandedTree(expandedTree.concat(key))
        }
        console.log(expandedTree)
    }

    const renderSubMenu = (item, deep, index) => {
        return (
            <PrivilegeButton code={item.purviewCode} key={item.code}>
                <li key={item.code} title={item.title} className="orga-aside-li">
                    <div className="orga-aside-item orga-aside-first"
                        style={{ paddingLeft: `${deep * 20 + 20}` }}
                        onClick={() => setOpenOrClose(item.id)}
                    >
                        {
                            item.icon && <span to={item.id} className="orga-aside-item-left">
                                <svg className="img-icon-right" aria-hidden="true">
                                    <use xlinkHref={`#icon-${item.icon}`}></use>
                                </svg>
                                <span className="orga-aside-title">{item.title}</span>
                            </span>
                        }
                        <div className="orga-aside-item-icon">
                            {
                                item.children ?
                                    (isExpandedTree(item.id) ?
                                        <DownOutlined style={{ fontSize: "10px" }} /> :
                                        <UpOutlined style={{ fontSize: "10px" }} />
                                    ) : ""
                            }
                        </div>
                    </div>

                    <ul title={item.title} className={`orga-aside-ul ${isExpandedTree(item.id) ? null : 'orga-aside-hidden'}`}>
                        {
                            item.children && item.children.map(item => {
                                const deepnew = deep + 1
                                return item.children && item.children.length ?
                                    renderSubMenu(item, deepnew, index) : renderMenu(item, deepnew, index)
                            })
                        }
                    </ul>
                </li>
            </PrivilegeButton>

        )
    }
    const backProject = () => {
        props.history.push(`/index/home/survey`)
        sessionStorage.setItem("menuKey", "home")
    }

    useLocalStorageListener("theme", (updatedTraceInfo) => {
        console.log("data最新值：", updatedTraceInfo)
        setTheme(updatedTraceInfo)
    })

    return (
        <Fragment>
            <div className="orga-aside">
                <ul style={{ padding: 0 }} key="0" className="orga-aside-top">
                    {/* <Logo isShowText = {true} theme = {"default"}/> */}
                    <div className="orga-aside-name">
                        设置
                    </div>
                    <div className="orga-aside-back" onClick={() => backProject()}>
                        <svg className="svg-icon" aria-hidden="true" >
                            <use xlinkHref="#icon-home-default"></use>
                        </svg>
                        返回首页
                    </div>
                    {
                        router && router.map((firstItem, index) => {
                            return firstItem.children && firstItem.children.length > 0 ?
                                renderSubMenu(firstItem, 0, index) : renderMenu(firstItem, 0, index)
                        })
                    }
                </ul>
            </div>

        </Fragment>
    )
}
export default withRouter(observer(SetAside));
