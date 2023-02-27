/*
 * @Descripttion: 页面主题框架
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 16:14:15
 */
import React, { useEffect, useState } from 'react';
import logo from "../../../assets/images/logo_tw5.png";
import { renderRoutes } from "react-router-config";
import LocalHeader from "../components/Header";
import "../components/Header.scss";
import "../components/HomePage.scss";

import { verifyUserHoc } from 'tiklab-eam-ui';
import { connect } from 'tiklab-plugin-ui/es/_utils';
import Search from "../../search/container/Search";

const Layout = (props) => {
    const route = props.route ? props.route.routes : [];


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
            to: '/index/projectSet/projectSetList',
            title: '项目集',
            key: 'projectSet'
        },
        {
            to: '/index/work/worklist',
            title: '事项',
            key: 'work'
        },
        {
            to: '/index/statistics/work/workall',
            title: '统计',
            key: 'statistics'
        }
    ]
    // const [component, ModalComponent, editOrAddModal] = useWorkAppConfig(false, productIcons);

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


const IndexHoc = verifyUserHoc(Layout, '/noAuth')
function mapStateToProps(state) {
    return {
        pluginStore: state.pluginStore
    }
}
export default connect(mapStateToProps)(IndexHoc);