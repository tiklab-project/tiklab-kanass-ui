
import HomeStore from "./home/common/store/HomeStore"
import AsyncComponent from './common/lazy/AsyncComponent'
const Search = AsyncComponent(() => import('./home/Search/components/Search'))

const Login = AsyncComponent(() => import('./login/Login'))
const VailProductUserPage =  AsyncComponent(() => import('./login/VaildProductUserPage'))
const ProjectLogOut = AsyncComponent(() => import('./login/Logout'))
const ProjectNotFound = AsyncComponent(() => import("./setting/common/components/ProjectNotFond"))

const ProjectProjectDirectorySys = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeListSys'))
const ProjectProjectDirectory = AsyncComponent(() => import('./setting/form/ProjectPreliminaryTypeList'))
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
const FlowDetailView = AsyncComponent(() => import('./setting/flow/FlowDetailView'))    
const FlowDetailDesign = AsyncComponent(() => import('./setting/flow/FlowDetailDesign'))
const ProjectNodeStatusList = AsyncComponent(() => import('./setting/flow/ProjectNodeStatusList'))
// 状态组件

// 消息
const ProjectMessageSendType = AsyncComponent(() => import('./setting/message/ProjectMessageSendType'))
const ProjectMessageType = AsyncComponent(() => import('./setting/message/ProjectMessageType'))
const ProjectMessageTemplate = AsyncComponent(() => import('./setting/message/ProjectMessageTemplate'))
const ProjectMessageManagement = AsyncComponent(() => import('./setting/message/ProjectMessageManagement'))
const ProjectMessageNotice = AsyncComponent(() => import('./setting/message/ProjectMessageNotice'))
const ProjectMessageNoticeSystem = AsyncComponent(() => import('./setting/message/ProjectMessageNoticeSystem'))

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
const ProjectAdd = AsyncComponent(() => import('./project/project/components/ProjectAdd'))
const ProjectDetail = AsyncComponent(() => import('./project/common/components/ProjectScrumLayout'))
const ProjectScrumSetDetail = AsyncComponent(() => import('./project/setting/common/components/ProjectScrumSet'))
const ProjectWorkType = AsyncComponent(() => import('./project/setting/projectWorkType/components/WorkType'))
const ProjectFlowList = AsyncComponent(() => import('./project/setting/projectFlow/ProjectFlow'))
const ProjectFormList = AsyncComponent(() => import('./project/setting/projectForm/ProjectForm'))
const ProjectFormDetail = AsyncComponent(() => import('./project/setting/projectForm/ProjectFormDetail'))

const Survey = AsyncComponent(() => import('./project/overview/components/Survey'))
const Sprint = AsyncComponent(() => import('./project/sprint/components/SprintList'))
const WikiRepository = AsyncComponent(() => import('./project/wiki/components/WikiRepository'))
const TestRepository = AsyncComponent(() => import('./project/test/components/TestRepository'))
const PlanSprint = AsyncComponent(() => import('./project/sprint/components/SprintPlan'))
const ProjectLog = AsyncComponent(() => import("./project/workLog/components/LogContent"))
const Work = AsyncComponent(() => import('./work/components/Work'))
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
const StatisticsWork = AsyncComponent(()=> import('./statistics/components/StatisticsStatusWork'))
const StatisticsMore = AsyncComponent(() => import('./statistics/components/StatisticsMore'))


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

export {
    Login,
    ProjectLogOut,
    HomeStore,
    Search,
    VailProductUserPage,
    ProjectNotFound,
    ProjectProjectDirectorySys,
    ProjectProjectDirectory,
    ProjectPreliminaryListSystem,
    ProjectPreliminaryList,
    FormList,
    FormListSystem,
    ProjectProjectFormList,
    FormDetail,
    ProjectSystemFlowList,
    ProjectSystemFlowListSystem,
    ProjectFlowStatusList,
    FlowDetailView,
    FlowDetailDesign,
    ProjectNodeStatusList,
    ProjectMessageSendType,
    ProjectMessageType,
    ProjectMessageTemplate,
    ProjectMessageManagement,
    ProjectMessageNotice,
    ProjectMessageNoticeSystem,
    WorkTypeList,
    WorkTypeSystem,
    workPriority,
    WorkTypeFlow,
    WorkTypeForm,
    ProjectType,
    ProjectPlugin,
    SystemFeature,
    SystemRoleBuilt,
    SystemRole,
    ProjectFeature,
    ProjectRole,
    OrgaContent,
    OrgaUser,
    ProjectDirectory,
    ProjectUserGroup,
    ProjectSystemUserGroup,
    Index,
    HomePage,
    HomeSurvey,
    WorkAll,
    Dynamic,
    WorkTodo,
    Project,
    ProjectAdd,
    ProjectDetail,
    ProjectScrumSetDetail,
    ProjectWorkType,
    ProjectFlowList,
    ProjectFormList,
    ProjectFormDetail,
    Survey,
    Sprint,
    WikiRepository,
    TestRepository,
    PlanSprint,
    ProjectLog,
    Work,
    WorkTableDetail,
    WorkDetailPage,
    Milestone,
    Linemap,
    Version,
    VersionDetail,
    VersionPlan,
    PrivilegeDomainUser,
    Plan,
    PlanWorkItem,
    Module,
    BasicInfo,
    ProjectDomainRole,
    ProjectStatistics,
    StatisticsWork,
    StatisticsMore,
    WorkAddPage,
    SprintHome,
    Sprintsurvey,
    SprintPlan,
    SprintStatistics,
    SearchResult,
    ProjectSet,
    ProjectSetList,
    ProjectSetAdd,
    ProjectSetDetail,
    ProjectSetProjectList,
    ProjectSetSurvey,
    ProjectSetDomainRole,
    ProjectSetUser,
    ProjectSetSet,
    ProjectSetBasicInfo,
    ProjectWorkStatistics,
    LoadData,
    UrlData,
    InsightList,
    NewInsight,
    ViewInsight,
    TaskListContent,
    TodoTempListContent,
    MyTodoTaskContent,
    TodoTypeListContent,
    LogList,
    LogTemplateList,
    ProjectLogTypeList,
    EpicDetail,
    Stage,
    StageDetail
}