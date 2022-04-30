/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-16 13:43:46
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-25 11:38:30
 */
import React from "react";
import AsyncComponent from './common/lazy/SyncComponent'
import { Redirect } from "react-router-dom";

const ProjectTabBar = AsyncComponent(() => import('./modules/home/containers/projectTabBar'))
const Project = AsyncComponent(() => import('./modules/project/project/containers/project'))
const ProjectDetailTab = AsyncComponent(() => import('./modules/project/common/projectDetailTab'))

const Set = AsyncComponent(() => import('./modules/home/components/set'))
const Wechat = AsyncComponent(() => import("./modules/home/containers/wechat"))
const routes = [
    {
        path: "/project",
        exact: true,
        component: Wechat,
        
    },
    {
        path: "/index",
        component: ProjectTabBar,
        routes: [
            // {
            //     path: "/index",
            //     exact: true,
            //     component: Project,
            //     key: 'project'
            // },
            {
                path: "/index/project",
                exact: true,
                component: Project,
                key: 'project'
            },
            {
                path: "/index/set",
                exact: true,
                component: Set,
                key: 'set'
            },
        ]
    },
    {
        path: "/project",
        component: ProjectDetailTab,
        key: 'ProjectDetail',
        routes: [
            {
                path: "/project/projectDetail",
                exact: true,
                component: ProjectDetailTab,
                key: 'ProjectDetail'
            },
        ]
    },
    {
        path: "/",
        exact: true,
        component: () => <Redirect to="/index/project"/>,
    },
    
]
export default routes;