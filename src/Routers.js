import React from "react";
import AsyncComponent from './common/lazy/AsyncComponent'
import { Redirect } from "react-router-dom";
import {AccessToken} from "tiklab-openapi-ui";

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
const TodoList = AsyncComponent(() => import('./home/common/components/TodoList'))
const HomeAppraised = AsyncComponent(() => import('./home/common/components/HomeAppraisedTable'))

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
const SystemMessageContent = AsyncComponent(() => import("./setting/message/SystemMessageContent"))
const DomainMessageNoticeContent = AsyncComponent(() => import("./project/setting/projectMessage/DomainMessageNoticeContent.js"))

const Setting = AsyncComponent(() => import('./setting/common/components/Setting'))
const WorkTypeList = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeList'))
const WorkTypeSystem = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeSystem'))
const WorkPriority = AsyncComponent(() => import('./setting/workSeting/components/WorkPriority'))
const WorkTypeFlow = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeFlow'))
const WorkTypeForm = AsyncComponent(() => import('./setting/workSeting/components/WorkTypeForm'))
const ProjectType = AsyncComponent(() => import('./setting/projectType/components/ProjectType'))

// 事项权限
const WorkRoleFunction = AsyncComponent(() => import("./setting/workPrivilege/components/WorkRoleFunction.js"))
const WorkFunctionList = AsyncComponent(() => import("./setting/workPrivilege/components/WorkFunctionList.js"))
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
// const ProjectAdd = AsyncComponent(() => import('./project/project/components/ProjectAdd'))
const ProjectDetail = AsyncComponent(() => import('./project/common/components/ProjectLayout'))
const ProjectScrumSetDetail = AsyncComponent(() => import('./project/setting/common/components/ProjectScrumSet'))
const ProjectWorkType = AsyncComponent(() => import('./project/setting/projectWorkType/components/WorkType'))
const ProjectFlowList = AsyncComponent(() => import('./project/setting/projectFlow/components/ProjectFlow'))
const ProjectFlowDetailDesign = AsyncComponent(() => import("./project/setting/projectFlow/components/ProjectFlowDetailDesign"))

const ProjectFormList = AsyncComponent(() => import('./project/setting/projectForm/ProjectForm'))
const ProjectFormDetail = AsyncComponent(() => import('./project/setting/projectForm/ProjectFormDetail'))

const Survey = AsyncComponent(() => import('./project/overview/components/Survey'))
const Sprint = AsyncComponent(() => import('./project/sprint/components/SprintList'))
const WikiRepository = AsyncComponent(() => import('./project/wiki/repository/components/WikiRepository'))
const TestRepository = AsyncComponent(() => import('./project/test/components/TestRepository'))
const PlanSprint = AsyncComponent(() => import('./project/sprint/components/SprintPlan'))
const ProjectLog = AsyncComponent(() => import("./project/workLog/components/LogContent.js"))
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
const VersionBasicInfo = AsyncComponent(() => import('./version/setting/components/VersionBasicInfo'))

const PrivilegeDomainUser = AsyncComponent(() => import('./project/setting/user/User.js'));
const Plan = AsyncComponent(() => import('./project/plan/components/Plan'));
const PlanWorkItem = AsyncComponent(() => import('./project/plan/components/PlanWorkItem'));

const Planning = AsyncComponent(() => import('./project/planning/components/Planning'))

const Module = AsyncComponent(() => import('./project/setting/module/components/ModuleList'))
const BasicInfo = AsyncComponent(() => import('./project/setting/basicInfo/components/BasicInfo'))
const IntegrationContent = AsyncComponent(()=>import("./project/setting/integration/IntegrationContent"))
const IntegrationBindSward = AsyncComponent(()=>import("./project/setting/integration/BindSward"))


// 项目权限
const ProjectDomainRole = AsyncComponent(() => import('./project/setting/privilege/ProjectDomainRole'));
const ProjectStatistics = AsyncComponent(() => import('./project/statistics/components/ProjectStatistics'))
const StatisticsWork = AsyncComponent(() => import('./project/statistics/components/StatisticsStatusWork'))
const ProjectStatisticsOverview = AsyncComponent(() => import('./project/statistics/components/ProjectStatisticsOverview'))


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
// const ProjectSetAdd = AsyncComponent(() => import("./projectSet/projectSet/components/ProjectSetAdd"))
const ProjectSetDetail = AsyncComponent(() => import('./projectSet/common/components/ProjectSetLayout'))
const ProjectSetProjectList = AsyncComponent(() => import('./projectSet/projectList/components/ProjectSetProjectList'))
const ProjectSetSurvey = AsyncComponent(() => import('./projectSet/overview/components/ProjectSetSurvey'))
const ProjectSetDomainRole = AsyncComponent(() => import('./projectSet/user/ProjectSetDomainRole'));
const ProjectSetUser = AsyncComponent(() => import('./projectSet/user/ProjectSetUser'));
const ProjectSetSet = AsyncComponent(() => import("./projectSet/setting/common/components/ProjectSetSetting"))
const ProjectSetBasicInfo = AsyncComponent(() => import("./projectSet/setting/basicInfo/components/ProjectSetBasicInfo"))
const ProjectSetStatistics = AsyncComponent(() => import("./projectSet/statistics/ProjectSetStatistics"))

//产品
const Product = AsyncComponent(() => import('./product/product/components/Product'))
const ProductDetail = AsyncComponent(() => import('./product/common/components/ProductLayout'))
const ProductProjectList = AsyncComponent(() => import('./product/projectList/components/ProductProjectList'))
const ProductModule = AsyncComponent(() => import('./product/module/components/ProductModuleList'))
const ProductLineMap = AsyncComponent(() => import('./product/lineMap/components/ProductLineMap'))
const ProductBasicInfo = AsyncComponent(() => import("./product/setting/basicInfo/components/ProductBasicInfo"))
const ProductDomainRole = AsyncComponent(() => import('./product/user/ProductDomainRole'));
const ProductUser = AsyncComponent(() => import('./product/user/ProductUser'));
const ProductSet = AsyncComponent(() => import("./product/setting/common/ProductSetting"))
// 产品计划
const ProductPlanList = AsyncComponent(() => import('./product/plan/planList/components/ProductPlanList'))
const ProductPlanLayout = AsyncComponent(() => import('./product/plan/common/components/ProductPlanLayout'))

// 导入外部数据
const JiraLoadData = AsyncComponent(() => import('./setting/systemIntegration/components/JiraLoadData'))
const MantisLoadData = AsyncComponent(() => import('./setting/systemIntegration/components/MantisLoadData'))
const LoadData = AsyncComponent(() => import('./setting/systemIntegration/components/LoadData'))
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
// const Stage = AsyncComponent(() => import("./project/stagePlan/component/Stage"))
// const StageHome = AsyncComponent(() => import("./stagePlan/common/components/StageLayout"))
// const StageSurvey = AsyncComponent(() => import("./stagePlan/overview/components/StageSurvey"))
// const StagePlan = AsyncComponent(() => import("./stagePlan/plan/components/StagePlan"))
// const StageBasicInfo = AsyncComponent(() => import("./stagePlan/setting/components/StageBasicInfo"))

// 阶段
const StageList = AsyncComponent(() => import("./project/stage/stageList/components/StageList"))
const StageDetail = AsyncComponent(() => import("./stage/common/components/StageDetailLayout"))
const StageSurvey = AsyncComponent(() => import("./stage/overview/components/StageSurvey"))

const LicenceVersion = AsyncComponent(() => import('./setting/version/Version'));
const ProductAuth = AsyncComponent(() => import('./setting/version/Product'));
const Backups = AsyncComponent(() => import('./setting/backups/Backups'));
const Log = AsyncComponent(() => import("./workLog/components/Log"))
const LogStatistics = AsyncComponent(() => import("./workLog/statistics/components/LogStatisticsLayout"))
const LogAllList = AsyncComponent(() => import("./project/workLog/components/LogContent.js"))

const Statistics = AsyncComponent(() => import('./statistics/components/Statistics'))
const StatisticsOverview = AsyncComponent(() => import('./statistics/components/overview/StatisticsOverview'))
const ProjectSetMember = AsyncComponent(() => import('./statistics/components/projectSet/ProjectSetMember'))
const ProjectSetWorkItem = AsyncComponent(() => import('./statistics/components/projectSet/ProjectSetWorkItem'))
const ProjectOperateTable = AsyncComponent(() => import('./statistics/components/projectSet/ProjectOperateTable'))
const UserWorkItem = AsyncComponent(() => import('./statistics/components/project/UserWorkItem'))
const CompleteWorkItemTrend = AsyncComponent(() => import('./statistics/components/workItem/CompleteWorkItemTrend'))
const WorkItemTrend = AsyncComponent(() => import('./statistics/components/workItem/WorkItemTrend'))
const NewWorkItemTrend = AsyncComponent(() => import('./statistics/components/workItem/NewWorkItemTrend'))
const WorkItemStatusSituation = AsyncComponent(() => import('./statistics/components/workItem/WorkItemStatusSituation'))

const OpenApiPages = AsyncComponent(() => import('./setting/openapi/OpenApiPages'))
const OpenApiDocPages = AsyncComponent(() => import('./setting/openapi/OpenApiDocPages'))

const Appraised = AsyncComponent(() => import('./project/appraised/components/AppraisedTable'))

// 评审
const AppraisedHome = AsyncComponent(() => import('./appraised/common/components/AppraisedLayout'))
const AppraisedItem = AsyncComponent(() => import('./project/appraised/components/AppraisedItemTable'))
const AppraisedWorkItemDetail = AsyncComponent(() => import('./project/appraised/components/AppraisedItemStatusDrawer'))

// requestError
const RequestErrorContent = AsyncComponent(() => import('./common/requestError/RequestErrorContent'))

//测试用例
let TestCaseTableMain = AsyncComponent(() => import( "./test/testcase/components/TestCaseTableMain"));
let TestCaseTableLayout = AsyncComponent(() => import( "./test/testcase/components/TestCaseLayout"));
let TestCaseTable = AsyncComponent(() => import("./test/testcase/components/TestCaseTable"));
let FunctionContentListView = AsyncComponent(() => import("./test/function/function/components/listView/FunctionContentListView"));

let PlanDetailContent = AsyncComponent(()=>import("./test/testplan/common/PlanDetailContent"))
let TestPlan = AsyncComponent(() => import("./test/testplan/plan/components/testPlan"));
let TestPlanBindCaseList = AsyncComponent(() => import("./test/testplan/plan/components/testPlanBindCaseList"));
let FunctionTestInstance = AsyncComponent(() => import( "./test/testplan/function/components/FunctionTestInstance"));
let PlanDefect = AsyncComponent(() => import("./test/testplan/defect/PlanDefect"));
let PlanReportPage  = AsyncComponent(() => import( "./test/testplan/report/components/PlanReportPage"));
let PlanReportDetail = AsyncComponent(() => import("./test/testplan/report/components/PlanReportDetail"));

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
        path: "/openApiDoc",
        component: OpenApiDocPages,
        key:'OpenApiDocPages',
    },
    {
        path: "/requestError",
        component: RequestErrorContent,
        key:'RequestError',
    },



    {
        component: Index,
        path: "/",
        routes: [
            {
                path: "/index",
                component: HomePage,
                key: "Home",
                routes: [
                    {
                        path: "/index/overview",
                        exact: false,
                        component: HomeSurvey,
                        key: "ProjectSet"

                    },
                    {
                        path: "/index/todoPage",
                        exact: false,
                        component: WorkTodoPage,
                        key: "ProjectSet"

                    },
                    {
                        path: "/index/todoList",
                        exact: false,
                        component: TodoList,
                        key: "TodoList",
                        routes: [
                            {
                                path: "/index/todoList/:workId",
                                exact: false,
                                component: WorkDetailPage,
                                key: "TodoListDetail"
                            }
                        ]
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
                    },
                    {
                        path: "/index/appraised",
                        exact: false,
                        component: HomeAppraised,
                        key: "HomeAppraised"
                    },
                    {
                        path: "/index/appraised/:workId",
                        component: WorkDetailPage,
                    },
                ]
            },



            // {
            //     path: "/log",
            //     exact: false,
            //     component: Log,
            //     key: "Log",
            //     routes: [
            //         {
            //             path: "/log/list",
            //             exact: false,
            //             component: LogAllList,
            //             key: "LogAllList"
            //         }
            //
            //     ]
            // },
            {
              path: "/log",
              component: Log,
              routes: [
                  {
                      path: "/log/list",
                      exact: false,
                      component: LogAllList,
                      key: "LogAllList",
                  },
                  {
                      path: "/log/statistics",
                      exact: false,
                      component: LogStatistics,
                      key: "LogStatistics",
                      routes: [],
                  }
              ]
            },

            {
                path: "/statistics",
                component: Statistics,
                routes: [
                    {
                        path: "/statistics/overview",
                        exact: false,
                        component: StatisticsOverview,
                        key: "statisticsOverview"
                    },
                    {
                        path: "/statistics/projectSet/member",
                        exact: false,
                        component: ProjectSetMember,
                        key: "ProjectSetMember"
                    },
                    // {
                    //     path: "/statistics/projectSet/workItem",
                    //     exact: false,
                    //     component: ProjectSetWorkItem,
                    //     key: "ProjectSetWorkItem"
                    // },
                    // {
                    //     path: "/statistics/projectSet/projectProgress",
                    //     exact: false,
                    //     component: ProjectOperateTable,
                    //     key: "projectSetProjectProgress"
                    // },
                    {
                        path: "/statistics/project/memberItem",
                        exact: false,
                        component: UserWorkItem,
                        key: "UserWorkItem"
                    },
                    {
                        path: "/statistics/workItem/newTrend",
                        exact: false,
                        component: NewWorkItemTrend,
                        key: "newTrend"
                    },
                    // {
                    //     path: "/statistics/workItem/completeTrend",
                    //     exact: false,
                    //     component: CompleteWorkItemTrend,
                    //     key: "completeTrend"
                    // },
                    // {
                    //     path: "/statistics/workItem/workItemTrend",
                    //     exact: false,
                    //     component: WorkItemTrend,
                    //     key: "workItemTrend"
                    // },
                    // {
                    //     path: "/statistics/workItem/overview",
                    //     exact: false,
                    //     component: WorkItemStatusSituation,
                    //     key: "workItemOverview"
                    // }

                ]
            },
            {
                path: "/todoList",
                exact: false,
                component: WorkTodoPage,
                key: "ProjectSet"

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
                    // { 隐藏字段类型
                    //     path: "/setting/fieldType",
                    //     component: ProjectProjectDirectory,
                    //     row: true,
                    //     exact: true
                    // },
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
                        path: "/setting/message",
                        component: SystemMessageContent,
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
                        path: "/setting/jiraLoadData",
                        component: JiraLoadData,
                        exact: true
                    },
                    {
                        path: "/setting/mantisLoadData",
                        component: MantisLoadData,
                        exact: true
                    },
                    {
                        path: "/setting/openApi",
                        component: OpenApiPages,
                        key:'OpenApiPages',
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
                        component: StageList,
                    },
                    {
                        path: "/project/:id/stageDetail/:stage",
                        component: StageDetail,
                        routes: [
                            {
                                path: "/project/:id/stageDetail/:stage/workitem",
                                component: Work,
                            },
                            {
                                path: "/project/:id/stageDetail/:stage/workitem/:workId",
                                component: WorkDetailPage,
                            },
                            {
                                path: "/project/:id/stageDetail/:stage/workDetail",
                                component: WorkTableDetail,
                            },
                            {
                                path: "/project/:id/stageDetail/:stage/overview",
                                component: StageSurvey,
                            },
                        ]
                    },
                    {
                        path: "/project/:id/sprint",
                        component: Sprint

                    },
                    {
                        path: "/project/:id/sprintDetail/:sprint",
                        component: SprintHome,
                        routes: [
                            {
                                path: "/project/:id/sprintDetail/:sprint/statistics",
                                component: SprintStatistics,
                                routes: [
                                    {
                                        path: "/project/:id/sprintDetail/:sprint/statistics/overview",
                                        component: ProjectStatisticsOverview,
                                        exact: true
                                    },
                                    {
                                        path: "/project/:id/sprintDetail/:sprint/statistics/workItem",
                                        component: StatisticsWork,
                                        exact: true
                                    }
                                ]
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/workitem",
                                component: Work,
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/workitem/:workId",
                                component: WorkDetailPage,
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/workDetail",
                                component: WorkTableDetail,
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/overview",
                                component: Sprintsurvey,
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/plan",
                                component: SprintPlan,
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/setting",
                                component: SprintBasicInfo,
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/dynamic",
                                exact: false,
                                component: Dynamic
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/workTodo",
                                exact: false,
                                component: TodoList
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/workList",
                                component: WorkList,
                            },

                            {
                                path: "/project/:id/sprintDetail/:sprint/workGantt",
                                component: WorkGantt,
                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/workTable",
                                component: WorkTable,

                            },
                            {
                                path: "/project/:id/sprintDetail/:sprint/workBodar",
                                component: WorkBodar,
                            }
                        ]
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
                        path: "/project/:id/versionDetail/:version",
                        component: VersionHome,
                        routes: [
                            {
                                path: "/project/:id/versionDetail/:version/work/:workId",
                                component: WorkDetailPage,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/workDetail",
                                component: WorkTableDetail,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/overview",
                                component: Versionsurvey,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/plan",
                                component: VersionWorkItemPlan,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/setting",
                                component: VersionBasicInfo,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/dynamic",
                                component: Dynamic
                            },
                            {
                                path: "/project/:id/versionDetail/:version/workitem",
                                component: Work,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/workList",
                                component: WorkList,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/workGantt",
                                component: WorkGantt,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/workTable",
                                component: WorkTable,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/workBodar",
                                component: WorkBodar,
                            },
                            {
                                path: "/project/:id/versionDetail/:version/workTodo",
                                component: TodoList,
                            },
                        ]
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
                        path: "/project/:id/planning",
                        component: Planning,
                    },
                    {
                        path: "/project/:id/plan",
                        component: Plan,
                    },
                    {
                        path: "/project/:id/workTodo",
                        component: TodoList,
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
                                path: "/project/:id/statistics/overview",
                                component: ProjectStatisticsOverview,
                                exact: true
                            },
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
                                path: "/project/:id/set/integration",
                                exact: true,
                                component: IntegrationContent
                            },
                            {
                                path: "/project/:id/set/integration/sward",
                                component: IntegrationBindSward
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

                    {
                        path: "/project/:id/noAccess",
                        exact: true,
                        component: ProjectNoAccessPage
                    },
                    // {
                    //     path: "/project/:id/appraised/:appraised",
                    //     component: AppraisedItem,
                    // },
                    // {
                    //     path: "/project/:id/appraised/:appraised/:workId",
                    //     component: WorkDetailPage,
                    // },
                    {
                        path: "/project/:id/appraised",
                        component: Appraised,
                    },
                    {
                        path: "/project/:id/testcase",
                        component: TestCaseTableMain,
                        routes: [
                            {
                                path: "/project/:id/testcase/caseDetail",
                                component: TestCaseTableLayout,
                                routes: [
                                    {
                                        path: "/project/:id/testcase/caseDetail/info",
                                        exact: true,
                                        component: TestCaseTable,
                                    },
                                    {
                                        path: "/project/:id/testcase/caseDetail/function/:caseId",
                                        exact: true,
                                        component: FunctionContentListView,
                                    },
                                ]
                            },

                            {
                                path: "/project/:id/testcase/testplan",
                                exact: true,
                                component:TestPlan,
                            },
                            {
                                path: "/project/:id/testcase/planDetail",
                                component:PlanDetailContent,
                                routes: [
                                    {
                                        path: "/project/:id/testcase/planDetail/case",
                                        exact: true,
                                        component: TestPlanBindCaseList,
                                    },
                                    {
                                        path: "/project/:id/testcase/planDetail/functionTestInstance",
                                        exact: true,
                                        component: FunctionTestInstance,
                                    },
                                    //
                                    {
                                        path: "/project/:id/testcase/planDetail/defect",
                                        exact: true,
                                        component: PlanDefect
                                    },
                                    {
                                        path: "/project/:id/testcase/planDetail/report",
                                        exact: true,
                                        component: PlanReportPage
                                    },
                                    {
                                        path: "/project/:id/testcase/planDetail/reportDetail",
                                        exact: true,
                                        component: PlanReportDetail
                                    },
                                    // {
                                    //     path: "/project/:id/testcase/planDetail/reportInfo",
                                    //     exact: true,
                                    //     component: PlanReportInstanceDetail,
                                    // },
                                ]
                            },
                        ]
                    },


                ]
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
                        component: TodoList,
                        key: "ProjectSetSurvey"
                    },
                    {
                        path: "/projectSet/:projectSetId/project",
                        exact: false,
                        component: ProjectSetProjectList,
                        key: "ProjectSetProjectList"
                    },
                    {
                        path: "/projectSet/:projectSetId/workitem",
                        exact: false,
                        component: Work,
                        key: "ProjectSetWorkItem"
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
                                path: "/projectSet/:projectSetId/statistics/overview",
                                component: ProjectStatisticsOverview,
                                exact: true
                            },
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
                path: "/product/:productId",
                exact: false,
                component: ProductDetail,
                key: "ProductDetail",
                routes: [
                    {
                        path: "/product/:productId/project",
                        exact: false,
                        component: ProductProjectList,
                        key: "ProductProjectList"
                    },
                    {
                        path: "/product/:productId/module",
                        exact: false,
                        component: ProductModule,
                        key: "ProductModule"
                    },
                    {
                        path: "/product/:productId/linemap",
                        exact: false,
                        component: ProductLineMap,
                        key: "ProductLineMap"
                    },
                    {
                        path: "/product/:productId/workitem",
                        exact: false,
                        component: Work,
                        key: "ProductWork"
                    },
                    {
                        path: "/product/:productId/set",
                        exact: false,
                        component: ProductSet,
                        key: "ProductDetailAdide",
                        routes: [
                            {
                                path: "/product/:productId/set/basicInfo",
                                exact: false,
                                component: ProductBasicInfo,
                                key: "ProductBasicInfo"
                            },
                            {
                                path: "/product/:productId/set/dominRole",
                                exact: false,
                                component: ProductDomainRole,
                                key: "ProductDomainRole"
                            },
                            {
                                path: "/product/:productId/set/user",
                                exact: false,
                                component: ProductUser,
                                key: "ProductUser"
                            },
                            {
                                exact: false,
                                path: "/product/:productId/set/noaccess",
                                component: NoAccessPage,
                                key: "ProjectSetNoaccess"
                            },
                        ]
                    },
                    // {
                    //     path: "/product/:productId/set/basicInfo",
                    //     exact: false,
                    //     component: ProductBasicInfo,
                    //     key: "ProductBasicInfo"
                    // },
                    {
                        path: "/product/:productId/plan",
                        exact: false,
                        component: ProductPlanList,
                        key: "ProductPlanList"
                    },
                    {
                        path: "/product/:productId/planDetail/:productPlanId",
                        component: ProductPlanLayout,
                        routes: [
                            {
                                path: "/product/:productId/planDetail/:productPlanId/type/:workTypeCode",
                                exact: false,
                                component: Work,
                                key: "ProductPlanDemand"
                            },
                            // {
                            //     path: "/product/:productId/planDetail/:productPlanId/defect",
                            //     exact: false,
                            //     component: Work,
                            //     key: "ProductPlanDefect"
                            // },
                        ]
                    },
                ]
            },

            // {
            //     path: "/:id/sprint/:sprint",
            //     component: SprintHome,
            //     routes: [
            //         {
            //             path: "/:id/sprint/:sprint/statistics",
            //             component: SprintStatistics,
            //             routes: [
            //                 {
            //                     path: "/:id/sprint/:sprint/statistics/overview",
            //                     component: ProjectStatisticsOverview,
            //                     exact: true
            //                 },
            //                 {
            //                     path: "/:id/sprint/:sprint/statistics/workItem",
            //                     component: StatisticsWork,
            //                     exact: true
            //                 }
            //             ]
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/workitem",
            //             component: Work,
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/work/:workId",
            //             component: WorkDetailPage,
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/workDetail",
            //             component: WorkTableDetail,
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/overview",
            //             component: Sprintsurvey,
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/plan",
            //             component: SprintPlan,
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/setting",
            //             component: SprintBasicInfo,
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/dynamic",
            //             exact: false,
            //             component: Dynamic
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/workTodo",
            //             exact: false,
            //             component: TodoList
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/workList",
            //             component: WorkList,
            //         },
            //
            //         {
            //             path: "/:id/sprint/:sprint/workGantt",
            //             component: WorkGantt,
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/workTable",
            //             component: WorkTable,
            //
            //         },
            //         {
            //             path: "/:id/sprint/:sprint/workBodar",
            //             component: WorkBodar,
            //         }
            //     ]
            // },

            // {
            //     path: "/:id/version/:version",
            //     component: VersionHome,
            //     routes: [
            //         {
            //             path: "/:id/version/:version/work/:workId",
            //             component: WorkDetailPage,
            //         },
            //         {
            //             path: "/:id/version/:version/workDetail",
            //             component: WorkTableDetail,
            //         },
            //         {
            //             path: "/:id/version/:version/overview",
            //             component: Versionsurvey,
            //         },
            //         {
            //             path: "/:id/version/:version/plan",
            //             component: VersionWorkItemPlan,
            //         },
            //         {
            //             path: "/:id/version/:version/setting",
            //             component: VersionBasicInfo,
            //         },
            //         {
            //             path: "/:id/version/:version/dynamic",
            //             component: Dynamic
            //         },
            //         {
            //             path: "/:id/version/:version/workitem",
            //             component: Work,
            //         },
            //         {
            //             path: "/:id/version/:version/workList",
            //             component: WorkList,
            //         },
            //         {
            //             path: "/:id/version/:version/workGantt",
            //             component: WorkGantt,
            //         },
            //         {
            //             path: "/:id/version/:version/workTable",
            //             component: WorkTable,
            //         },
            //         {
            //             path: "/:id/version/:version/workBodar",
            //             component: WorkBodar,
            //         },
            //         {
            //             path: "/:id/version/:version/workTodo",
            //             component: TodoList,
            //         },
            //     ]
            // },
            // {
            //     path: "/:id/appraised/:appraised",
            //     component: AppraisedHome,
            //     routes: [
            //         {
            //             path: "/:id/appraised/:appraised/workitem",
            //             component: AppraisedWorkItem,
            //         },
            //         ]
            // },
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
            // {
            //     path: "/projectAdd",
            //     exact: true,
            //     component: ProjectAdd,
            //     key: 'project'
            //
            // },
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
            // {
            //     path: "/projectSetAdd",
            //     exact: false,
            //     component: ProjectSetAdd,
            //     key: "ProjectSet"
            // },

            {
                path: "/product",
                exact: false,
                component: Product,
                key: "Product",
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
    },
    // {
    //     path: "/",
    //     component: () => <Redirect to="/index/overview" />,
    //     exact: true,
    // }


]
export default Routers;

