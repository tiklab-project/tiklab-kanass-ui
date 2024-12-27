/*
 * @Descripttion: 系统头部, 弃用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-08 10:44:07
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:40:30
 */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { getUser, getVersionInfo } from 'tiklab-core-ui';
import { observer, inject, Provider } from "mobx-react";
import Search from "../../search/components/Search";
import MessageList from "./MessageList";

import "./Header.scss";
import ProjectFeature from '../../../setting/version/ProjectFeature';
import HomeStore from '../store/HomeStore';

const Header = props => {
    const store = {
        homeStore: HomeStore
    }
    const { systemRoleStore, AppLink, AvatarLink, HelpLink, isShowText, SetIsShowText } = props;

    // 登录者的信息
    const user = getUser();

    useEffect(() => {
        if (user && user.userId) {
            systemRoleStore.getSystemPermissions(user.userId, "kanass")
        }
        return;
    }, [])

    return (
        <Provider {...store}>
            <div className='frame-header'>
                <div className="frame-left">
                    <div className="frame-applink">
                        {
                            isShowText ? <svg className="img-25" aria-hidden="true" onClick={() => SetIsShowText(!isShowText)}>
                                <use xlinkHref="#icon-indentation-left"></use>
                            </svg>
                                :
                                <svg className="img-25" aria-hidden="true" onClick={() => SetIsShowText(!isShowText)}>
                                    <use xlinkHref="#icon-indentation-right"></use>
                                </svg>
                        }

                    </div>
                </div>

                <div className='frame-header-search-wrap'>

                </div>
                <div className={'frame-header-right'}>
                    <Search />
                    <MessageList />
                    <HelpLink />
                    <ProjectFeature />
                    <AppLink />
                    <AvatarLink {...props} />
                </div>
            </div>
        </Provider>

    )
}
export default withRouter(inject('systemRoleStore')(observer(Header)));