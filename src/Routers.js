import React from "react";
import AsyncComponent from './common/lazy/AsyncComponent'
import { Redirect } from "react-router-dom";

const Login = AsyncComponent(() => import('./login/Login'))
const VailProductUserPage =  AsyncComponent(() => import('./login/VaildProductUserPage'))
const ProjectLogOut = AsyncComponent(() => import('./login/Logout'))
//组织中心
const ProjectProjectDirectory = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeList'))
const ProjectProjectDirectoryView = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeListView'))
const ProjectPreliminaryListSystem = AsyncComponent(() => import('./setting/form/ProjectPreliminaryListSystem'))
const ProjectPreliminaryList = AsyncComponent(() => import('./setting/form/ProjectPreliminaryList'))
const FormList = AsyncComponent(() => import('./setting/form/ProjectFormList'))
const FormListSystem = AsyncComponent(() => import('./setting/form/ProjectFormListSystem'))
const ProjectProjectFormList = AsyncComponent(() => import('./setting/form/ProjectProjectFormList'))
const FormDetail = AsyncComponent(() => import('./setting/form/ProjectFormDetail'))

// const ProjectFlowList = AsyncComponent(() => import('./setting/flow/projectProjectFlowList'))
const ProjectSystemFlowList = AsyncComponent(() => import('./setting/flow/ProjectSystemFlowList'))
const ProjectSystemFlowListSystem = AsyncComponent(() => import('./setting/flow/ProjectSystemFlowListSystem'))
const ProjectFlowStatusList = AsyncComponent(() => import('./setting/flow/ProjectFlowStatusList'))
const FlowDetail = AsyncComponent(() => import('./setting/flow/ProjectFlowDetail'))
const ProjectNodeStatusList = AsyncComponent(() => import('./setting/flow/ProjectNodeStatusList'))
// 状态组件

// 消息
const ProjectMessageSendType = AsyncComponent(() => import('./setting/message/ProjectMessageSendType'))
const ProjectMessageType = AsyncComponent(() => import('./setting/message/ProjectMessageType'))
const ProjectMessageTemplate = AsyncComponent(() => import('./setting/message/ProjectMessageTemplate'))
const ProjectMessageManagement = AsyncComponent(() => import('./setting/message/ProjectMessageManagement'))
const ProjectMessageNotice = AsyncComponent(() => import('./setting/message/ProjectMessageNotice'))
const ProjectMessageNoticeSystem = AsyncComponent(() => import('./setting/message/ProjectMessageNoticeSystem'))

const Setting = AsyncComponent(() => import('./setting/common/components/Setting'))
const WorkTypeList = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeList'))
const WorkTypeSystem = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeSystem'))
const workPriority = AsyncComponent(() => import('./setting/workSeting/components/WorkPriority'))
const WorkTypeFlow = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeFlow'))
const WorkTypeForm = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeForm'))
const ProjectType = AsyncComponent(() => import('./setting/projectType/components/ProjectType'))
const ProjectPlugin = AsyncComponent(() => import('./setting/plugin/ProjectPlugin.js'))

const SystemFeature = AsyncComponent(() => import('./setting/privilege/SystemFeature'))
const SystemRoleBuilt = AsyncComponent(() => import('./setting/privilege/SystemRoleBuilt'))
const SystemRole = AsyncComponent(() => import('./setting/privilege/SystemRole'))
const ProjectFeature = AsyncComponent(() => import('./setting/privilege/ProjectFeature'))
const ProjectRole = AsyncComponent(() => import('./setting/privilege/ProjectRole'))

//组织用户
const Oragn = AsyncComponent(() => import('./setting/common/components/Organ'))
const OrgaContent = AsyncComponent(() => import('./setting/orga/Orga'))
const OrgaUser = AsyncComponent(() => import('./setting/orga/User'))
const ProjectDirectory = AsyncComponent(()=> import("./setting/user/ProjectDirectory"))
const ProjectUserGroup = AsyncComponent(()=> import("./setting/user/ProjectUserGroup"))
const ProjectSystemUserGroup = AsyncComponent(() => import("./setting/user/ProjectSystemUserGroup"))

const Index = AsyncComponent(() => import('./home/common/components/HomeIndex'))
// const Index = AsyncComponent(() => import('./home/localHeader'))
const HomePage = AsyncComponent(() => import('./home/common/components/HomePage'))
const HomeSurvey = AsyncComponent(() => import('./home/common/components/HomeSurvey'))
const WorkAll = AsyncComponent(() => import('./work/components/Work'))
const Dynamic = AsyncComponent(() => import("./home/common/components/DynamicList"))
const WorkTodo = AsyncComponent(() => import("./home/common/components/TodoList"))
// 项目
const Project = AsyncComponent(() => import('./project/project/components/Project'))
const ProjectNomalDetail = AsyncComponent(() => import('./project/common/components/ProjectNomalLayout'))
const ProjectScrumDetail = AsyncComponent(() => import('./project/common/components/ProjectScrumLayout'))
const ProdeNomalSetAside = AsyncComponent(() => import('./project/setting/common/components/ProjectNomalSet'))
const ProjectScrumSetDetail = AsyncComponent(() => import('./project/setting/common/components/ProjectScrumSet'))
const ProjectWorkType = AsyncComponent(() => import('./project/setting/projectWorkType/components/WorkType'))
const ProjectFlowList = AsyncComponent(() => import('./project/setting/projectFlow/ProjectFlow'))
const ProjectFormList = AsyncComponent(() => import('./project/setting/projectForm/ProjectForm'))

const Survey = AsyncComponent(() => import('./project/overview/components/Survey'))
const Sprint = AsyncComponent(() => import('./project/sprint/components/SprintList'))
const PlanSprint = AsyncComponent(() => import('./project/sprint/components/SprintPlan'))
const ProjectLog = AsyncComponent(() => import("./project/workLog/components/LogContent"))
const Work = AsyncComponent(() => import('./work/components/Work'))
const WorkTableDetail = AsyncComponent(() => import('./work/components/WorkTableDetail'))
const Milestone = AsyncComponent(() => import('./project/milestone/components/MilestoneList'))

const Linemap = AsyncComponent(() => import('./project/lineMap/component/LineMap'))

const Version = AsyncComponent(() => import('./project/version/components/VersionTable'))
const VersionDetail = AsyncComponent(() => import('./project/version/components/VersionDeatil.js'))

const VersionPlan = AsyncComponent(() => import('./project/version/components/VersionPlan'))
const PrivilegeDomainUser = AsyncComponent(() => import('./project/user/User'));
const Plan = AsyncComponent(() => import('./project/plan/components/Plan'));
const PlanWorkItem = AsyncComponent(() => import('./project/plan/components/PlanWorkItem'));

const Module = AsyncComponent(() => import('./project/setting/module/components/ModuleList'))
const BasicInfo = AsyncComponent(() => import('./project/setting/basicInfo/components/BasicInfo'))

// 项目权限
const ProjectDomainRole = AsyncComponent(() => import('./project/privilege/ProjectDomainRole'));
const ProjectStatistics = AsyncComponent(() => import('./project/statistics/ProjectStatistics'))
const StatisticsWork = AsyncComponent(()=> import('./statistics/components/StatisticsStatusWork'))
const StatisticsBulidAndEndWork =AsyncComponent(()=> import('./statistics/components/StatisticsBulidAndEndWork'))
const StaticsNewTrend = AsyncComponent(()=> import('./statistics/components/StaticsNewTrend'))
const StaticsEndTrend = AsyncComponent(()=> import('./statistics/components/StaticsEndTrend'))
const StaticsTotalNewTrend = AsyncComponent(()=> import('./statistics/components/StaticsTotalNewTrend'))
const StaticsTotalEndTrend = AsyncComponent(()=> import('./statistics/components/StaticsTotalEndTrend'))

const StatisticsUserProjectLog = AsyncComponent(()=> import('./statistics/components/LogUserProjectStatistics'))
const StatisticsProjectUserLog = AsyncComponent(()=> import('./statistics/components/LogProjectUserStatistics'))
const StatisticsProjectWorkLog = AsyncComponent(()=> import('./statistics/components/LogProjectWorkItemStatistics'))

const WorkAddPage = AsyncComponent(() => import('./work/components/WorkAddPage'))
// 迭代
const SprintHome = AsyncComponent(() => import('./sprint/common/components/SprintLayout'))
const Sprintsurvey = AsyncComponent(()=> import("./sprint/overview/components/SprintSurvey"))
const SprintPlan = AsyncComponent(() => import("./sprint/plan/components/SprintPlan"))

//迭代统计
const SprintStatistics = AsyncComponent(() => import('./sprint/statistics/components/SprintStatistics'))
// 搜索页面
const SearchResult = AsyncComponent(() => import('./home/search/components/SearchResult'))

// 项目集
const ProjectSet = AsyncComponent(() => import('./projectSet/projectSet/components/ProjectSet'))
const ProjectSetList = AsyncComponent(() => import('./projectSet/projectSet/components/ProjectSetTable'))
const ProjectSetDetail = AsyncComponent(() => import('./projectSet/common/components/ProjectSetLayout'))
const ProjectSetProjectList = AsyncComponent(() => import('./projectSet/projectList/components/ProjectSetProjectList'))
const ProjectSetSurvey = AsyncComponent(() => import('./projectSet/overview/components/ProjectSetSurvey'))
const ProjectSetDomainRole = AsyncComponent(() => import('./projectSet/user/ProjectSetDomainRole'));
const ProjectSetUser = AsyncComponent(() => import('./projectSet/user/ProjectSetUser'));
const ProjectSetSet = AsyncComponent(() => import("./projectSet/setting/common/components/ProjectSetSetting"))
const ProjectSetBasicInfo = AsyncComponent(() => import("./projectSet/setting/basicInfo/components/ProjectSetBasicInfo"))
const ProjectWorkStatistics = AsyncComponent(() => import("./projectSet/statistics/components/ProjectSetStatistics"))
// 工时
// const Log = AsyncComponent(() => import('./project/workLog/containers/Log'))
// const ProjectLogStatistics = AsyncComponent(() => import('./project/workLog/components/ProjectStatistics'))
// const UserStatistics = AsyncComponent(() => import('./project/workLog/components/UserStatistics'))
// const LogContent = AsyncComponent(() => import('./project/workLog/components/LogContent.js'))

// 导入外部数据
const LoadData = AsyncComponent(() => import('./setting/loadData/LoadData'))

//效能
const InsightList = AsyncComponent(() => import('./home/insight/components/InsightList'))
const NewInsight = AsyncComponent(() => import("./home/insight/components/NewInsight"))
const ViewInsight = AsyncComponent(() => import("./home/insight/components/ViewInsight"))
//工时
const TaskListContent = AsyncComponent(() => import('./setting/todo/TaskList.js'))
const TodoTempListContent = AsyncComponent(() => import('./setting/todo/TodoTempList'))
const MyTodoTaskContent = AsyncComponent(() => import('./setting/todo/MyTodoTask'))
const TodoTypeListContent = AsyncComponent(() => import('./setting/todo/TodoTypeList'))

const LogList = AsyncComponent(() => import('./setting/log/Log.js'))
const LogTemplateList = AsyncComponent(() => import('./setting/log/MyLogTemplateList'))
const ProjectLogTypeList = AsyncComponent(() => import('./setting/log/ProjectLogTypeList'))

const LicenceVersion = AsyncComponent(() => import('./setting/version/Version'))


const EpicDetail = AsyncComponent(() => import("./project/lineMap/component/EpicDetail"))

//阶段
const Stage = AsyncComponent(() => import("./project/stage/component/Stage"))
const StageDetail = AsyncComponent(() => import("./project/stage/component/StageDeatil"))
const Routers = [
    {
        path: "/login",
        exact: true,
        component: Login,
    },
    {
        path: "/noAuth",
        exact: true,
        component: VailProductUserPage,
    },
    {
        path: "/logout",
        exact: true,
        component: ProjectLogOut,
    },
    {
        component: Index,
        path: "/index",
        routes: [
            {
                path: "/index/home",
                exact: false,
                component: HomePage,
                key: 'home',
                routes: [
                    {   
                        path: "/index/home/survey",
                        exact: false,
                        component: HomeSurvey,
                        key: "ProjectSet"
                        
                    },
                    {   
                        path: "/index/home/todoList",
                        exact: false,
                        component: WorkTodo,
                        key: "ProjectSet"
                        
                    },
                    {
                        path: "/index/home/insight/list",
                        exact: false,
                        component: InsightList,
                        key: "ProjectSet"
                    },
                    {
                        path: "/index/home/insight/newInsight/:id",
                        exact: false,
                        component: NewInsight,
                        key: "ProjectSet"
                    },
                    {
                        path: "/index/home/insight/viewInsight/:id",
                        exact: false,
                        component: ViewInsight,
                        key: "ProjectSet"
                    }
                ]
            },
            {
                path: "/index/project",
                exact: true,
                component: Project,
                key: 'project'

            },
            {
                path: "/index/workTodo",
                exact: true,
                component: WorkTodo,
            },
            {
                path: "/index/insight/list",
                exact: false,
                component: InsightList,
                key: 'insight'
            },
            {
                path: "/index/insight/newInsight/:id",
                exact: true,
                component: NewInsight,
            },
            {
                path: "/index/insight/viewInsight/:id",
                exact: true,
                component: ViewInsight,
            },
           
            // 临时，搜索
            // {
            //     path: "/index/log",
            //     exact: false,
            //     component: Log,
            //     key: "log",
            //     routes: [
            //         {
            //             path: "/index/log/projectLogStatistics",
            //             exact: false,
            //             component: ProjectLogStatistics,
            //             key: "ProjectSet"
            //         },
            //         {
            //             path: "/index/log/userStatistics",
            //             exact: false,
            //             component: UserStatistics,
            //             key: "ProjectSet"
            //         },
            //         {
            //             path: "/index/log/list",
            //             exact: false,
            //             component: LogContent,
            //             key: "ProjectSet"
            //         }
            //     ]
            // },
            {
                path: "/index/dynamic",
                exact: false,
                component: Dynamic,
                key: "dynamic"
            },
            {
                path: "/index/projectSet",
                exact: false,
                component: ProjectSet,
                key: "ProjectSet",
                routes: [
                    {
                        path: "/index/projectSet/projectSetList",
                        exact: false,
                        component: ProjectSetList,
                        key: "ProjectSet"
                    }
                ]
            },
           
            {
                path: "/index/projectSetdetail/:projectSetId",
                exact: false,
                component: ProjectSetDetail,
                key: "ProjectSet",
                routes: [
                    {
                        path: "/index/projectSetdetail/:projectSetId/projectSetset",
                        exact: false,
                        component: ProjectSetSet,
                        key: "ProjectSetDetailAdide",
                        routes: [
                            {
                                path: "/index/projectSetdetail/:projectSetId/projectSetset/basicinfo",
                                exact: false,
                                component: ProjectSetBasicInfo,
                                key: "ProjectSetBasicInfo"
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/projectSetset/dominRole",
                                exact: false,
                                component: ProjectSetDomainRole,
                                key: "ProjectSetDomainRole"
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/projectSetset/user",
                                exact: false,
                                component: ProjectSetUser,
                                key: "ProjectSetUser"
                            }
                        ]
                    },
                    {
                        path: "/index/projectSetdetail/:projectSetId/survey",
                        exact: false,
                        component: ProjectSetSurvey,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/index/projectSetdetail/:projectSetId/dynamic",
                        exact: false,
                        component: Dynamic,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/index/projectSetdetail/:projectSetId/workTodo",
                        exact: false,
                        component: WorkTodo,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/index/projectSetdetail/:projectSetId/projectSetProjectList",
                        exact: false,
                        component: ProjectSetProjectList,
                        key: "ProjectSetProjectList"
                    },
                    {
                        path: "/index/projectSetdetail/:projectSetId/dominRole",
                        exact: false,
                        component: ProjectSetDomainRole,
                        key: "ProjectSetDomainRole"
                    },
                    {
                        path: "/index/projectSetdetail/:projectSetId/user",
                        exact: false,
                        component: ProjectSetUser,
                        key: "ProjectSetUser"
                    },
                    {
                        path: "/index/projectSetdetail/:projectSetId/statistics",
                        component: ProjectWorkStatistics,
                        routes: [
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/workBulidEnd",
                                component: StatisticsBulidAndEndWork,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/workNewTrend",
                                component: StaticsNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/workEndtrend",
                                component: StaticsEndTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/workNewTotalTrend",
                                component: StaticsTotalNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/workEndTotalTrend",
                                component: StaticsTotalEndTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/logUserProject",
                                component: StatisticsUserProjectLog,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/logProjectUser",
                                component: StatisticsProjectUserLog,
                                exact: true
                            },
                            {
                                path: "/index/projectSetdetail/:projectSetId/statistics/logProjectWork",
                                component: StatisticsProjectWorkLog,
                                exact: true
                            }
                        ]
                    },
                ]
            },
            {
                path: "/index/searchResult",
                exact: false,
                component: SearchResult,
                key: "SearchResult"
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
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/work/worklist/:statetype",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/work/WorkDetail",
                        component: WorkTableDetail,
                        exact: true
                    },
                    {
                        path: "/index/work/worklist/:statetype/:workitemid",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/work/workone/:id",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/work/workadd",
                        component: WorkAddPage,
                        exact: true
                    },
                    {
                        path: "/index/work/*",
                        component: () => <Redirect to="/index/work/worklist" />,
                        exact: true
                    }
                ]
            },
            {
                path: "/index/setting",
                component: Setting,
                key: 'Setting',
                routes: [
                    {
                        path: "/index/setting/organ",
                        component: OrgaContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/user",
                        component: OrgaUser,
                        exact: true
                    },
                    {
                        path: "/index/setting/directory",
                        component: ProjectDirectory,
                        exact: true
                    },
                    {
                        path: "/index/setting/usergroup",
                        component: ProjectUserGroup,
                        exact: true
                    },
                    {
                        path: "/index/setting/usersystemgroup",
                        component: ProjectSystemUserGroup,
                        exact: true
                    },
                    {
                        path: "/index/setting/workstatus",
                        component: ProjectFlowStatusList,
                        exact: true
                    },
                    {
                        path: "/index/setting/nodestatus",
                        component: ProjectNodeStatusList,
                        exact: true
                    },
                    {
                        path: "/index/setting/flowDetail/:id",
                        component: FlowDetail,
                        exact: true
                    },
                    {
                        path: "/index/setting/worktype",
                        component: WorkTypeList,
                        exact: true
                    },
                    {
                        path: "/index/setting/worktypeSystem",
                        component: WorkTypeSystem,
                        exact: true
                    },
                    {
                        path: "/index/setting/workpriority",
                        component: workPriority,
                        exact: true
                    },
                    {
                        path: "/index/setting/workTypeFlow/:id",
                        component: WorkTypeFlow,
                        exact: true
                    },
                    {
                        path: "/index/setting/workTypeForm/:id",
                        component: WorkTypeForm,
                        exact: true
                    },
                    {
                        path: "/index/setting/projectType",
                        component: ProjectType,
                        exact: true
                    },
                    // 系统功能管理
                    {
                        path: "/index/setting/systemFeature",
                        component: SystemFeature,
                        exact: true
                    },
                    // 系统内置角色管理
                    {
                        path: "/index/setting/systemRoleBuilt",
                        component: SystemRoleBuilt,
                        exact: true
                    },
                    // 系统角色管理
                    {
                        path: "/index/setting/systemRole",
                        component: SystemRole,
                        exact: true
                    },
                    // 项目功能管理
                    {
                        path: "/index/setting/projectFeature",
                        component: ProjectFeature,
                        exact: true
                    },
                    // 项目角色管理
                    {
                        path: "/index/setting/projectRole",
                        component: ProjectRole,
                        exact: true
                    },
                    {
                        path: "/index/setting/preliminaryType",
                        component: ProjectProjectDirectory,
                        exact: true
                    },
                    {
                        path: "/index/setting/preliminaryTypeView",
                        component: ProjectProjectDirectoryView,
                        exact: true
                    },
                    {
                        path: "/index/setting/preliminarySystem",
                        component: ProjectPreliminaryListSystem,
                        exact: true
                    },
                    {
                        path: "/index/setting/preliminary",
                        component: ProjectPreliminaryList,
                        exact: true
                    },
                    {
                        path: "/index/setting/form",
                        component: FormList,
                        exact: true
                    },
                    {
                        path: "/index/setting/formsystem",
                        component: FormListSystem,
                        exact: true
                    },
                    {
                        path: "/index/setting/projectForm",
                        component: ProjectProjectFormList,
                        exact: true
                    },
                    {
                        path: "/index/setting/projectFormDetail/:id",
                        component: FormDetail,
                        exact: true
                    },
                    {
                        path: "/index/setting/systemFlow",
                        component: ProjectSystemFlowList,
                        exact: true
                    },
                    {
                        path: "/index/setting/systemFlowsystem",
                        component: ProjectSystemFlowListSystem,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageManagement",
                        component: ProjectMessageManagement,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageNotice",
                        component: ProjectMessageNotice,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageNoticeSystem",
                        component: ProjectMessageNoticeSystem,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageTemplate",
                        component: ProjectMessageTemplate,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageType",
                        component: ProjectMessageType,
                        exact: true
                    },
                    {
                        path: "/index/setting/messageSendType",
                        component: ProjectMessageSendType,
                        exact: true
                    },

                    {
                        path: "/index/setting/taskList",
                        component: TaskListContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/myTodoTask",
                        component: MyTodoTaskContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/todoTypeTask",
                        component: TodoTypeListContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/todoTempList",
                        component: TodoTempListContent,
                        exact: true
                    },
                    {
                        path: "/index/setting/logList",
                        component: LogList,
                        exact: true
                    },
                    {
                        path: "/index/setting/myLogTemplateList",
                        component: LogTemplateList,
                        exact: true
                    },
                    {
                        path: "/index/setting/projectLogTypeList",
                        component: ProjectLogTypeList,
                        exact: true
                    },
                    {
                        path: "/index/setting/version",
                        component: LicenceVersion,
                        exact: true
                    },
                    {
                        path: "/index/setting/loadData",
                        component: LoadData,
                        exact: true
                    },
                    {
                        path: "/index/setting/plugin",
                        component: ProjectPlugin,
                        exact: true
                    }
                ]
            },
            {
                path: "/index/projectNomalDetail/:id",
                component: ProjectNomalDetail,
                routes: [
                    {
                        path: "/index/projectNomalDetail/:id/survey",
                        component: Survey,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/stage",
                        component: Stage
                    },
                    {
                        path: "/index/projectNomalDetail/:id/stageDetail/:stageId",
                        component: StageDetail
                    },
                    {
                        path: "/index/projectNomalDetail/:id/sprint",
                        component: Sprint
                    },
                    {
                        path: "/index/projectNomalDetail/:id/linemap",
                        component: Linemap,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/version",
                        component: Version,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/versionPlan",
                        component: VersionPlan,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/versionDetail/:versionId",
                        component: VersionDetail,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/epic/:epicId",
                        component: EpicDetail,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/work",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectNomalDetail/:id/WorkDetail",
                        component: WorkTableDetail,
                        exact: true
                    },
                    
                    {
                        path: "/index/projectNomalDetail/:id/work/:statetype",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectNomalDetail/:id/work/:statetype/:workitemid",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectNomalDetail/:id/workone/:id",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectNomalDetail/:id/scrum/:type",
                        component: Work
                    },
                    {
                        path: "/index/projectNomalDetail/:id/addDemand",
                        component: WorkAddPage,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/milestone",
                        component: Milestone,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/plan",
                        component: Plan,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/planWorkItem/:id",
                        component: PlanWorkItem,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/workTodo",
                        component: WorkTodo,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/log",
                        component: ProjectLog,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/dynamic",
                        component: Dynamic,
                    },
                    {
                        path: "/index/projectNomalDetail/:id/statistics",
                        component: ProjectStatistics,
                        routes: [
                            {
                                path: "/index/projectNomalDetail/:id/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/statistics/workBulidEnd",
                                component: StatisticsBulidAndEndWork,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/statistics/workNewTrend",
                                component: StaticsNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/statistics/workEndtrend",
                                component: StaticsEndTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/statistics/workNewTotalTrend",
                                component: StaticsTotalNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/statistics/workEndTotalTrend",
                                component: StaticsTotalEndTrend,
                                exact: true
                            },
                            
                            {
                                path: "/index/projectNomalDetail/:id/statistics/logUserProject",
                                component: StatisticsUserProjectLog,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/statistics/logProjectUser",
                                component: StatisticsProjectUserLog,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/statistics/logProjectWork",
                                component: StatisticsProjectWorkLog,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/index/projectNomalDetail/:id/projectSetDetail",
                        exact: false,
                        component: ProdeNomalSetAside,
                        key: "ProjectSetDetail",
                        routes: [
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/basicInfo",
                                component: BasicInfo,
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/module",
                                component: Module,
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/user",
                                component: PrivilegeDomainUser,
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/projectDomainRole",
                                component: ProjectDomainRole,
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/projectworkType",
                                component: ProjectWorkType,
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/projectFlow",
                                component: ProjectFlowList,
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/projectForm",
                                component: ProjectFormList,
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/projectFormDetail/:id",
                                component: FormDetail,
                                exact: true
                            },
                            {
                                path: "/index/projectNomalDetail/:id/projectSetDetail/projectFlowDetail/:id",
                                component: FlowDetail,
                                exact: true
                            }
                        ]
                    }
                ]
            },
            {
                path: "/index/projectScrumDetail/:id",
                component: ProjectScrumDetail,
                routes: [
                    {
                        path: "/index/projectScrumDetail/:id/survey",
                        component: Survey,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/sprint",
                        component: Sprint

                    },
                    {
                        path: "/index/projectScrumDetail/:id/linemap",
                        component: Linemap,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/sprintPlan",
                        component: PlanSprint,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/version",
                        component: Version,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/versionPlan",
                        component: VersionPlan,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/versionDetail/:versionId",
                        component: VersionDetail,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/epic/:epicId",
                        component: EpicDetail,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/work",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectScrumDetail/:id/WorkDetail",
                        component: WorkTableDetail,
                        exact: true
                    },
                    {
                        path: "/index/projectScrumDetail/:id/work/:statetype",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectScrumDetail/:id/work/:statetype/:workitemid",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectScrumDetail/:id/workone/:id",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectScrumDetail/:id/scrum/:type",
                        component: Work
                    },
                    {
                        path: "/index/projectScrumDetail/:id/addDemand",
                        component: WorkAddPage,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/milestone",
                        component: Milestone,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/plan",
                        component: Plan,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/workTodo",
                        component: WorkTodo,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/dynamic",
                        component: Dynamic,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/planWorkItem/:id",
                        component: PlanWorkItem,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/log",
                        component: ProjectLog,
                    },
                    {
                        path: "/index/projectScrumDetail/:id/statistics",
                        component: ProjectStatistics,
                        routes: [
                            {
                                path: "/index/projectScrumDetail/:id/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/workBulidEnd",
                                component: StatisticsBulidAndEndWork,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/workNewTrend",
                                component: StaticsNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/workEndtrend",
                                component: StaticsEndTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/workNewTotalTrend",
                                component: StaticsTotalNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/workEndTotalTrend",
                                component: StaticsTotalEndTrend,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/logUserProject",
                                component: StatisticsUserProjectLog,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/logProjectUser",
                                component: StatisticsProjectUserLog,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/statistics/logProjectWork",
                                component: StatisticsProjectWorkLog,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/index/projectScrumDetail/:id/projectSetDetail",
                        exact: false,
                        component: ProjectScrumSetDetail,
                        key: "ProjectSetDetail",
                        routes: [
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/basicInfo",
                                component: BasicInfo,
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/module",
                                component: Module,
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/user",
                                component: PrivilegeDomainUser,
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/projectDomainRole",
                                component: ProjectDomainRole,
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/projectworkType",
                                component: ProjectWorkType,
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/projectFlow",
                                component: ProjectFlowList,
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/projectForm",
                                component: ProjectFormList,
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/projectFormDetail/:id",
                                component: FormDetail,
                                exact: true
                            },
                            {
                                path: "/index/projectScrumDetail/:id/projectSetDetail/projectFlowDetail/:id",
                                component: FlowDetail,
                                exact: true
                            }
                        ]
                    },
                ]
            },
            {
                path: "/index/:id/sprintdetail/:sprint",
                component: SprintHome,
                routes: [
                    {
                        path: "/index/:id/sprintdetail/:sprint/statistics",
                        component: SprintStatistics,
                        routes: [
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/workBulidEnd",
                                component: StatisticsBulidAndEndWork,
                                exact: true
                            },
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/workNewTrend",
                                component: StaticsNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/workEndtrend",
                                component: StaticsEndTrend,
                                exact: true
                            },
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/workNewTotalTrend",
                                component: StaticsTotalNewTrend,
                                exact: true
                            },
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/workEndTotalTrend",
                                component: StaticsTotalEndTrend,
                                exact: true
                            },
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/logUserProject",
                                component: StatisticsUserProjectLog,
                                exact: true
                            },
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/logProjectUser",
                                component: StatisticsProjectUserLog,
                                exact: true
                            },
                           
                            {
                                path: "/index/:id/sprintdetail/:sprint/statistics/logProjectWork",
                                component: StatisticsProjectWorkLog,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workItem",
                        component: Work,
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workDetail",
                        component: WorkTableDetail,
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/survey",
                        component: Sprintsurvey,
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/plan",
                        component: SprintPlan,
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/dynamic",
                        exact: false,
                        component: Dynamic,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workTodo",
                        exact: false,
                        component: WorkTodo,
                        key: "ProjectSetSurvey"
                    },
                ]
            },
        ]
    },
    {
        path: "/",
        component: () => <Redirect to="/index/home/survey" />,
        exact: true
    },
]
export default Routers;