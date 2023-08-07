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

import { getUser } from 'tiklab-core-ui';
import MessageList from "./MessageList"
import { observer, inject } from "mobx-react";
import { AppLink } from 'tiklab-licence-ui';
import UserIcon from '../../../common/UserIcon/UserIcon';

const Header = props => {
    const { logo, languageSelectData = [], routers, systemRoleStore} = props;
    // 被点击菜单的key
    const menuKey = (sessionStorage.getItem("menuKey") && props.location.pathname !== "/index/home") ? sessionStorage.getItem("menuKey") : "home";
    // 语言包
    const { i18n } = useTranslation();
    const [lan, setLan] = useState(i18n.language);
    //当前的系统语言
    const [showLanguage, setShowLanguage] = useState(false);
    // 登录者的信息
    const user = getUser();

    useEffect(()=> {
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "teamwire")
        }
    },[])

    /**
     * 加载语言包
     * @param {key} param0 
     */
    const onClickLan = ({ key }) => {
        i18n.changeLanguage(languageSelectData[key].value)
        setLan(languageSelectData[key].value)
    };

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
                    <div key='home' onClick={() => changeCurrentLink(routers[0])} className={`frame-header-link-item ${menuKey === "home" ? 'frame-header-link-active' : null}`}> {routers[0].title}</div>
                    <div key='project' onClick={() => changeCurrentLink(routers[1])} className={`frame-header-link-item ${menuKey === "project" ? 'frame-header-link-active' : null}`}> {routers[1].title}</div>
                    <div key='projectSet' onClick={() => changeCurrentLink(routers[2])} className={`frame-header-link-item ${menuKey === "projectSet" ? 'frame-header-link-active' : null}`}> {routers[2].title}</div>
                    <div key='work' onClick={() => changeCurrentLink(routers[3])} className={`frame-header-link-item ${menuKey === "work" ? 'frame-header-link-active' : null}`}> {routers[3].title}</div>
                </div>
            )
        }
    }

    /**
     * 退出登录
     */
    const logOut = () => {
        props.history.push({
            pathname: '/logout',
            state:{
                preRoute: props.location.pathname
            }
        })
    }
  
    /**
     * 个人中心下拉框
     */
    const useMenu = (
        <div className="user-box">
            <div className='user-head'>
                个人资料
            </div>
            <div className='user-info'>
                <UserIcon name = {user.nickname ? user.nickname : user.name}/>
                <div className='user-info-text'>
                    <div className='user-info-name'>{user.nickname ? user.nickname : user.name}</div>
                    <div className='user-info-email'>{user.phone || "暂无"}</div>
                </div>
            </div>
            <div 
                className= "user-language" 
                onMouseEnter={() => setShowLanguage(true)}
                onMouseLeave={() => setShowLanguage(false)}
            >
                <div 
                    className="language-text"
                    
                >   
                <div className="language-left">
                   <svg aria-hidden="true" className="svg-icon" fill="#fff">
                        <use xlinkHref="#icon-yuyan"></use>
                    </svg>
                    语言切换  
                </div>
                    
                    <svg aria-hidden="true" className="svg-icon" fill="#fff">
                        <use xlinkHref="#icon-right">

                        </use>
                    </svg>
                </div>
                {
                    showLanguage && <div className= "language-box">
                        <div className="language-box-item language-box-select">
                            中文
                        </div>
                        <div className="language-box-item">
                            英文
                        </div>
                    </div>
                }
                
            </div>
            <div onClick={logOut} className='user-logout'>
                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-logout"></use>
                </svg>
                退出
            </div>
        </div>
    );

    /**
     * 跳转到系统设置
     */
    const goSet = () => {
        props.history.push("/index/setting/organ")
        sessionStorage.setItem("menuKey", "set")
    };

    const goToHomes = (value) => {
        window.open( homes_url + value, '_blank')
    }
    /**
     * 帮助下拉框
     */
    const helpMenu = (
        <div className="help-box">
            <div className="help-head">
                帮助
            </div>
            <div className="help-item" onClick={() => goToHomes("/document/documentList")}>
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-doc"></use>
                    </svg>
                    文档
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
            <div className="help-item" onClick={() => goToHomes("/question/questionList")}>
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-cuservice"></use>
                    </svg>
                    社区支持
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
            <div className="help-item" onClick={() => goToHomes("/account/workOrder/workOrderList")}>
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-workorder"></use>
                    </svg>
                    在线工单
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
            <div className="help-item" onClick={() => goToHomes("/account/group/onlineservice")}>
                <span className="help-item-left">
                    <svg aria-hidden="true" className="svg-icon">
                        <use xlinkHref="#icon-community"></use>
                    </svg>
                    在线客服
                </span>

                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-jump"></use>
                </svg>
            </div>
        </div>
    )

    return (
        <Row className="frame-header">
            <Col span={12}>
                <div className={'frame-header-left'}>
                    <AppLink isSSO={false} />
                    {logo && <div className={'frame-header-logo'}><img src={logo} alt={'logo'} /></div>}
                    {renderRouter()}
                </div>
            </Col>
            <Col span={12}>
                <div className={'frame-header-right'}>
                    <div className='frame-header-right-search-wrap'>
                        {props.search}
                    </div>
                    <div className={'frame-header-right-text'}>
                        <div className="frame-header-icon">
                            <div className="frame-header-set" data-title="系统设置" onClick={() => goSet()}>
                                <Space>
                                    <svg aria-hidden="true" className="header-icon">
                                        <use xlinkHref="#icon-iconsetsys"></use>
                                    </svg>
                                </Space>
                            </div>
                        </div>
                        <MessageList />
                        <div className="frame-header-icon">
                            <div className="frame-header-help" data-title="帮助与支持">
                                <Dropdown overlay={helpMenu} trigger={"click"}>
                                    <Space>
                                        <svg aria-hidden="true" className="header-icon" style = {{stroke:'#fff'}} >
                                            <use xlinkHref="#icon-help"></use>
                                        </svg>
                                    </Space>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="frame-header-icon">
                            <div className="frame-header-name" data-title="个人资料与设置">
                                <Dropdown overlay={useMenu} trigger={"click"}>
                                    <Space>
                                        <UserIcon  size = "big" name = {user.nickname ? user.nickname : user.name}/>
                                    </Space>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            
        </Row>
    )
}
export default withRouter(inject('homeStore', 'systemRoleStore')(observer(Header)));