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

const WorkItemAdd = AsyncComponent(() => import('./modules/project/workItem/components/workItemAdd'))
const Set = AsyncComponent(() => import('./modules/home/components/set'))
const WorkItemDesc = AsyncComponent(() => import("./modules/project/workItem/components/workItemDesc"))
const WorkItemDetail = AsyncComponent(() => import("./modules/project/workItem/components/workItemDetail"))
const SprintAdd = AsyncComponent(() => import("./modules/project/sprint/components/sprintAdd"))
const VersionAdd = AsyncComponent(() => import("./modules/project/version/components/versionAdd"))
const VersionDetail = AsyncComponent(() => import("./modules/project/version/components/versionDetail"))


const MilestoneAdd = AsyncComponent(() => import("./modules/project/milestone/components/milestoneAdd"))
const MilestoneDetail = AsyncComponent(() => import("./modules/project/milestone/components/milestoneDetail"))

const SprintWorkItem = AsyncComponent(() => import("./modules/project/sprint/components/sprintWorkItem"))
const SprintDetail = AsyncComponent(() => import("./modules/project/sprint/components/sprintDetail"))

const ProjectSet = AsyncComponent(() => import("./modules/projectSet/containers/projectSet"))
const ProjectSetDetail = AsyncComponent(() => import("./modules/projectSet/components/projectSetDetail"))

const Log = AsyncComponent(() => import("./modules/log/log"))


const routes = [
    {
        path: "/index",
        component: ProjectTabBar,
        routes: [
            {
                path: "/index/home",
                exact: true,
                component: Project,
                key: 'project'
            },
            {
                path: "/index/projectSet",
                exact: true,
                component: ProjectSet,
                key: 'ProjectSetect'
            },
            {
                path: "/index/log",
                exact: true,
                component: Log,
                key: 'Log'
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
            {
                path: "/project/workItemAdd",
                exact: true,
                component: WorkItemAdd,
                key: 'WorkItemAdd'
            },
           
        ]
    },
    {
        path: "/projectSetDetail/:id",
        component: ProjectSetDetail,
        key: 'ProjectSetDetail',
    },
    {
        path: "/sprintAdd",
        exact: true,
        component: SprintAdd,
        key: 'SprintAdd'
    },
    {
        path: "/workItemAdd",
        component: WorkItemAdd,
        key: 'WorkItemAdd',
    },
    {
        path: "/workItemDesc",
        component: WorkItemDesc,
        key: 'WorkItemDesc',
    },
    {
        path: "/versionAdd",
        exact: true,
        component: VersionAdd,
        key: 'VersionAdd'
    },
    {
        path: "/versionDetail/:id",
        exact: true,
        component: VersionDetail,
        key: 'VersionDetail'
    },
    {
        path: "/milestoneAdd",
        exact: true,
        component: MilestoneAdd,
        key: 'MilestoneAdd'
    },
    {
        path: "/milestoneDetail/:id",
        exact: true,
        component: MilestoneDetail,
        key: 'MilestoneDetail'
    },
    {
        path: "/workItemDetail/:id",
        component: WorkItemDetail,
        key: 'WorkItemDetail',
    },
    {
        path: "/sprintWorkItem/:id",
        component: SprintWorkItem,
        key: 'SprintWorkItem',
    },
   
    {
        path: "/sprintWorkItemAdd/:id",
        component: WorkItemAdd,
        key: 'WorkItemAdd',
    },
    {
        path: "/sprintDetail/:id",
        component: SprintDetail,
        key: 'SprintDetail',
    },
    {
        path: "/",
        exact: true,
        component: () => <Redirect to="/index/home"/>,
    },
    
]
export default routes;