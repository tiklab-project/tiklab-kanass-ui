import React from "react";
import AsyncComponent from './common/lazy/AsyncComponent'
import { Redirect } from "react-router-dom";

const Login = AsyncComponent(() => import('./login/Login'))
const VailProductUserPage = AsyncComponent(() => import('./login/VaildProductUserPage'))
const ProjectLogOut = AsyncComponent(() => import('./login/Logout'))
const ProjectNotFound = AsyncComponent(() => import("./setting/common/components/ProjectNotFond"))
//组织中心
const ProjectProjectDirectorySys = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeListSys'))
const ProjectProjectDirectory = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeList'))
const ProjectPreliminaryListSystem = AsyncComponent(() => import('./setting/form/ProjectPreliminaryListSystem'))
const ProjectPreliminaryList = AsyncComponent(() => import('./setting/form/ProjectPreliminaryList'))
const FormList = AsyncComponent(() => import('./setting/form/ProjectFormList'))
const FormListSystem = AsyncComponent(() => import('./setting/form/ProjectFormListSystem'))
const ProjectProjectFormList = AsyncComponent(() => import('./setting/form/ProjectProjectFormList'))
const FormDetail = AsyncComponent(() => import('./setting/form/ProjectFormDetail'))

// const ProjectFlowList = AsyncComponent(() => import('./setting/flow/projectProjectFlowList'))
const ProjectSystemFlowList = AsyncComponent(() => import('./setting/flow/components/ProjectSystemFlowList'))
const ProjectSystemFlowListSystem = AsyncComponent(() => import('./setting/flow/components/ProjectSystemFlowListSystem'))

const ProjectFlowStatusList = AsyncComponent(() => import('./setting/flow/components/ProjectFlowStatusList'))
const FlowDetailView = AsyncComponent(() => import('./setting/flow/components/FlowDetailView'))
const FlowDetailDesign = AsyncComponent(() => import('./setting/flow/components/FlowDetailDesign'))
const ProjectNodeStatusList = AsyncComponent(() => import('./setting/flow/components/ProjectNodeStatusList'))
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
const ProjectPlugin = AsyncComponent(() => import('./setting/plugins/ProjectPlugin'))

const SystemFeature = AsyncComponent(() => import('./setting/privilege/SystemFeature'))
const SystemRoleBuilt = AsyncComponent(() => import('./setting/privilege/SystemRoleBuilt'))
const SystemRole = AsyncComponent(() => import('./setting/privilege/SystemRole'))
const ProjectFeature = AsyncComponent(() => import('./setting/privilege/ProjectFeature'))
const ProjectRole = AsyncComponent(() => import('./setting/privilege/ProjectRole'))

//组织用户
const OrgaContent = AsyncComponent(() => import('./setting/orga/Orga'))
const OrgaUser = AsyncComponent(() => import('./setting/orga/User'))
const ProjectDirectory = AsyncComponent(() => import("./setting/user/ProjectDirectory"))
const ProjectUserGroup = AsyncComponent(() => import("./setting/user/ProjectUserGroup"))
const ProjectSystemUserGroup = AsyncComponent(() => import("./setting/user/ProjectSystemUserGroup"))

const Index = AsyncComponent(() => import('./home/common/components/HomeLayout'))
// const Index = AsyncComponent(() => import('./home/localHeader'))
const HomePage = AsyncComponent(() => import('./home/common/components/HomePage'))
const HomeSurvey = AsyncComponent(() => import('./home/common/components/HomeSurvey'))
const WorkAll = AsyncComponent(() => import('./work/components/Work'))
const Dynamic = AsyncComponent(() => import("./home/common/components/DynamicList"))
const WorkTodo = AsyncComponent(() => import("./home/common/components/TodoList"))
// 项目
const Project = AsyncComponent(() => import('./project/project/components/Project'))
const ProjectAdd = AsyncComponent(() => import('./project/project/components/ProjectAdd'))
const ProjectDetail = AsyncComponent(() => import('./project/common/components/ProjectScrumLayout'))
const ProjectScrumSetDetail = AsyncComponent(() => import('./project/setting/common/components/ProjectScrumSet'))
const ProjectWorkType = AsyncComponent(() => import('./project/setting/projectWorkType/components/WorkType'))
const ProjectFlowList = AsyncComponent(() => import('./project/setting/projectFlow/components/ProjectFlow'))
const ProjectFlowDetailDesign = AsyncComponent(() => import("./project/setting/projectFlow/components/ProjectFlowDetailDesign"))

const ProjectFormList = AsyncComponent(() => import('./project/setting/projectForm/ProjectForm'))
const ProjectFormDetail = AsyncComponent(() => import('./project/setting/projectForm/ProjectFormDetail'))

const Survey = AsyncComponent(() => import('./project/overview/components/Survey'))
const Sprint = AsyncComponent(() => import('./project/sprint/components/SprintList'))
const WikiRepository = AsyncComponent(() => import('./project/wiki/components/WikiRepository'))
const TestRepository = AsyncComponent(() => import('./project/test/components/TestRepository'))
const PlanSprint = AsyncComponent(() => import('./project/sprint/components/SprintPlan'))
const ProjectLog = AsyncComponent(() => import("./project/workLog/components/LogContent"))
const Work = AsyncComponent(() => import('./work/components/Work'))
const WorkList = AsyncComponent(() => import('./work/components/WorkList'))
const WorkTable = AsyncComponent(() => import('./work/components/WorkTable'))
const WorkBodar = AsyncComponent(() => import('./work/components/WorkBodar'))
const WorkTableDetail = AsyncComponent(() => import('./work/components/WorkTableDetail'))
const WorkDetailPage = AsyncComponent(() => import('./work/components/WorkDetailPage'))
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
const StatisticsWork = AsyncComponent(() => import('./statistics/components/StatisticsStatusWork'))
const StatisticsMore = AsyncComponent(() => import('./statistics/components/StatisticsMore'))


const WorkAddPage = AsyncComponent(() => import('./work/components/WorkAddPage'))
// 迭代
const SprintHome = AsyncComponent(() => import('./sprint/common/components/SprintLayout'))
const Sprintsurvey = AsyncComponent(() => import("./sprint/overview/components/SprintSurvey"))
const SprintPlan = AsyncComponent(() => import("./sprint/plan/components/SprintPlan"))
//迭代统计
const SprintStatistics = AsyncComponent(() => import('./sprint/statistics/components/SprintStatistics'))
// 搜索页面
const SearchResult = AsyncComponent(() => import('./home/search/components/SearchResult'))

// 项目集
const ProjectSet = AsyncComponent(() => import('./projectSet/projectSet/components/ProjectSet'))
const ProjectSetAdd = AsyncComponent(() => import("./projectSet/projectSet/components/ProjectSetAdd"))
const ProjectSetDetail = AsyncComponent(() => import('./projectSet/common/components/ProjectSetLayout'))
const ProjectSetProjectList = AsyncComponent(() => import('./projectSet/projectList/components/ProjectSetProjectList'))
const ProjectSetSurvey = AsyncComponent(() => import('./projectSet/overview/components/ProjectSetSurvey'))
const ProjectSetDomainRole = AsyncComponent(() => import('./projectSet/user/ProjectSetDomainRole'));
const ProjectSetUser = AsyncComponent(() => import('./projectSet/user/ProjectSetUser'));
const ProjectSetSet = AsyncComponent(() => import("./projectSet/setting/common/components/ProjectSetSetting"))
const ProjectSetBasicInfo = AsyncComponent(() => import("./projectSet/setting/basicInfo/components/ProjectSetBasicInfo"))
const ProjectWorkStatistics = AsyncComponent(() => import("./projectSet/statistics/components/ProjectSetStatistics"))

// 导入外部数据
const LoadData = AsyncComponent(() => import('./setting/systemIntegration/components/JiraLoadData'))
const UrlData = AsyncComponent(() => import('./setting/systemIntegration/components/UrlData'))
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


const EpicDetail = AsyncComponent(() => import("./project/lineMap/component/EpicDetail"))

//阶段
const Stage = AsyncComponent(() => import("./project/stage/component/Stage"))
const StageDetail = AsyncComponent(() => import("./project/stage/component/StageDeatil"))

const LicenceVersion = AsyncComponent(() => import('./setting/version/Version'));
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
                path: "/index/404",
                exact: true,
                component: ProjectNotFound,
                key: 'NotFound'
            },
            {
                path: "/index/projectAdd",
                exact: true,
                component: ProjectAdd,
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

            {
                path: "/index/dynamic",
                exact: false,
                component: Dynamic,
                key: "dynamic"
            },
            {
                path: "/index/projectSetList",
                exact: false,
                component: ProjectSet,
                key: "ProjectSet",
                // routes: [
                //     {
                //         path: "/index/projectSet/projectSetList",
                //         exact: false,
                //         component: ProjectSetList,
                //         key: "ProjectSet"
                //     },

                // ]
            },
            {
                path: "/index/projectSetAdd",
                exact: false,
                component: ProjectSetAdd,
                key: "ProjectSet"
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
                                path: "/index/projectSetdetail/:projectSetId/projectSetset/basicInfo",
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
                                path: "/index/projectSetdetail/:projectSetId/statistics/moreMenu",
                                component: StatisticsMore,
                                exact: true
                            }
                            // {
                            //     path: "/index/projectSetdetail/:projectSetId/statistics/logProjectUser",
                            //     component: LogProjectUser,
                            //     exact: true
                            // },
                            // {
                            //     path: "/index/projectSetdetail/:projectSetId/statistics/logProjectWork",
                            //     component: LogProjectWork,
                            //     exact: true
                            // },
                            // {
                            //     path: "/index/projectSetdetail/:projectSetId/statistics/logUserProject",
                            //     component: LogUserProject,
                            //     exact: true
                            // }
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
                path: "/index/workTable",
                component: WorkTable,
                
            },
            {
                path: "/index/workTable/:workId",
                component: WorkTable,
                exact: true
            },
            {
                path: "/index/workBodar",
                component: WorkBodar,
            },
            {
                path: "/index/workBodar/:workId",
                component: WorkBodar,
                exact: true
            },

            {
                path: "/index/workList",
                component: WorkList,
                routes: [
                    {
                        path: "/index/workList/:workId",
                        component: WorkDetailPage
                    }
                ]
            },

            // {
            //     path: "/index/work",
            //     component: WorkAll,
            //     key: 'WorkAll',
            //     routes: [
            //         {
            //             path: "/index/work/workTable",
            //             component: WorkTable,
                        
            //         },
            //         {
            //             path: "/index/work/workTable/:workId",
            //             component: WorkTable,
            //             exact: true
            //         },
            //         {
            //             path: "/index/work/workBodar",
            //             component: WorkBodar,
            //         },
            //         {
            //             path: "/index/work/workBodar/:workId",
            //             component: WorkBodar,
            //             exact: true
            //         },

            //         {
            //             path: "/index/work/workList",
            //             component: WorkList,
            //             routes: [
            //                 {
            //                     path: "/index/work/workList/:workId",
            //                     component: WorkDetailPage
            //                 }
            //             ]
            //         },
            //         {
            //             path: "/index/work/*",
            //             component: () => <Redirect to="/index/work/worklist" />,
            //             exact: true
            //         }
            //     ]
            // },
            {
                path: "/index/workDetail/:workId",
                component: WorkDetailPage,
                exact: true
            },
            {
                path: "/index/workone/:id",
                component: WorkDetailPage,
                exact: true
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
                        path: "/index/setting/preliminaryTypeSys",
                        component: ProjectProjectDirectorySys,
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
                        path: "/index/setting/FormDetail/:formId",
                        component: FormDetail,
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
                        path: "/index/setting/flowDetailView/:flowId",
                        component: FlowDetailView,
                        exact: true
                    },
                    {
                        path: "/index/setting/flowDetailDesign/:flowId",
                        component: FlowDetailDesign,
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
                        path: "/index/setting/loadData",
                        component: LoadData,
                        exact: true
                    },
                    {
                        path: "/index/setting/urlData",
                        component: UrlData,
                        exact: true
                    },
                    {
                        path: "/index/setting/plugin",
                        component: ProjectPlugin,
                        exact: true
                    },
                    {
                        path: "/index/setting/version",
                        component: LicenceVersion,
                        exact: true
                    }
                ]
            },
            {
                path: "/index/projectDetail/:id",
                component: ProjectDetail,
                routes: [
                    {
                        path: "/index/projectDetail/:id/survey",
                        component: Survey,
                    },
                    {
                        path: "/index/projectDetail/:id/stage",
                        component: Stage,

                    },
                    {
                        path: "/index/projectDetail/:id/stageDetail/:stageId",
                        component: StageDetail,

                    },
                    {
                        path: "/index/projectDetail/:id/sprint",
                        component: Sprint

                    },
                    {
                        path: "/index/projectDetail/:id/wiki",
                        component: WikiRepository
                    },
                    {
                        path: "/index/projectDetail/:id/test",
                        component: TestRepository
                    },
                    {
                        path: "/index/projectDetail/:id/linemap",
                        component: Linemap,
                    },
                    {
                        path: "/index/projectDetail/:id/sprintPlan",
                        component: PlanSprint,
                    },
                    {
                        path: "/index/projectDetail/:id/version",
                        component: Version,
                    },
                    {
                        path: "/index/projectDetail/:id/versionPlan",
                        component: VersionPlan,
                    },
                    {
                        path: "/index/projectDetail/:id/versionDetail/:versionId",
                        component: VersionDetail,
                    },
                    {
                        path: "/index/projectDetail/:id/epic/:epicId",
                        component: EpicDetail,
                    },
                    {
                        path: "/index/projectDetail/:id/workTable",
                        component: WorkTable,
                        
                    },
                    {
                        path: "/index/projectDetail/:id/workTable/:workId",
                        component: WorkTable,
                        exact: true
                    },
                    {
                        path: "/index/projectDetail/:id/workBodar",
                        component: WorkBodar,
                    },
                    {
                        path: "/index/projectDetail/:id/workBodar/:workId",
                        component: WorkBodar,
                        exact: true
                    },

                    {
                        path: "/index/projectDetail/:id/workList",
                        component: WorkList,
                        routes: [
                            {
                                path: "/index/projectDetail/:id/workList/:workId",
                                component: WorkDetailPage
                            }
                        ]
                    },
                    {
                        path: "/index/projectDetail/:id/WorkDetail",
                        component: WorkTableDetail,
                        exact: true
                    },
                    {
                        path: "/index/projectDetail/:id/work/:statetype",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectDetail/:id/work/:statetype/:workitemid",
                        component: Work,
                        exact: true
                    },
                    {
                        path: "/index/projectDetail/:id/workone/:workId",
                        component: WorkDetailPage,
                        exact: true
                    },
                    {
                        path: "/index/projectDetail/:id/workDetail/:workId",
                        component: WorkDetailPage,
                        exact: true
                    },
                    {
                        path: "/index/projectDetail/:id/scrum/:type",
                        component: Work
                    },
                    {
                        path: "/index/projectDetail/:id/addDemand",
                        component: WorkAddPage,
                    },
                    {
                        path: "/index/projectDetail/:id/milestone",
                        component: Milestone,
                    },
                    {
                        path: "/index/projectDetail/:id/plan",
                        component: Plan,
                    },
                    {
                        path: "/index/projectDetail/:id/workTodo",
                        component: WorkTodo,
                    },
                    {
                        path: "/index/projectDetail/:id/dynamic",
                        component: Dynamic,
                    },
                    {
                        path: "/index/projectDetail/:id/planWorkItem/:id",
                        component: PlanWorkItem,
                    },
                    {
                        path: "/index/projectDetail/:id/log",
                        component: ProjectLog,
                    },
                    {
                        path: "/index/projectDetail/:id/statistics",
                        component: ProjectStatistics,
                        routes: [
                            {
                                path: "/index/projectDetail/:id/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/index/projectDetail/:id/statistics/moreMenu",
                                component: StatisticsMore,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/index/projectDetail/:id/projectSetDetail",
                        exact: false,
                        component: ProjectScrumSetDetail,
                        key: "ProjectSetDetail",
                        routes: [
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/basicInfo",
                                component: BasicInfo,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/module",
                                component: Module,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/user",
                                component: PrivilegeDomainUser,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/projectDomainRole",
                                component: ProjectDomainRole,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/projectworkType",
                                component: ProjectWorkType,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/projectFlow",
                                component: ProjectFlowList,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/projectForm",
                                component: ProjectFormList,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/ProjectFormDetail/:formId",
                                component: ProjectFormDetail,
                            },
                            {
                                path: "/index/projectDetail/:id/projectSetDetail/projectFlowDetail/:flowId",
                                component: ProjectFlowDetailDesign,
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
                                path: "/index/:id/sprintdetail/:sprint/statistics/moreMenu",
                                component: StatisticsMore,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workItem",
                        component: Work,
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workDetail/:workId",
                        component: WorkDetailPage,
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

                    {
                        path: "/index/:id/sprintdetail/:sprint/workTable",
                        component: WorkTable,
                        
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workTable/:workId",
                        component: WorkTable,
                        exact: true
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workBodar",
                        component: WorkBodar,
                    },
                    {
                        path: "/index/:id/sprintdetail/:sprint/workBodar/:workId",
                        component: WorkBodar,
                        exact: true
                    },

                    {
                        path: "/index/:id/sprintdetail/:sprint/workList",
                        component: WorkList,
                        routes: [
                            {
                                path: "/index/:id/sprintdetail/:sprint/:workId",
                                component: WorkDetailPage
                            }
                        ]
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