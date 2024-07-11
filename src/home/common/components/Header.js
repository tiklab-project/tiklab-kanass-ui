/*
 * @Descripttion: 系统头部
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-08 10:44:07
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 10:16:03
 */
import React, { useState, useEffect } from 'react';
import { Space } from "antd";
import { withRouter } from 'react-router';
import { getUser } from 'thoughtware-core-ui';
import { observer, inject } from "mobx-react";
import Search from "../../search/components/Search";
import MessageList from "./MessageList";
import logo from "../../../assets/images/logo.png";

import "./Header.scss";
const Header = props => {
    const { systemRoleStore, AppLink, AvatarLink } = props;

    // 登录者的信息
    const user = getUser();

    useEffect(() => {
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "kanass")
        }
        return;
    }, [])

    return (
        <div className='frame-header'>
            <div className="frame-left">
                <div className="frame-applink">
                    <AppLink />
                </div>

                <div className='frame-menu-logo' onClick={() => props.history.push("/home/survey")}>
                    <img src={logo} alt={'logo'} className="logo-img" />
                    <div className='logo-text'>Kanass</div>
                </div>
            </div>

            <div className='frame-header-search-wrap'>
                <Search />
            </div>
            <div className={'frame-header-right'}>
                <MessageList />
                <AvatarLink {...props} />
            </div>
        </div>
    )
}
export default withRouter(inject('homeStore', 'systemRoleStore')(observer(Header)));