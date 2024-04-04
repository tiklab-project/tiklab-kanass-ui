/*
 * @Descripttion: 系统头部
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-08 10:44:07
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 10:16:03
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Col, Row, Dropdown, Space } from "antd";
import { withRouter } from 'react-router';
import { getUser } from 'thoughtware-core-ui';
import { observer, inject } from "mobx-react";
import logo from "../../../assets/images/logo.png";
import Search from "../../search/components/Search";
import MessageList from "./MessageList";

import "./Header.scss";
const Header = props => {
    const { systemRoleStore, AppLink, HelpLink, AvatarLink } = props;
    // 被点击菜单的key
    const menuKey = (sessionStorage.getItem("menuKey") && props.location.pathname !== "/home") ? sessionStorage.getItem("menuKey") : "home";
    // 语言包
    const { i18n } = useTranslation();
    // 登录者的信息
    const user = getUser();

    useEffect(() => {
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "kanass")
        }
        return;
    }, [])


    /**
     * 点击菜单跳转
     * @param {菜单信息} item 
     */
    const changeCurrentLink = item => {
        localStorage.removeItem("sprintId")
        props.history.push(item.to)
        sessionStorage.setItem("menuKey", item.key)
    }

    /**
     * 渲染左侧菜单
     * @returns 
     */
    const renderRouter = () => {
        if (routers) {
            return (
                <div className={'frame-header-link'}>
                    {
                        routers.map(item => {
                            return <div key={item.key}
                                onClick={() => changeCurrentLink(item)}
                                className={`frame-header-link-item ${menuKey === item.key ? 'frame-header-link-active' : null}`}
                            >
                                <span>
                                    {item.title}
                                </span>

                            </div>
                        })
                    }
                    {/* <div key='home' onClick={() => changeCurrentLink(routers[0])} className={`frame-header-link-item ${menuKey === "home" ? 'frame-header-link-active' : null}`}> {routers[0].title}</div>
                    <div key='project' onClick={() => changeCurrentLink(routers[1])} className={`frame-header-link-item ${menuKey === "project" ? 'frame-header-link-active' : null}`}> {routers[1].title}</div>
                    <div key='projectSet' onClick={() => changeCurrentLink(routers[2])} className={`frame-header-link-item ${menuKey === "projectSet" ? 'frame-header-link-active' : null}`}> {routers[2].title}</div>
                    <div key='work' onClick={() => changeCurrentLink(routers[3])} className={`frame-header-link-item ${menuKey === "work" ? 'frame-header-link-active' : null}`}> {routers[3].title}</div>
                    <div key='insight' onClick={() => changeCurrentLink(routers[4])} className={`frame-header-link-item ${menuKey === "insight" ? 'frame-header-link-active' : null}`}> {routers[4].title}</div> */}
                    {/* <HeadMoreMenu /> */}
                </div>
            )
        }
    }



    /**
     * 跳转到系统设置
     */
    const goSet = () => {
        props.history.push("/setting/home")
        sessionStorage.setItem("menuKey", "set")
    };

    // 系统顶部菜单
    const routers = [
        {
            to: '/home/survey',
            title: '首页',
            key: 'home'
        },
        {
            to: '/project',
            title: '项目',
            key: 'project'
        },
        {
            to: '/projectSetList',
            title: '项目集',
            key: 'projectSet'
        },
        {
            to: '/workTable',
            title: '事项',
            key: 'work'
        },
        {
            to: '/log/list',
            title: '工时',
            key: 'log'
        },
        // {
        //     to: '/insight/list',
        //     title: '仪表盘',
        //     key: 'insight'
        // }
    ]
    return (
        <Row className="frame-header">
            <Col span={12}>
                <div className={'frame-header-left'}>
                    <AppLink isSSO={false} />
                    {logo && <div className={'frame-header-logo'}>
                        <img src={logo} alt={'logo'} className="logo-img"/>
                        <div className="logo-text">kanass</div>
                    </div>}
                    {renderRouter()}
                </div>
            </Col>
            <Col span={12}>
                <div className={'frame-header-right'}>
                    <div className='frame-header-right-search-wrap'>
                        <Search />
                    </div>
                    <div className={'frame-header-right-text'}>
                        <div className="frame-header-icon">
                            <div className="frame-header-set" data-title-bottom="系统设置" onClick={() => goSet()}>
                                <Space>
                                    <svg aria-hidden="true" className="header-icon">
                                        <use xlinkHref="#icon-iconsetsys"></use>
                                    </svg>
                                </Space>
                            </div>
                        </div>
                        <MessageList />
                        <HelpLink />
                        <AvatarLink {...props} />
                    </div>
                </div>
            </Col>

        </Row>
    )
}
export default withRouter(inject('homeStore', 'systemRoleStore')(observer(Header)));