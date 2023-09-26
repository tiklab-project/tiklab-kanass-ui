/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:57:23
 */

import React, { Fragment, useState, useEffect } from 'react';
import "../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import VersionChangeModal from "./VersionChangeModal";
import "./versionDetailAside.scss"
const { Sider } = Layout;

const VersionDetailAside = (props) => {
    const { versionDetailStore } = props;
    const { findVersion, version } = versionDetailStore;
    //语言包
    const { t, i18n } = useTranslation();
    // 当前选中路由
    const project = JSON.parse(localStorage.getItem("project"));
    console.log(props)
    const versionId = props.match.params.version;

    const [isShowText, SetIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[5];

    useEffect(() => {
        findVersion({ id: versionId })
        return;
    }, [versionId])

    // 路由
    const router = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/index/${project.id}/versiondetail/${versionId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'survey',
            url: `/index/${project.id}/versiondetail/${versionId}/work/table`,
            key: "work",
            encoded: "work",
        },
        {
            title: "规划",
            icon: 'survey',
            url: `/index/${project.id}/versiondetail/${versionId}/plan`,
            key: "plan",
            encoded: "plan",
        }
    ];

    //点击左侧菜单
    const selectMenu = (key) => {
        props.history.push(key)
    }

    //点击折叠或展开菜单
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const backProject = () => {
        props.history.push(`/index/projectDetail/${project.id}/version`)
    }

    return (
        <Fragment>
            <Sider trigger={null} collapsible collapsed={!isShowText} collapsedWidth="80" width="180" className='version-detail-side'>
                <div className={`version-aside-content ${isShowText ? "" : "version-icon"}`}>
                    <VersionChangeModal
                        isShowText={isShowText}
                        version={version}
                    />


                    <ul className="version-menu">
                        <div className= "version-back-project">
                            {
                                isShowText ?
                                    <div className={`version-menu-submenu`}
                                        onClick = {() => backProject()}
                                    >
                                        <svg className="menu-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-backproject"></use>
                                        </svg>
                                        <span>
                                            返回项目
                                        </span>
                                    </div>
                                    :
                                    <div className={`version-menu-submenu-icon`}
                                        onClick = {() => backProject()}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref="#icon-backproject"></use>
                                        </svg>
                                        <span>
                                            返回项目
                                        </span>
                                    </div>
                            }

                        </div>
                        {
                            router && router.map((item, index) => {
                                return isShowText ?
                                    <div className={`version-menu-submenu ${path.indexOf(item.key) !== -1 ? "version-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.url)}
                                    >
                                        <svg className="menu-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>
                                    :
                                    <div className={`version-menu-submenu-icon ${path.indexOf(item.key) !== -1 ? "version-menu-select" : ""}`}
                                        key={index}
                                        onClick={() => selectMenu(item.url)}
                                    >
                                        <svg className="svg-icon" aria-hidden="true">
                                            <use xlinkHref={`#icon-${item.icon}`}></use>
                                        </svg>
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>

                            })
                        }
                    </ul>
                    <div className="version-expend" onClick={toggleCollapsed} >
                        {
                            isShowText ?
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-leftcircle"></use>
                                </svg>
                                :
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-rightcircle"></use>
                                </svg>
                        }
                    </div>
                </div>
            </Sider>
        </Fragment>
    )

}
export default withRouter(inject("versionDetailStore")(observer(VersionDetailAside)));