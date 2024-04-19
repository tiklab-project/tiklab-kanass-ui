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

const HomePage = AsyncComponent(() => import('./home/common/components/HomePage'))
const HomeSurvey = AsyncComponent(() => import('./home/common/components/HomeSurvey'))
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
const SprintStatistics = AsyncComponent(() => import('./sprint/statistics/components/SprintStatistics'))

// 迭代
const VersionHome = AsyncComponent(() => import('./version/common/components/VersionLayout'))
const Versionsurvey = AsyncComponent(() => import("./version/overview/components/VersionSurvey"))
const VersionWorkItemPlan = AsyncComponent(() => import("./version/plan/components/VersionPlan"))
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
const Insight = AsyncComponent(() => import('./home/insight/components/Insight'))
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

//计划
const Stage = AsyncComponent(() => import("./project/stage/component/Stage"))
const StageDetail = AsyncComponent(() => import("./project/stage/component/StageDeatil"))

const LicenceVersion = AsyncComponent(() => import('./setting/version/Version'));

const RoutersSaas = [
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
        path: "",
        routes: [
            {
                path: "/home",
                exact: false,
                component: HomePage,
                key: 'home',
                routes: [
                    {
                        path: "/home/survey",
                        exact: false,
                        component: HomeSurvey,
                        key: "ProjectSet"

                    },
                    
                 
                ]
            },
            {
                path: "/todoList",
                exact: false,
                component: WorkTodo,
                key: "ProjectSet"

            },
            {
                path: "/insight",
                exact: false,
                component: Insight,
                key: "ProjectSet",
                routes: [
                    {
                        path: "/insight/list",
                        exact: false,
                        component: InsightList,
                        key: "ProjectSet"
                    },
                    {
                        path: "/insight/newInsight/:id",
                        exact: false,
                        component: NewInsight,
                        key: "ProjectSet"
                    },
                    {
                        path: "/insight/viewInsight/:id",
                        exact: false,
                        component: ViewInsight,
                        key: "ProjectSet"
                    }
                ]
            },
            
            {
                path: "/project",
                exact: true,
                component: Project,
                key: 'project'

            },
            {
                path: "/404",
                exact: true,
                component: ProjectNotFound,
                key: 'NotFound'
            },
            {
                path: "/projectAdd",
                exact: true,
                component: ProjectAdd,
                key: 'project'

            },
            {
                path: "/workTodo",
                exact: true,
                component: WorkTodo,
            },
            {
                path: "/insight/list",
                exact: false,
                component: InsightList,
                key: 'insight'
            },
            {
                path: "/insight/newInsight/:id",
                exact: true,
                component: NewInsight,
            },
            {
                path: "/insight/viewInsight/:id",
                exact: true,
                component: ViewInsight,
            },

            {
                path: "/dynamic",
                exact: false,
                component: Dynamic,
                key: "dynamic"
            },
            {
                path: "/projectSetList",
                exact: false,
                component: ProjectSet,
                key: "ProjectSet",
                // routes: [
                //     {
                //         path: "/projectSet/projectSetList",
                //         exact: false,
                //         component: ProjectSetList,
                //         key: "ProjectSet"
                //     },

                // ]
            },
            {
                path: "/projectSetAdd",
                exact: false,
                component: ProjectSetAdd,
                key: "ProjectSet"
            },

            {
                path: "/projectSetdetail/:projectSetId",
                exact: false,
                component: ProjectSetDetail,
                key: "ProjectSet",
                routes: [
                    {
                        path: "/projectSetdetail/:projectSetId/projectSetset",
                        exact: false,
                        component: ProjectSetSet,
                        key: "ProjectSetDetailAdide",
                        routes: [
                            {
                                path: "/projectSetdetail/:projectSetId/projectSetset/basicInfo",
                                exact: false,
                                component: ProjectSetBasicInfo,
                                key: "ProjectSetBasicInfo"
                            },
                            {
                                path: "/projectSetdetail/:projectSetId/projectSetset/dominRole",
                                exact: false,
                                component: ProjectSetDomainRole,
                                key: "ProjectSetDomainRole"
                            },
                            {
                                path: "/projectSetdetail/:projectSetId/projectSetset/user",
                                exact: false,
                                component: ProjectSetUser,
                                key: "ProjectSetUser"
                            }
                        ]
                    },
                    {
                        path: "/projectSetdetail/:projectSetId/survey",
                        exact: false,
                        component: ProjectSetSurvey,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/projectSetdetail/:projectSetId/dynamic",
                        exact: false,
                        component: Dynamic,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/projectSetdetail/:projectSetId/workTodo",
                        exact: false,
                        component: WorkTodo,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/projectSetdetail/:projectSetId/projectSetProjectList",
                        exact: false,
                        component: ProjectSetProjectList,
                        key: "ProjectSetProjectList"
                    },
                    {
                        path: "/projectSetdetail/:projectSetId/dominRole",
                        exact: false,
                        component: ProjectSetDomainRole,
                        key: "ProjectSetDomainRole"
                    },
                    {
                        path: "/projectSetdetail/:projectSetId/user",
                        exact: false,
                        component: ProjectSetUser,
                        key: "ProjectSetUser"
                    },
                    {
                        path: "/projectSetdetail/:projectSetId/statistics",
                        component: ProjectWorkStatistics,
                        routes: [
                            {
                                path: "/projectSetdetail/:projectSetId/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/projectSetdetail/:projectSetId/statistics/moreMenu",
                                component: StatisticsMore,
                                exact: true
                            }
                        ]
                    },
                ]
            },
            {
                path: "/searchResult",
                exact: false,
                component: SearchResult,
                key: "SearchResult"
            },
            {
                path: "/sprint/:id",
                exact: false,
                component: Sprint,
                key: "Sprint"
            },

           
            {
                path: "/work",
                component: Work,
                routes: [
                    {
                        path: "/workTable",
                        component: WorkTable,
                        
                    },
                    {
                        path: "/workTable/:workId",
                        component: WorkTable,
                        exact: true
                    },
                    {
                        path: "/workBodar",
                        component: WorkBodar,
                    },
                    {
                        path: "/workBodar/:workId",
                        component: WorkBodar,
                        exact: true
                    },
                    {
                        path: "/workList",
                        component: WorkList,
                        routes: [
                            {
                                path: "/workList/:workId",
                                component: WorkDetailPage
                            }
                        ]
                    },
                ]
            },
           
            {
                path: "/workDetail/:workId",
                component: WorkDetailPage,
                exact: true
            },
            {
                path: "/workone/:id",
                component: WorkDetailPage,
                exact: true
            },
            {
                path: "/setting",
                component: Setting,
                key: 'Setting',
                routes: [
                    {
                        path: "/setting/orga",
                        component: OrgaContent,
                        exact: true
                    },
                    {
                        path: "/setting/user",
                        component: OrgaUser,
                        exact: true
                    },
                    {
                        path: "/setting/dir",
                        component: ProjectDirectory,
                        exact: true
                    },
                    {
                        path: "/setting/userGroup",
                        component: ProjectUserGroup,
                        exact: true
                    },
                    {
                        path: "/setting/usersystemgroup",
                        component: ProjectSystemUserGroup,
                        exact: true
                    },
                    {
                        path: "/setting/workstatus",
                        component: ProjectFlowStatusList,
                        exact: true
                    },
                    {
                        path: "/setting/nodestatus",
                        component: ProjectNodeStatusList,
                        exact: true
                    },
                    {
                        path: "/setting/worktype",
                        component: WorkTypeList,
                        exact: true
                    },
                    {
                        path: "/setting/worktypeSystem",
                        component: WorkTypeSystem,
                        exact: true
                    },
                    {
                        path: "/setting/workpriority",
                        component: workPriority,
                        exact: true
                    },
                    {
                        path: "/setting/workTypeFlow/:id",
                        component: WorkTypeFlow,
                        exact: true
                    },
                    {
                        path: "/setting/workTypeForm/:id",
                        component: WorkTypeForm,
                        exact: true
                    },
                    {
                        path: "/setting/projectType",
                        component: ProjectType,
                        exact: true
                    },
                    // 系统功能管理
                    {
                        path: "/setting/systemFeature",
                        component: SystemFeature,
                        exact: true
                    },
                    // 系统内置角色管理
                    {
                        path: "/setting/systemRoleBuilt",
                        component: SystemRoleBuilt,
                        exact: true
                    },
                    // 系统角色管理
                    {
                        path: "/setting/systemRole",
                        component: SystemRole,
                        exact: true
                    },
                    // 项目功能管理
                    {
                        path: "/setting/projectFeature",
                        component: ProjectFeature,
                        exact: true
                    },
                    // 项目角色管理
                    {
                        path: "/setting/projectRole",
                        component: ProjectRole,
                        exact: true
                    },
                    {
                        path: "/setting/fieldType",
                        component: ProjectProjectDirectory,
                        exact: true
                    },
                    {
                        path: "/setting/preliminaryTypeSys",
                        component: ProjectProjectDirectorySys,
                        exact: true
                    },
                    {
                        path: "/setting/preliminarySystem",
                        component: ProjectPreliminaryListSystem,
                        exact: true
                    },
                    {
                        path: "/setting/preliminary",
                        component: ProjectPreliminaryList,
                        exact: true
                    },
                    {
                        path: "/setting/form",
                        component: FormList,
                        exact: true
                    },
                    {
                        path: "/setting/FormDetail/:formId",
                        component: FormDetail,
                        exact: true
                    },
                    {
                        path: "/setting/formsystem",
                        component: FormListSystem,
                        exact: true
                    },
                    {
                        path: "/setting/projectForm",
                        component: ProjectProjectFormList,
                        exact: true
                    },
                    {
                        path: "/setting/projectFormDetail/:id",
                        component: FormDetail,
                        exact: true
                    },
                    {
                        path: "/setting/systemFlow",
                        component: ProjectSystemFlowList,
                        exact: true
                    },
                    {
                        path: "/setting/flowDetailView/:flowId",
                        component: FlowDetailView,
                        exact: true
                    },
                    {
                        path: "/setting/flowDetailDesign/:flowId",
                        component: FlowDetailDesign,
                        exact: true
                    },
                    {
                        path: "/setting/systemFlowsystem",
                        component: ProjectSystemFlowListSystem,
                        exact: true
                    },
                    {
                        path: "/setting/messageManagement",
                        component: ProjectMessageManagement,
                        exact: true
                    },
                    {
                        path: "/setting/messageNotice",
                        component: ProjectMessageNotice,
                        exact: true
                    },
                    {
                        path: "/setting/messageNoticeSystem",
                        component: ProjectMessageNoticeSystem,
                        exact: true
                    },
                    {
                        path: "/setting/messageTemplate",
                        component: ProjectMessageTemplate,
                        exact: true
                    },
                    {
                        path: "/setting/messageType",
                        component: ProjectMessageType,
                        exact: true
                    },
                    {
                        path: "/setting/messageSendType",
                        component: ProjectMessageSendType,
                        exact: true
                    },

                    {
                        path: "/setting/taskList",
                        component: TaskListContent,
                        exact: true
                    },
                    {
                        path: "/setting/myTodoTask",
                        component: MyTodoTaskContent,
                        exact: true
                    },
                    {
                        path: "/setting/todoTypeTask",
                        component: TodoTypeListContent,
                        exact: true
                    },
                    {
                        path: "/setting/todoTempList",
                        component: TodoTempListContent,
                        exact: true
                    },
                    {
                        path: "/setting/logList",
                        component: LogList,
                        exact: true
                    },
                    {
                        path: "/setting/myLogTemplateList",
                        component: LogTemplateList,
                        exact: true
                    },
                    {
                        path: "/setting/projectLogTypeList",
                        component: ProjectLogTypeList,
                        exact: true
                    },
                    {
                        path: "/setting/loadData",
                        component: LoadData,
                        exact: true
                    },
                    {
                        path: "/setting/urlData",
                        component: UrlData,
                        exact: true
                    },
                    {
                        path: "/setting/plugin",
                        component: ProjectPlugin,
                        exact: true
                    },
                    {
                        path: "/setting/version",
                        component: LicenceVersion,
                        exact: true
                    }
                ]
            },
            {
                path: "/projectDetail/:id",
                component: ProjectDetail,
                routes: [
                    {
                        path: "/projectDetail/:id/survey",
                        component: Survey,
                    },
                    {
                        path: "/projectDetail/:id/stage",
                        component: Stage,

                    },
                    {
                        path: "/projectDetail/:id/stageDetail/:stageId",
                        component: StageDetail,

                    },
                    {
                        path: "/projectDetail/:id/sprint",
                        component: Sprint

                    },
                    {
                        path: "/projectDetail/:id/wiki",
                        component: WikiRepository
                    },
                    {
                        path: "/projectDetail/:id/test",
                        component: TestRepository
                    },
                    {
                        path: "/projectDetail/:id/linemap",
                        component: Linemap,
                    },
                    {
                        path: "/projectDetail/:id/linemap/:workId",
                        component: Linemap,
                        exact: true
                    },
                    {
                        path: "/projectDetail/:id/sprintPlan",
                        component: PlanSprint,
                    },
                    {
                        path: "/projectDetail/:id/version",
                        component: Version,
                    },
                    {
                        path: "/projectDetail/:id/versionPlan",
                        component: VersionPlan,
                    },
                    {
                        path: "/projectDetail/:id/versionDetail/:versionId",
                        component: VersionDetail,
                    },
                    {
                        path: "/projectDetail/:id/epic/:epicId",
                        component: EpicDetail,
                    },
                    {
                        path: "/projectDetail/:id/work",
                        component: Work,
                        routes: [
                            {
                                path: "/projectDetail/:id/workTable",
                                component: WorkTable
                            },
                            
                            {
                                path: "/projectDetail/:id/workBodar",
                                component: WorkBodar,
                            },
                            {
                                path: "/projectDetail/:id/workList",
                                component: WorkList
                            },
                            {
                                path: "/projectDetail/:id/work/:workId",
                                component: WorkDetailPage
                            },
                        ]
                    },
                   
                    
                    {
                        path: "/projectDetail/:id/WorkDetail",
                        component: WorkTableDetail,
                        exact: true
                    },
                    {
                        path: "/projectDetail/:id/addDemand",
                        component: WorkAddPage,
                    },
                    {
                        path: "/projectDetail/:id/milestone",
                        component: Milestone,
                    },
                    {
                        path: "/projectDetail/:id/plan",
                        component: Plan,
                    },
                    {
                        path: "/projectDetail/:id/workTodo",
                        component: WorkTodo,
                    },
                    {
                        path: "/projectDetail/:id/dynamic",
                        component: Dynamic,
                    },
                    {
                        path: "/projectDetail/:id/planWorkItem/:id",
                        component: PlanWorkItem,
                    },
                    {
                        path: "/projectDetail/:id/log",
                        component: ProjectLog,
                    },
                    {
                        path: "/projectDetail/:id/statistics",
                        component: ProjectStatistics,
                        routes: [
                            {
                                path: "/projectDetail/:id/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/projectDetail/:id/statistics/moreMenu",
                                component: StatisticsMore,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/projectDetail/:id/projectSetDetail",
                        exact: false,
                        component: ProjectScrumSetDetail,
                        key: "ProjectSetDetail",
                        routes: [
                            {
                                path: "/projectDetail/:id/projectSetDetail/basicInfo",
                                component: BasicInfo,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/module",
                                component: Module,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/user",
                                component: PrivilegeDomainUser,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/projectDomainRole",
                                component: ProjectDomainRole,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/projectworkType",
                                component: ProjectWorkType,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/projectFlow",
                                component: ProjectFlowList,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/projectForm",
                                component: ProjectFormList,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/ProjectFormDetail/:formId",
                                component: ProjectFormDetail,
                            },
                            {
                                path: "/projectDetail/:id/projectSetDetail/projectFlowDetail/:flowId",
                                component: ProjectFlowDetailDesign,
                                exact: true
                            }
                        ]
                    },
                ]
            },
            {
                path: "/:id/sprintdetail/:sprint",
                component: SprintHome,
                routes: [
                    {
                        path: "/:id/sprintdetail/:sprint/statistics",
                        component: SprintStatistics,
                        routes: [
                            {
                                path: "/:id/sprintdetail/:sprint/statistics/workItem",
                                component: StatisticsWork,
                                exact: true
                            },
                            {
                                path: "/:id/sprintdetail/:sprint/statistics/moreMenu",
                                component: StatisticsMore,
                                exact: true
                            }
                        ]
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/workItem",
                        component: Work,
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/workDetail/:workId",
                        component: WorkDetailPage,
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/workDetail",
                        component: WorkTableDetail,
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/survey",
                        component: Sprintsurvey,
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/plan",
                        component: SprintPlan,
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/dynamic",
                        exact: false,
                        component: Dynamic,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/workList",
                        component: WorkList,
                        
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/workTable",
                        component: WorkTable,
                        
                    },
                    {
                        path: "/:id/sprintdetail/:sprint/workBodar",
                        component: WorkBodar,
                    }
                ]
            },

            {
                path: "/:id/versiondetail/:version",
                component: VersionHome,
                routes: [
                    {
                        path: "/:id/versiondetail/:version/workItem",
                        component: Work,
                    },
                    {
                        path: "/:id/versiondetail/:version/workDetail/:workId",
                        component: WorkDetailPage,
                    },
                    {
                        path: "/:id/versiondetail/:version/workDetail",
                        component: WorkTableDetail,
                    },
                    {
                        path: "/:id/versiondetail/:version/survey",
                        component: Versionsurvey,
                    },
                    {
                        path: "/:id/versiondetail/:version/plan",
                        component: VersionWorkItemPlan,
                    },
                    {
                        path: "/:id/versiondetail/:version/dynamic",
                        exact: false,
                        component: Dynamic,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/:id/versiondetail/:version/workList",
                        component: WorkList,
                    },
                    {
                        path: "/:id/versiondetail/:version/workTable",
                        component: WorkTable,
                    },
                    {
                        path: "/:id/versiondetail/:version/workBodar",
                        component: WorkBodar,
                    }
                ]
            },
        ]
    },
    {
        path: "/",
        component: () => <Redirect to="/home/survey" />,
        exact: true
    },
]
export default RoutersSaas;