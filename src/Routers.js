import React from "react";
import AsyncComponent from './common/lazy/AsyncComponent'
import { Redirect } from "react-router-dom";
// import WorkGantt from "./work/components/WorkGantt";


const Index = AsyncComponent(() => import('./home/common/components/LayoutCe'))
// const Index = AsyncComponent(() => import('./home/localHeader'))
const HomePage = AsyncComponent(() => import('./home/common/components/HomePage'))
const HomeSurvey = AsyncComponent(() => import('./home/common/components/HomeSurvey'))
const SysExceptionContent = AsyncComponent(() => import('./login/SysExceptionContent.js'))
const WorkAll = AsyncComponent(() => import('./work/components/Work'))
const Dynamic = AsyncComponent(() => import("./home/common/components/DynamicList"))
const WorkTodoPage = AsyncComponent(() => import("./home/common/components/TodoPage"))
const WorkTodo = AsyncComponent(() => import("./home/common/components/TodoPageList"))

const WorkGantt = AsyncComponent(() => import('./work/components/WorkGantt'))

const Login = AsyncComponent(() => import('./login/Login'))
const LoginRpwContent = AsyncComponent(() => import('./login/LoginRpwContent'))
const ProjectLogOut = AsyncComponent(() => import('./login/Logout'))

const NoFoundPage = AsyncComponent(() => import('./login/NoFoundPage.js'));
const NoAccessPage = AsyncComponent(() => import('./login/SystemNoAccessPage'));
const ProjectNoAccessPage = AsyncComponent(() => import('./login/ProjectNoAccessPage'));
const ExcludeProductUserContent = AsyncComponent(() => import('./login/ExcludeProductUserPage'))



// 消息
const SystemMessageSendType = AsyncComponent(() => import('./setting/message/SystemMessageSendType.js'))
const SystemMessageType = AsyncComponent(() => import('./setting/message/SystemMessageType.js'))
const SystemMessageTemplate = AsyncComponent(() => import('./setting/message/SystemMessageTemplate.js'))
const SystemMessageNotice = AsyncComponent(() => import('./setting/message/SystemMessageNotice.js'))
const SystemMessageNoticeBase = AsyncComponent(() => import('./setting/message/SystemMessageNoticeBase.js'))
const ProjectMessageNoticeContent = AsyncComponent(() => import("./setting/message/ProjectMessageNoticeContent"))
const DomainMessageNoticeContent = AsyncComponent(() => import("./project/setting/projectMessage/DomainMessageNoticeContent.js"))

const Setting = AsyncComponent(() => import('./setting/common/components/Setting'))
const WorkTypeList = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeList'))
const WorkTypeSystem = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeSystem'))
const WorkPriority = AsyncComponent(() => import('./setting/workSeting/components/WorkPriority'))
const WorkTypeFlow = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeFlow'))
const WorkTypeForm = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeForm'))
const ProjectType = AsyncComponent(() => import('./setting/projectType/components/ProjectType'))

// 事项权限
const WorkPrivilege = AsyncComponent(() => import("./setting/workPrivilege/components/WorkPrivilegeList.js"))
const WorkRoleFunction = AsyncComponent(() => import("./setting/workPrivilege/components/WorkRoleFunction.js"))
const WorkFunctionList = AsyncComponent(() => import("./setting/workPrivilege/components/WorkFunctionList.js"))
const WorkPrivilegeList = AsyncComponent(() => import("./setting/workPrivilege/components/WorkPrivilegeList.js"))
const WorkPrivilegeRoleList = AsyncComponent(() => import("./setting/workPrivilege/components/WorkRoleList.js"))
const ProjectWorkRoleList = AsyncComponent(() => import("./project/setting/projectWorkType/components/ProjectWorkRoleList.js"))
const ProjectWorkRoleFunction = AsyncComponent(() => import("./project/setting/projectWorkType/components/ProjectWorkRoleFunction.js"))

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

// 项目
const Project = AsyncComponent(() => import('./project/project/components/Project'))
const ProjectAdd = AsyncComponent(() => import('./project/project/components/ProjectAdd'))
const ProjectDetail = AsyncComponent(() => import('./project/common/components/ProjectLayout'))
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
const ProjectLog = AsyncComponent(() => import("./project/workLog/components/LogContent.js"))
const Work = AsyncComponent(() => import('./work/components/Work'))
const WorkList = AsyncComponent(() => import('./work/components/WorkList'))
const WorkTable = AsyncComponent(() => import('./work/components/WorkTable'))
const WorkListSystem = AsyncComponent(() => import("./work/components/WorkListSystem"))
const WorkBodar = AsyncComponent(() => import('./work/components/WorkBodar'))
const WorkTableDetail = AsyncComponent(() => import('./work/components/WorkTableDetail'))
const WorkDetailDrawer = AsyncComponent(() => import('./work/components/WorkDetailDrawer'))
const WorkDetailPage = AsyncComponent(() => import('./work/components/WorkDetailPage'))
const Milestone = AsyncComponent(() => import('./project/milestone/components/MilestoneList'))

const Linemap = AsyncComponent(() => import('./project/lineMap/component/LineMap'))

const Version = AsyncComponent(() => import('./project/version/components/VersionTable'))
const VersionDetail = AsyncComponent(() => import('./project/version/components/VersionDeatil.js'))
const VersionPlan = AsyncComponent(() => import('./project/version/components/VersionPlan'))
const VersionBasicInfo = AsyncComponent(() => import('./version/setting/components/VersionBasicInfo'))

const PrivilegeDomainUser = AsyncComponent(() => import('./project/user/User'));
const Plan = AsyncComponent(() => import('./project/plan/components/Plan'));
const PlanWorkItem = AsyncComponent(() => import('./project/plan/components/PlanWorkItem'));

const Module = AsyncComponent(() => import('./project/setting/module/components/ModuleList'))
const BasicInfo = AsyncComponent(() => import('./project/setting/basicInfo/components/BasicInfo'))

// 项目权限
const ProjectDomainRole = AsyncComponent(() => import('./project/privilege/ProjectDomainRole'));
const ProjectStatistics = AsyncComponent(() => import('./project/statistics/ProjectStatistics'))
const StatisticsWork = AsyncComponent(() => import('./statistics/components/StatisticsStatusWork'))


const WorkAddPage = AsyncComponent(() => import('./work/components/WorkAddPage'))
// 迭代
const SprintHome = AsyncComponent(() => import('./sprint/common/components/SprintLayout'))
const Sprintsurvey = AsyncComponent(() => import("./sprint/overview/components/SprintSurvey"))
const SprintPlan = AsyncComponent(() => import("./sprint/plan/components/SprintPlan"))
const SprintStatistics = AsyncComponent(() => import('./sprint/statistics/SprintStatistics'))
const SprintBasicInfo = AsyncComponent(() => import("./sprint/setting/components/SprintBasicInfo"))
// 版本
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
const ProjectSetStatistics = AsyncComponent(() => import("./projectSet/statistics/ProjectSetStatistics"))

// 导入外部数据
const LoadData = AsyncComponent(() => import('./setting/systemIntegration/components/JiraLoadData'))
const UrlData = AsyncComponent(() => import('./setting/systemIntegration/components/UrlData'))
//效能
const Insight = AsyncComponent(() => import('./home/insight/components/Insight'))
const InsightList = AsyncComponent(() => import('./home/insight/components/InsightList'))
const NewInsight = AsyncComponent(() => import("./home/insight/components/NewInsight"))
const ViewInsight = AsyncComponent(() => import("./home/insight/components/ViewInsight.js"))
// const ViewInsight1 = AsyncComponent(() => import("./home/insight/components/ViewInsight1.js"))

// 首页
const SettingHome = AsyncComponent(() => import('./setting/home/components/SettingHome.js'))
const ProjectNotFound = AsyncComponent(() => import("./setting/common/components/ProjectNotFond"))
//组织中心
const ProjectProjectDirectorySys = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeListSys'))
const ProjectProjectDirectory = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeList'))
const ProjectPreliminaryListSystem = AsyncComponent(() => import('./setting/form/ProjectPreliminaryListSystem'))
const ProjectPreliminaryList = AsyncComponent(() => import('./setting/form/ProjectPreliminaryList'))
const ProjectVirtualRoleList = AsyncComponent(() => import('./setting/user/ProjectVirtualRoleList'))

const FormList = AsyncComponent(() => import('./setting/form/ProjectFormList'))
const FormListSystem = AsyncComponent(() => import('./setting/form/ProjectFormListSystem'))
const ProjectProjectFormList = AsyncComponent(() => import('./setting/form/ProjectProjectFormList'))
const FormDetail = AsyncComponent(() => import('./setting/form/ProjectFormDetail'))
const ProjectFormDetailSystem = AsyncComponent(() => import('./setting/form/ProjectFormDetailSystem'))
// const ProjectFlowList = AsyncComponent(() => import('./setting/flow/projectProjectFlowList'))
const ProjectSystemFlowList = AsyncComponent(() => import('./setting/flow/components/ProjectSystemFlowList'))
const ProjectSystemFlowListSystem = AsyncComponent(() => import('./setting/flow/components/ProjectSystemFlowListSystem'))

const ProjectFlowStatusList = AsyncComponent(() => import('./setting/flow/components/ProjectFlowStatusList'))
const FlowDetailView = AsyncComponent(() => import('./setting/flow/components/FlowDetailView'))
const FlowDetailDesign = AsyncComponent(() => import('./setting/flow/components/FlowDetailDesign'))
const ProjectNodeStatusList = AsyncComponent(() => import('./setting/flow/components/ProjectNodeStatusList'))
const FlowBusinessRoleList = AsyncComponent(() => import('./setting/flow/components/FlowBusinessRoleList'))
// 状态组件

//日志
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
// const StageHome = AsyncComponent(() => import("./stage/common/components/StageLayout"))
// const StageSurvey = AsyncComponent(() => import("./stage/overview/components/StageSurvey"))
// const StagePlan = AsyncComponent(() => import("./stage/plan/components/StagePlan"))
// const StageBasicInfo = AsyncComponent(() => import("./stage/setting/components/StageBasicInfo"))

const LicenceVersion = AsyncComponent(() => import('./setting/version/Version'));
const ProductAuth = AsyncComponent(() => import('./setting/version/Product'));
const Backups = AsyncComponent(() => import('./setting/backups/Backups'));
const Log = AsyncComponent(() => import("./workLog/components/Log"))
const LogAllList = AsyncComponent(() => import("./project/workLog/components/LogContent.js"))

const Routers = [
    {
        path: "/login",
        exact: true,
        component: Login,
    },
    {
        component: LoginRpwContent,
        exact:true,
        path: '/loginRpw'
    },
    {
        path: "/noAuth",
        exact: true,
        component: ExcludeProductUserContent,
    },
    {
        path:"/500",
        exact:true,
        component:SysExceptionContent,
    },
    {
        exact: true,
        path: '/404',
        component: NoFoundPage,
    },
    {
        exact: true,
        path: '/noaccess',
        component: NoAccessPage,
    },
    {
        path: "/logout",
        exact: true,
        component: ProjectLogOut,
    },
    {
        path: "/",
        component: () => <Redirect to="/index/overview" />,
        exact: true,
    },
    {
        path: "/setting",
        component: Setting,
        key: 'Setting',
        routes: [
            {
                path: "/setting/home",
                component: SettingHome,
                row: true,
                exact: true
            },
            {
                path: "/setting/orga",
                component: OrgaContent,
                row: true,
                exact: true
            },
            {
                path: "/setting/user",
                component: OrgaUser,
                row: true,
                exact: true
            },
            {
                path: "/setting/dir",
                component: ProjectDirectory,
                row: true,
                exact: true
            },
            {
                path: "/setting/userGroup",
                component: ProjectUserGroup,
                row: true,
                exact: true
            },
            {
                path: "/setting/usersystemgroup",
                component: ProjectSystemUserGroup,
                row: true,
                exact: true
            },
            {
                path: "/setting/workstatus",
                component: ProjectFlowStatusList,
                row: true,
                exact: true
            },
            {
                path: "/setting/nodestatus",
                component: ProjectNodeStatusList,
                row: true,
                exact: true
            },
            {
                path: "/setting/businessrole",
                component: FlowBusinessRoleList,
                row: true,
                exact: true
            },
            {
                path: "/setting/worktype",
                component: WorkTypeList,
                exact: true
            },
            {
                path: "/setting/workRoleFunction/:workTypeId/:roleId",
                component: WorkRoleFunction,
                exact: true
            },
            {
                path: "/setting/workPrivilege",
                component: WorkPrivilege,
                exact: true
            },
            {
                path: "/setting/workPrivilegeRoleList/:workTypeId",
                component: WorkPrivilegeRoleList,
                exact: true
            },
            {
                path: "/setting/workFunctionList",
                component: WorkFunctionList,
                exact: true
            },
            {
                path: "/setting/workPrivilegeList",
                component: WorkPrivilegeList,
                exact: true
            },
            
            {
                path: "/setting/worktypeSystem",
                component: WorkTypeSystem,
                exact: true
            },
            {
                path: "/setting/workpriority",
                component: WorkPriority,
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
                row: true,
                exact: true
            },
            // 系统内置角色管理
            {
                path: "/setting/systemRoleBuilt",
                component: SystemRoleBuilt,
                row: true,
                exact: true
            },
            // 系统角色管理
            {
                path: "/setting/systemRole",
                component: SystemRole,
                row: true,
                exact: true
            },
            // 项目功能管理
            {
                path: "/setting/projectFeature",
                component: ProjectFeature,
                row: true,
                exact: true
            },
            // 项目角色管理
            {
                path: "/setting/projectRole",
                component: ProjectRole,
                row: true,
                exact: true
            },
            {
                path: "/setting/fieldType",
                component: ProjectProjectDirectory,
                row: true,
                exact: true
            },
            {
                path: "/setting/preliminaryTypeSys",
                component: ProjectProjectDirectorySys,
                row: true,
                exact: true
            },
            {
                path: "/setting/preliminarySystem",
                component: ProjectPreliminaryListSystem,
                row: true,
                exact: true
            },
            {
                path: "/setting/preliminary",
                component: ProjectPreliminaryList,
                row: true,
                exact: true
            },
            {
                path: "/setting/form",
                component: FormList,
                row: true,
                exact: true
            },
            {
                path: "/setting/FormDetail/:formId",
                component: FormDetail,
                row: true,
                exact: true
            },
            {
                path: "/setting/FormDetailSys/:formId",
                component: ProjectFormDetailSystem,
                row: true,
                exact: true
            },
            {
                path: "/setting/formsystem",
                component: FormListSystem,
                row: true,
                exact: true
            },
            {
                path: "/setting/projectForm",
                component: ProjectProjectFormList,
                row: true,
                exact: true
            },
            {
                path: "/setting/projectFormDetail/:id",
                component: FormDetail,
                row: true,
                exact: true
            },
            {
                path: "/setting/systemFlow",
                component: ProjectSystemFlowList,
                row: true,
                exact: true
            },
            {
                path: "/setting/flowDetailView/:flowId",
                component: FlowDetailView,
                row: true,
                exact: true
            },
            {
                path: "/setting/flowDetailDesign/:flowId",
                component: FlowDetailDesign,
                row: true,
                exact: true
            },
            {
                path: "/setting/systemFlowsystem",
                component: ProjectSystemFlowListSystem,
                row: true,
                exact: true
            },
            {
                path: "/setting/messageNotice",
                component: SystemMessageNotice,
                row: true,
                exact: true
            },
            {
                path: "/setting/messageNoticeSystem",
                component: SystemMessageNoticeBase,
                row: true,
                exact: true
            },
            {
                path: "/setting/projectMessageNotice",
                component: ProjectMessageNoticeContent,
                row: true,
                exact: true
            },

            {
                path: "/setting/messageTemplate",
                component: SystemMessageTemplate,
                row: true,
                exact: true
            },
            {
                path: "/setting/messageType",
                component: SystemMessageType,
                row: true,
                exact: true
            },
            {
                path: "/setting/messageSendType",
                component: SystemMessageSendType,
                row: true,
                exact: true
            },

            {
                path: "/setting/taskList",
                component: TaskListContent,
                row: true,
                exact: true
            },
            {
                path: "/setting/myTodoTask",
                component: MyTodoTaskContent,
                row: true,
                exact: true
            },
            {
                path: "/setting/todoTypeTask",
                component: TodoTypeListContent,
                row: true,
                exact: true
            },
            {
                path: "/setting/todoTempList",
                component: TodoTempListContent,
                row: true,
                exact: true
            },
            {
                path: "/setting/log",
                component: LogList,
                row: true,
                exact: true
            },
            {
                path: "/setting/myLogTemplateList",
                component: LogTemplateList,
                row: true,
                exact: true
            },
            {
                path: "/setting/projectLogTypeList",
                component: ProjectLogTypeList,
                row: true,
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
                path: "/setting/version",
                component: LicenceVersion,
                row: true,
                exact: true
            }, {
                path: "/setting/productAuth",
                component: ProductAuth,
                row: true,
                exact: true
            },
            {
                path: "/setting/backups",
                component: Backups,
                row: true,
                exact: true
            },
            {
                path: "/setting/virtual",
                component: ProjectVirtualRoleList,
                row: true,
                exact: true
            }
        ]
    },
   
    {
        path: "/project/:id",
        component: ProjectDetail,
        routes: [
            {
                path: "/project/:id/overview",
                component: Survey,
            },
            {
                path: "/project/:id/stage",
                component: Stage,
            },
            // {
            //     path: "/project/:id/stageDetail/:stageId",
            //     component: StageDetail,

            // },
            {
                path: "/project/:id/sprint",
                component: Sprint

            },
            {
                path: "/project/:id/wiki",
                component: WikiRepository
            },
            {
                path: "/project/:id/test",
                component: TestRepository
            },
            {
                path: "/project/:id/linemap",
                component: Linemap,
            },
            {
                path: "/project/:id/linemap/:workId",
                component: Linemap,
                exact: true
            },
            {
                path: "/project/:id/sprintPlan",
                component: PlanSprint,
            },
            {
                path: "/project/:id/version",
                component: Version,
            },
            {
                path: "/project/:id/versionPlan",
                component: VersionPlan,
            },
            {
                path: "/project/:id/version/:versionId",
                component: VersionDetail,
            },

            {
                path: "/project/:id/epic/:epicId",
                component: EpicDetail,
            },
            {
                path: "/project/:id/workTable",
                component: WorkTable
            },

            {
                path: "/project/:id/workBodar",
                component: WorkBodar,
            },
            {
                path: "/project/:id/workitem",
                component: Work,
            },
            {
                path: "/project/:id/workList",
                component: WorkList
            },
            {
                path: "/project/:id/workGantt",
                component: WorkGantt,
            },

            {
                path: "/project/:id/work/:workId",
                component: WorkDetailPage
            },


            {
                path: "/project/:id/WorkDetail",
                component: WorkTableDetail,
                exact: true
            },
            {
                path: "/project/:id/addDemand",
                component: WorkAddPage,
            },
            {
                path: "/project/:id/milestone",
                component: Milestone,
            },
            {
                path: "/project/:id/plan",
                component: Plan,
            },
            {
                path: "/project/:id/workTodo",
                component: WorkTodoPage,
            },
            {
                path: "/project/:id/dynamic",
                component: Dynamic,
            },
            {
                path: "/project/:id/planWorkItem/:id",
                component: PlanWorkItem,
            },

            {
                path: "/project/:id/log",
                component: ProjectLog,
            },
            {
                path: "/project/:id/statistics",
                component: ProjectStatistics,
                routes: [
                    {
                        path: "/project/:id/statistics/workItem",
                        component: StatisticsWork,
                        exact: true
                    }
                ]
            },
            {
                path: "/project/:id/set",
                exact: false,
                component: ProjectScrumSetDetail,
                key: "ProjectSetDetail",
                routes: [
                    {
                        path: "/project/:id/set/basicInfo",
                        component: BasicInfo,
                    },
                    {
                        path: "/project/:id/set/module",
                        component: Module,
                    },
                    {
                        path: "/project/:id/set/user",
                        component: PrivilegeDomainUser,
                    },
                    {
                        path: "/project/:id/set/projectDomainRole",
                        component: ProjectDomainRole,
                    },
                    {
                        path: "/project/:id/set/projectworkType",
                        component: ProjectWorkType,
                    },
                    {
                        path: "/project/:id/set/rolefunction/:workTypeId/:roleId",
                        component: ProjectWorkRoleFunction,
                        exact: true
                    },
                    {
                        path: "/project/:id/set/workPrivilege/:workTypeId",
                        component: ProjectWorkRoleList,
                        exact: true
                    },
                    {
                        path: "/project/:id/set/projectFlow",
                        component: ProjectFlowList,
                    },
                    {
                        path: "/project/:id/set/projectForm",
                        component: ProjectFormList,
                    },
                    {
                        path: "/project/:id/set/ProjectFormDetail/:formId",
                        component: ProjectFormDetail,
                    },
                   
                    {
                        path: "/project/:id/set/projectFlowDetail/:flowId",
                        component: ProjectFlowDetailDesign,
                        exact: true
                    },
                    {
                        path: "/project/:id/set/messagenotice",
                        component: DomainMessageNoticeContent,
                    },
                    {
                        exact: false,
                        path: "/project/:id/set/noaccess",
                        component: NoAccessPage,
                        key: "ProjectSetNoaccess"
                    },
                ]
            },
         
        ]
    },
    {   
        path: "/project/:id/noAccess",
        exact: true,
        component: ProjectNoAccessPage
    },
   
    {
        path: "/projectSet/:projectSetId",
        exact: false,
        component: ProjectSetDetail,
        key: "ProjectSetDetail",
        routes: [
            {
                path: "/projectSet/:projectSetId/set",
                exact: false,
                component: ProjectSetSet,
                key: "ProjectSetDetailAdide",
                routes: [
                    {
                        path: "/projectSet/:projectSetId/set/basicInfo",
                        exact: false,
                        component: ProjectSetBasicInfo,
                        key: "ProjectSetBasicInfo"
                    },
                    {
                        path: "/projectSet/:projectSetId/set/dominRole",
                        exact: false,
                        component: ProjectSetDomainRole,
                        key: "ProjectSetDomainRole"
                    },
                    {
                        path: "/projectSet/:projectSetId/set/user",
                        exact: false,
                        component: ProjectSetUser,
                        key: "ProjectSetUser"
                    },
                    {
                        exact: false,
                        path: "/projectSet/:projectSetId/set/noaccess",
                        component: NoAccessPage,
                        key: "ProjectSetNoaccess"
                    },
                ]
            },
            {
                path: "/projectSet/:projectSetId/overview",
                exact: false,
                component: ProjectSetSurvey,
                key: "ProjectSetSurvey"
            },
            {
                path: "/projectSet/:projectSetId/dynamic",
                exact: false,
                component: Dynamic,
                key: "ProjectSetSurvey"
            },
            {
                path: "/projectSet/:projectSetId/workTodo",
                exact: false,
                component: WorkTodoPage,
                key: "ProjectSetSurvey"
            },
            {
                path: "/projectSet/:projectSetId/project",
                exact: false,
                component: ProjectSetProjectList,
                key: "ProjectSetProjectList"
            },
            {
                path: "/projectSet/:projectSetId/dominRole",
                exact: false,
                component: ProjectSetDomainRole,
                key: "ProjectSetDomainRole"
            },
            {
                path: "/projectSet/:projectSetId/user",
                exact: false,
                component: ProjectSetUser,
                key: "ProjectSetUser"
            },
            {
                path: "/projectSet/:projectSetId/statistics",
                component: ProjectSetStatistics,
                routes: [
                    {
                        path: "/projectSet/:projectSetId/statistics/workItem",
                        component: StatisticsWork,
                        exact: true
                    }
                ]
            },

        ]
    },
  
   
    {
        path: "/:id/sprint/:sprint",
        component: SprintHome,
        routes: [
            {
                path: "/:id/sprint/:sprint/statistics",
                component: SprintStatistics,
                routes: [
                    {
                        path: "/:id/sprint/:sprint/statistics/workItem",
                        component: StatisticsWork,
                        exact: true
                    }
                ]
            },
            {
                path: "/:id/sprint/:sprint/workitem",
                component: Work,
            },
            {
                path: "/:id/sprint/:sprint/work/:workId",
                component: WorkDetailPage,
            },
            {
                path: "/:id/sprint/:sprint/workDetail",
                component: WorkTableDetail,
            },
            {
                path: "/:id/sprint/:sprint/overview",
                component: Sprintsurvey,
            },
            {
                path: "/:id/sprint/:sprint/plan",
                component: SprintPlan,
            },
            {
                path: "/:id/sprint/:sprint/setting",
                component: SprintBasicInfo,
            },
            {
                path: "/:id/sprint/:sprint/dynamic",
                exact: false,
                component: Dynamic
            },
            {
                path: "/:id/sprint/:sprint/workTodo",
                exact: false,
                component: WorkTodoPage
            },
            {
                path: "/:id/sprint/:sprint/workList",
                component: WorkList,
            },
            
            {
                path: "/:id/sprint/:sprint/workGantt",
                component: WorkGantt,
            },
            {
                path: "/:id/sprint/:sprint/workTable",
                component: WorkTable,

            },
            {
                path: "/:id/sprint/:sprint/workBodar",
                component: WorkBodar,
            }
        ]
    },

    {
        path: "/:id/version/:version",
        component: VersionHome,
        routes: [
            {
                path: "/:id/version/:version/work/:workId",
                component: WorkDetailPage,
            },
            {
                path: "/:id/version/:version/workDetail",
                component: WorkTableDetail,
            },
            {
                path: "/:id/version/:version/overview",
                component: Versionsurvey,
            },
            {
                path: "/:id/version/:version/plan",
                component: VersionWorkItemPlan,
            },
            {
                path: "/:id/version/:version/setting",
                component: VersionBasicInfo,
            },
            {
                path: "/:id/version/:version/dynamic",
                component: Dynamic
            },
            {
                path: "/:id/version/:version/workitem",
                component: Work,
            },
            {
                path: "/:id/version/:version/workList",
                component: WorkList,
            },
            {
                path: "/:id/version/:version/workGantt",
                component: WorkGantt,
            },
            {
                path: "/:id/version/:version/workTable",
                component: WorkTable,
            },
            {
                path: "/:id/version/:version/workBodar",
                component: WorkBodar,
            },
            {
                path: "/:id/version/:version/workTodo",
                component: WorkTodoPage,
            },
        ]
    },
    // {
    //     path: "/:id/stagedetail/:stage",
    //     component: StageHome,
    //     routes: [
    //         {
    //             path: "/:id/stagedetail/:stage/workItem",
    //             component: Work,
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/work/:workId",
    //             component: WorkDetailPage,
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/workDetail",
    //             component: WorkTableDetail,
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/dynamic",
    //             component: Dynamic
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/workList",
    //             component: WorkList,
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/workGantt",
    //             component: WorkGantt,
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/workTable",
    //             component: WorkTable,
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/workBodar",
    //             component: WorkBodar,
    //         },
    //         {
    //             path: "/:id/stagedetail/:stage/workTodo",
    //             component: WorkTodoPage,
    //         },
    //     ]
    // },
    {
        component: Index,
        path: "/",
        routes: [
            {
                path: "/index",
                exact: false,
                component: HomePage,
                key: 'home',
                routes: [
                    {
                        path: "/index/overview",
                        exact: false,
                        component: HomeSurvey,
                        key: "ProjectSet"

                    },
                    {
                        path: "/index/todoList",
                        exact: false,
                        component: WorkTodo,
                        key: "ProjectSet"

                    },
                    {
                        path: "/index/insightlist",
                        exact: false,
                        component: InsightList,
                        key: "InsightList"
                    },
                    {
                        path: "/index/newInsight/:id",
                        exact: false,
                        component: NewInsight,
                        key: "NewInsight"
                    },
                    {
                        path: "/index/viewInsight/:id",
                        exact: false,
                        component: ViewInsight,
                        key: "ViewInsight"
                    }
                ]
            },
            {
                path: "/log",
                exact: false,
                component: Log,
                key: "Log",
                routes: [
                    {
                        path: "/log/list",
                        exact: false,
                        component: LogAllList,
                        key: "LogAllList"
                    }

                ]
            },
            {
                path: "/todoList",
                exact: false,
                component: WorkTodoPage,
                key: "ProjectSet"

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
                path: "/dynamic",
                exact: false,
                component: Dynamic,
                key: "dynamic"
            },
            {
                path: "/projectSet",
                exact: false,
                component: ProjectSet,
                key: "ProjectSet",
                // routes: [
                //     {
                //         path: "/projectSet/projectSetList",
                //         exact: false,
                //         component: ProjectSetList,
                //         key: "ProjectSet"
                //     }
                // ]
            },
            {
                path: "/projectSetAdd",
                exact: false,
                component: ProjectSetAdd,
                key: "ProjectSet"
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
                path: "/workitem",
                component: Work,

            },
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
                path: "/workGantt",
                component: WorkGantt
            },
            {
                path: "/workList",
                component: WorkList,
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

        ]
    }
]
export default Routers;