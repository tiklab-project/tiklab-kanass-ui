/*
 * @Descripttion: 入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React, { useEffect, useState } from 'react';
import logo from "../../../assets/images/logo_tw5.png";
import { renderRoutes } from "react-router-config";
import LocalHeader from "./Header";
import "../components/Header.scss";
import "../components/HomePage.scss";

import { UserVerify } from 'tiklab-eam-ui';
import { connect } from 'tiklab-plugin-core-ui';
import Search from "../../search/components/Search";

const Layout = (props) => {
    // 路由
    const route = props.route.routes;

    // 系统顶部菜单
    const routers = [
        {
            to: '/index/home/survey',
            title: '首页',
            key: 'home'
        },
        {
            to: '/index/project',
            title: '项目',
            key: 'project'
        },
        {
            to: '/index/projectSetList',
            title: '项目集',
            key: 'projectSet'
        },
        {
            to: '/index/work/worklist',
            title: '事项',
            key: 'work'
        },
        {
            to: '/index/workBulidEnd',
            title: '统计',
            key: 'statistics'
        }
    ]

    // 退出登录
    const projectLogout = () => {
        props.history.push({
            pathname: '/logout',
            state:{
                preRoute: props.location.pathname
            }
        })
    }

    return (
        <div className="frame">
            <LocalHeader
                {...props}
                logo={logo}
                projectLogout={projectLogout}
                search={<Search {...props}/>}
                routers={routers}
            >
            </LocalHeader>
            <div className="frame-content">
                {renderRoutes(route)}
            </div>
        </div>
    )
}


const HomeIndex = UserVerify(Layout, '/noAuth')
function mapStateToProps(state) {
    return {
        pluginStore: state.pluginStore
    }
}
export default connect(mapStateToProps)(HomeIndex);