import React from "react";
import AsyncComponent from './common/lazy/SyncComponent'
import { Redirect } from "react-router-dom";

const Login = AsyncComponent(() => import('./modules/login/login'))
//组织中心
// import {AuthConfig} from "doublekit-user-ui";
import {AuthConfig,Directory} from "doublekit-user-ui";
import {PreliminaryType,Preliminary,FormUI,ProjectForm} from "doublekit-form-ui";
import {ProjectFlowList,SystemFlowList,FlowStatusList} from "doublekit-flow-ui"
// 状态组件
import{PrivilegeRole, RoleDetail, PrivilegeFeature} from "doublekit-privilege-ui";
// 消息
import {UserMessage,MessageSendType,MessageType,MessageTemplate,MessageManagement,EmailCfg} from "doublekit-message-ui";

import { PluginDetail } from 'doublekit-plugin-manage';

const Orga = AsyncComponent(() => import('./modules/sysmgr/common/containers/orga'))
const OrgaUser = AsyncComponent(() => import('./modules/sysmgr/orga/user'))
const OrgaContent = AsyncComponent(() => import('./modules/sysmgr/orga/orga'))
const WorkType = AsyncComponent(() => import('./modules/sysmgr/workSeting/components/workType'))
const workPriority = AsyncComponent(() => import('./modules/sysmgr/workSeting/components/workPriority'))
const WorkTypeFlow = AsyncComponent(() => import('./modules/sysmgr/workSeting/components/workTypeFlow'))
const WorkTypeForm = AsyncComponent(() => import('./modules/sysmgr/workSeting/components/workTypeForm'))
const ProjectType = AsyncComponent(() => import('./modules/sysmgr/projectType/components/projectType'))
const ProjectLicence = AsyncComponent(() => import('./modules/sysmgr/licence/projectLicence'))
const ProjectPlugin = AsyncComponent(() => import('./modules/sysmgr/plugin/projectPlugin'))
//权限中心
// 系统 功能管理
const SystemFeature = AsyncComponent(() => import('./modules/sysmgr/privilege/components/systemFeature'))

// 系统角色管理
const SystemRole = AsyncComponent(() => import('./modules/sysmgr/privilege/components/systemRole'))

// 项目功能管理
const ProjectFeature = AsyncComponent(() => import('./modules/sysmgr/privilege/components/projectFeature'))
const ProjectRole = AsyncComponent(() => import('./modules/sysmgr/privilege/components/projectRole'))

const Index = AsyncComponent(() => import('./modules/home/containers/portal'))
// const Index = AsyncComponent(() => import('./modules/home/localHeader'))
const Home = AsyncComponent(() => import('./modules/home/components/homePage'))
const WorkAll = AsyncComponent(() => import('./modules/work/components/work'))

// 项目
const Project = AsyncComponent(() => import('./modules/project/project/containers/project'))
const ProjectDetail = AsyncComponent(() => import('./modules/project/common/containers/projectDetail'))
const Survey = AsyncComponent(() => import('./modules/project/survey/containers/survey'))
const Sprint = AsyncComponent(() => import('./modules/project/sprint/containers/sprint'))
const PlanSprint = AsyncComponent(() => import('./modules/project/sprintPlan/containers/sprintPlan'))
const WorkItem = AsyncComponent(() => import('./modules/project/work/components/workItem'))

const Work = AsyncComponent(() => import('./modules/project/work/containers/work'))

const Milestone = AsyncComponent(() => import('./modules/project/milestone/containers/milestone'))

const Linemap = AsyncComponent(() => import('./modules/project/lineMap/constainer/lineMap'))

const Version = AsyncComponent(() => import('./modules/project/version/containers/version'))
const VersionPlan = AsyncComponent(() => import('./modules/project/version/components/versionPlan'))
const PrivilegeDomainUser = AsyncComponent(() => import('./modules/project/user/user'));
const Plan = AsyncComponent(() => import('./modules/project/plan/containers/plan'));
const PlanWorkItem = AsyncComponent(() => import('./modules/project/plan/components/planWorkItem'));
// 项目设置
const ProjectSetDetail = AsyncComponent(()=> import('./modules/projectSet/common/containers/projectSetDetail'))
const Module = AsyncComponent(() => import('./modules/projectSet/module/containers/module'))
const BasicInfo = AsyncComponent(() => import('./modules/projectSet/basicInfo/containers/basicInfo'))
// 项目权限
const ProjectDomainRole = AsyncComponent(() => import('./modules/project/privilege/containers/projectDomainRole'));
// 统计
const Statistics = AsyncComponent(() => import('./modules/project/statistics/containers/statistics'))
const StatisticsWork = AsyncComponent(() => import('./modules/project/statistics/components/statisticsWork'))
const StatisticsBulidAndEndWork = AsyncComponent(() => import('./modules/project/statistics/components/statisticsBulidAndEndWork'))
// import { Test } from "doublekit-plugin1-ui"

const WorkAddPage = AsyncComponent(() => import('./modules/project/work/components/workAddPage'))
// 迭代
const SprintHome = AsyncComponent(() => import('./modules/sprint/common/containers/sprint'))
const SprintStatisticsWork = AsyncComponent(() => import('./modules/sprint/sprintStatistics/components/statisticsWork'))

// 搜索页面
const SearchResult = AsyncComponent(() => import('./modules/search/components/searchResult'))

// 项目集
const Program = AsyncComponent(() => import('./modules/program/containers/program'))
const ProgramDetail = AsyncComponent(() => import('./modules/program/components/programDetail'))

// 日志
const Log = AsyncComponent(() => import('./modules/log/containers/log'))

// 路线图
const RollAxis = AsyncComponent(() => import('./modules/rollAxis/rollAxis'))

// 导入外部数据
const LoadData = AsyncComponent(() => import('./modules/sysmgr/loadData/loadData'))

const routesSaas=[
    {
        path: "/index",
        component: Index,
        routes: [
            {
                path: "/index/home",
                exact: true,
                component: Home,
                key: 'home'
            },
            {
                path: "/index/project",
                exact: true,
                component: Project,
                key: 'project'

            },
            {
                path: "/index/userMessage",
                exact: true,
                component: UserMessage,
                key: 'userMessage'
            },
            // 临时，搜索
            {
                path: "/index/log",
                exact: false,
                component: Log,
                key: "log"
            },
            {
                path: "/index/program",
                exact: false,
                component: Program,
                key: "Program"
            },
            {
                path: "/index/programDetail/:id",
                exact: false,
                component: ProgramDetail,
                key: "ProgramDetail"
            },
            {
                path: "/index/projectSetDetail",
                exact: false,
                component: ProjectSetDetail,
                key: "ProjectSetDetail",
                routes: [
                    {
                        path: "/index/projectSetDetail/basicInfo",
                        component: BasicInfo,
                    },
                    {
                        path: "/index/projectSetDetail/module",
                        component: Module,
                    },
                    {
                        path: "/index/projectSetDetail/user",
                        component: PrivilegeDomainUser,
                    },
                    {
                        path: "/index/projectSetDetail/projectDomainRole",
                        component: ProjectDomainRole,
                    },
                ]
            },
            {
                path: "/index/sprint/:id",
                exact: false,
                component: Sprint,
                key: "Sprint"
            },
            {
                path: "/index/work",
                component: WorkAll,
                key: 'WorkAll',
                routes: [
                    {
                        path: "/index/work/worklist",
                        component: WorkItem,
                        exact: true
                    },
                    {
                        path: "/index/work/workadd",
                        component: WorkAddPage,
                        exact: true
                    },
                    {
                        path: "/index/work/*",
                        component: () => <Redirect to="/index/work/worklist"/>,
                        exact: true
                    }
                ]

            },
            {
                path: "/index/organ",
                component: Orga,
                key: 'Orga',
                routes: [
                    {
                        path: "/index/organ/organ",
                        component: OrgaContent,
                        exact: true
                    },
                    {
                        path: "/index/organ/user",
                        component: OrgaUser,
                        exact: true
                    },
                    {
                        path: "/index/organ/workstatus",
                        component: FlowStatusList,
                        exact: true
                    },
                    {
                        path: "/index/organ/worktype",
                        component: WorkType,
                        exact: true
                    },
                    {
                        path: "/index/organ/workpriority",
                        component: workPriority,
                        exact: true
                    },
                    {
                        path: "/index/organ/workTypeFlow/:id",
                        component: WorkTypeFlow,
                        exact: true
                    },
                    {
                        path: "/index/organ/workTypeForm/:id",
                        component: WorkTypeForm,
                        exact: true
                    },
                    {
                        path: "/index/organ/projectType",
                        component: ProjectType,
                        exact: true
                    },
                    // 系统功能管理
                    {
                        path: "/index/organ/systemFeature",
                        component: SystemFeature,
                        exact: true
                    },
                    // 系统角色管理
                    {
                        path: "/index/organ/systemRole",
                        component: SystemRole,
                        exact: true
                    },
                    // 项目功能管理
                    {
                        path: "/index/organ/projectFeature",
                        component: ProjectFeature,
                        exact: true
                    },
                     // 项目角色管理
                    {
                        path: "/index/organ/projectRole",
                        component: ProjectRole,
                        exact: true
                    },
                    {
                        path: "/index/organ/preliminaryType",
                        component: PreliminaryType,
                        exact: true
                    },
                    {
                        path: "/index/organ/preliminary",
                        component: Preliminary,
                        exact: true
                    },
                    {
                        path: "/index/organ/form",
                        component: FormUI,
                        exact: true
                    },
                    {
                        path: "/index/organ/projectForm",
                        component: ProjectForm,
                        exact: true
                    },
                    {
                        path: "/index/organ/projectFlow",
                        component: ProjectFlowList,
                        exact: true
                    },
                    {
                        path: "/index/organ/systemFlow",
                        component: SystemFlowList,
                        exact: true
                    },
                    {   
                        path: "/index/organ/privilegeRole",
                        component: PrivilegeRole,
                        exact: true
                    },
                    {   
                        path: "/index/organ/PrivilegeFeature",
                        component: PrivilegeFeature,
                        exact: true
                    },
                    {   
                        path: "/index/organ/RoleDetail/:id",
                        component: RoleDetail,
                        exact: true
                    },
                    // 消息中心
                    {
                        path: "/index/organ/messageManagement",
                        component: MessageManagement,
                        exact: true
                    },
                    {
                        path: "/index/organ/messageTemplate",
                        component: MessageTemplate,
                        exact: true
                    },
                    {
                        path: "/index/organ/messageType",
                        component: MessageType,
                        exact: true
                    },
                    {
                        path: "/index/organ/messageSendType",
                        component: MessageSendType,
                        exact: true
                    },
                    {
                        path: "/index/organ/emailConfig",
                        component: EmailCfg,
                        exact: true
                    },
                    {
                        path: "/index/organ/authconfig",
                        component: AuthConfig,
                        exact: true
                    },
                    {
                        path: "/index/organ/loadData",
                        component: LoadData,
                        exact: true
                    },
                    {
                        path: "/index/organ/directory",
                        component: Directory,
                        exact: true
                    },
                    {
                        path: "/index/organ/licence",
                        component: ProjectLicence,
                        exact: true
                    },
                    {
                        path: "/index/organ/plugin",
                        component: ProjectPlugin,
                        exact: true
                    },
                    {
                        path: "/index/organ/pluginDetail",
                        component: PluginDetail,
                        exact: true
                    }
                ]
            },
            {
                path: "/index/prodetail",
                component: ProjectDetail,
                routes: [
                    {
                        path: "/index/prodetail/workMessage/:id",
                        component: WorkItem,
                        routes:[],
                    },
                    {
                        path: "/index/prodetail/survey",
                        component: Survey,
                    },
                    {
                        path: "/index/prodetail/sprint",
                        component: Sprint
                
                    },
                    {
                        path: "/index/prodetail/linemap",
                        component: Linemap,
                    },
                    {
                        path: "/index/prodetail/sprintPlan",
                        component:PlanSprint,
                    },
                    {
                        path: "/index/prodetail/version",
                        component: Version,
                    },
                    {
                        path: "/index/prodetail/versionPlan",
                        component: VersionPlan,
                    },
                    {
                        path: "/index/prodetail/work",
                        component: Work,
                        routes:[],
                    },
                    
                    {
                        path: "/index/prodetail/addDemand",
                        component: WorkAddPage,
                    },
                    {
                        path: "/index/prodetail/milestone",
                        component: Milestone,
                    },
                    {
                        path: "/index/prodetail/plan",
                        component:Plan,
                    },
                    {
                        path: "/index/prodetail/planWorkItem/:id",
                        component:PlanWorkItem,
                    },
                    {
                        path: "/index/prodetail/statistics",
                        component: Statistics,
                        routes: [
                            {
                                path: "/index/prodetail/statistics/work/:id",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/index/prodetail/statistics/workbulidend/:id",
                                component: StatisticsBulidAndEndWork,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/index/prodetail/sprintdetail",
                        component: SprintHome,
                        routes: [
                            {
                                path: "/index/prodetail/sprintdetail/SprintStatisticsWork",
                                component: SprintStatisticsWork,
                            }
                        ]
                    },
                ]
            }
        ]
    },
    {
        path: "/",
        component: () => <Redirect to="/index"/>,
        exact: true
    },
]
export default routesSaas;