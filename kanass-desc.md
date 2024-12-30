<!--
 * @Author: 袁婕轩
 * @Date: 2024-12-27 10:28:48
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-30 10:47:59
 * @Description: 
-->
# 目录说明

# home

首页

# common

## component

| 文件      | 说明                         |
|--------- | ---------------------------- |
| DynamicList| 动态列表页面,从迭代，版本，项目概况跳入           |
| FirstMenu | 一级导航组件           |
| FirstMenuButtom   | 一级导航组件底部 |
| FirstMoreMenuModal   | 一级导航组件更多菜单弹窗|
| HomePage   | 首页入口|
| HomeSurvey   | 首页概况|
| Layout   | 通用版本入口|
| LayoutCe   | ce,ee版本入口|
| Logo   | 首页logo组件|
| MessageList| 消息组件|
| ProjectStatusNum| 首页概况页面项目统计|
| SetingMenu| 首页设置组件|
| TodoPage| 待办页面|
| TodoPageList| 待办列表|
| TodoStatistics| 概况待办事项统计|
| WorkItemSurvey| 首页概况页面事项概况统计图标|
| WorkItemTrend| 首页概况页面事项趋势统计图标|

## insight 仪表盘

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| EndWorkItemTrend      | 完成事项趋势               |
| Insight | 仪表盘入口       |
| InsightList  | 仪表盘列表                 |
| NewWorkItemTrend   | 新增事项趋势|
| ProjectOperateTable  | 项目的事项进展 |
| ProjectSetMember  | 项目集的项目成员对比|
| ProjectSetWorkItem  | 项目集的项目事项对比|
| ReportItem  | 渲染报表|
| ReportList  | 仪表盘列表|
| ViewInsight  | 仪表盘查看视图|
| WorkItemStatusSituation  | 项目的事项进展概况统计|
| WorkItemTrend  | 新增事项趋势|

## search 搜索

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| Search      | 全局搜索框加弹窗               |
| SearchResult  | 全局搜索结果页              |


## login 登录退出模块

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ExcludeProductUserPage  | 用户没有应用访问权限     |
| ProjectLogin  | 登录     |
| LoginRpwContent  | 修改密码     |
| NoFoundPage  | 用户没有经过产品授权登录的页面     |
| ProjectNoAccessPage  | 用户没有资源访问权限     |
| SysExceptionContent  | 系统异常     |
| SystemNoAccessPage  | 没有资源访问权限     |


## Project 项目管理
### common 项目管理公共模块

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| MoreMenuModel  | 项目的更多菜单弹窗     |
| ProjectChangeModal  | 项目切换弹窗|
| ProjectDetailAside  | 项目详情页面左侧导航栏|
| ProjectLayout  | 项目详情页|
| SetMenu  | 项目详情页面左侧导航设置按钮|

### lineMap 路线图

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| CoLScroll  | 路线图竖向滚动轴组件|
| EpicAddModal  | 需求池添加弹窗|
| EpicLineMap  | 需求池路线图组件|
| EpicPage  | 需求池路线起页面|
| Linemap  | 路线图入口页面|
| RowScroll  | 路线图横向向滚动轴组件|
| SprintLineMap  | 迭代路线图组件|
| SprintPage  | 迭代路线图页面|
| VersionLineMap  | 版本路线图组件|
| VersionPage  | 版本路线图页面|


### milestone 里程碑

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| MilestoneAddEditModal  | 添加、编辑里程碑弹窗|
| MilestoneList  | 里程碑列表|
| MilestoneTimeline  | 里程碑时间轴组件|

###overview 项目概况

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| DyncmicTimeAxis  | 动态时间轴组件|
| ProjectTodoStatistics  | 待办统计组件|
| Survey  | 项目概况|

### project 项目列表模块

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| Project  | 项目列表|
| ProjectAdd  | 项目添加页面|
| ProjectAddInfo  | 项目添加详情组件|
| ProjectFilterQuick  | 项目快捷筛选组件|
| ProjectGide  | 无项目时引导界面|
| ProjectList  | 项目列表组件|


### setting 项目信息页面

#### basicInfo 项目信息页面
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| BasicInfo  | 项目信息页面|
| ProjectIconChange  | 项目图标上传弹窗|

#### common 项目设置页面

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectScrumSet  | 项目设置页面|
| ProjectScrumSetAside  | 项目详情页面左侧导航栏|

#### module 模块

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ModuleAddModal  | 添加模块弹窗|
| ModuleList  | 模块列表|

#### privilege 迭代

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectDomainRole  | 项目权限|


#### projectFlow 项目流程

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectFlow  | 项目流程|
| ProjectFlowDetailDesign  | 项目流程设计页面|

#### projectForm 项目表单

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectForm  | 项目表单页面|
| ProjectFormDetail  | 项目表单设计页面|

#### projectMessage 项目消息

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| DomainMessageNoticeContent  | 项目消息设置方案|

#### projectWorkType 项目事项类型

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectWorkRoleFunction  | 角色的事项权限分配页面|
| ProjectWorkRoleList  | 事项权限列表|
| WorkType  | 事项类型列表|
| WorkTypeAddModal  | 添加事项类型弹窗|


#### user 项目内的成员

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| User  | 项目内的成员列表|


### sprint 迭代

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| SprintAddModal  | 添加迭代弹窗|
| SprintList  | 迭代列表|
| SprintPlan  | 迭代规划事项页面|

### stage 阶段

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ColScroll  | 计划路线图竖向滚动轴组件|
| RowScroll  | 计划路线图横向滚动轴组件|
| Stage  | 计划页面|
| StageAddModal  | 计划添加弹窗|
| StageEditModal  | 计划编辑弹窗|
| StageListTreeChange  | 计划和事项的树状结构的增删改查之后的数据处理|

### statistics 项目统计

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectStatistics  | 项目统计页面|
| ProjectStatisticsAside  | 项目统计页面左侧导航栏|

### test 测试用例

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| TestRepository  | 用例库列表页|
| TestRepositoryAdd  | 用例库添加弹窗|

### version 版本

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| VersionTable  | 版本列表页|
| VersionAdd  | 版本添加，编辑弹窗|

### wiki 知识库

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| Wiki  | 知识库列表页|
| WikiAdd  | 知识库添加，编辑弹窗|  

### workLog 事项工时

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| LogAdd  | 工时添加|
| LogContent  | 工时列表页面| 
| LogDetail  | 工时详情抽屉|
| LogFilter  | 工时筛选组件|


## projectSet 项目集

### common
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectSetChangeModal  | 项目集切换弹窗|
| ProjectSetDetailAside  | 项目集详情页面左侧导航栏|
| ProjectSetLayout  | 项目集详情入口|
| ProjectSetSetButton  | 项目集设置按钮|

### overview 项目集概况

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectSetSurvey  | 项目集概况|

### projectList 项目集列表

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectSetProjectList  | 项目集关联的项目|
| ProjectSetRelevance  | 项目集关联的项目弹窗|

### projectSet 项目集关联

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectSet  | 项目集入口|
| ProjectSetAdd  | 项目集添加弹窗|
| ProjectSetAddInfo  | 项目集添加详细信息|
| ProjectSetGide  | 没有项目集数据的引导|
| ProjectSetTable  | 项目集列表组件|

### setting 项目集设置

#### basicInfo 项目集信息
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ChangeProjectSetIcon  | 修改项目集icon，功能暂时屏蔽|
| ProjectSetBasicInfo  | 项目集信息展示与修改页面|

#### common 项目集设置页面公共组件

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectSetting  | 项目集设置页面|
| ProjectSetSettingDetailAside  | 项目集设计页面页面左侧导航栏|

### statistics 项目集统计

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectSetStatistics  | 项目集统计页面|
| ProjectSetStatisticsAside  | 项目集统计页面左侧导航栏|

### user 项目集成员

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectSetDomainRole  | 项目集权限|
| ProjectSetUser  | 项目集成员|


## setting 设置


### backups 备份
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| backups  | 备份页面|

### common 设置页面公共组件

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectNotFond  | 404页面 |
| SetAside  | 系统设置导航|
| SetRouter  | 系统设置导航菜单|
| Setting  | 系统设置页面|

### flow 流程

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| FlowDetailDesign  | 流程设置页面|
| FlowDetailView  | 流程详情查看页面|
| ProjectFlowStatusList  | 流程节点，展示给用户|
| ProjectNodeStatusList  | 流程节点，内部初始化使用|
| ProjectSystemFlowList  | 流程列表，模板，用于初始化项目|
| ProjectSystemFlowListSystem  | 流程列表，模板，用于初始化项目，开发使用|


### form 表单

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectFormDetail  | 表单设计页面|
| ProjectFormDetailSystem  | 表单设计页面，开发使用|
| ProjectFormList  | 表单列表|
| ProjectFormListSystem  | 表单列表|
| ProjectPreliminaryList  | 表单字段列表 |
| ProjectPreliminaryListSystem  | 表单字段列表，开发使用|
| ProjectPreliminaryTypeList  | 字段类型列表|
| ProjectPreliminaryTypeListSys  | 字段类型列表，开发使用|
| ProjectProjectFormList  | 项目表单列表|

### log 日志

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| Log  | 日志页面|
| MyLogTemplateList  | 日志模版|
| ProjectLogTypeList  | 日志类型|

### message 消息

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectMessageNoticeContent  | 消息通知方案|
| SystemMessageNotice  | 系统消息通知方案|
| SystemMessageNoticeBase  | 系统消息通知方案，开发人员使用|
| SystemMessageSendType  | 项目消息发送方式|
| SystemMessageTemplate  | 系统消息模版|
| SystemMessageType | 系统消息类型|


### orga 用户与部门
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| Orga  | 组织|
| User  | 用户|

###  privilege 权限

| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectFeature  | 项目功能点|
| ProjectRole  | 项目权限角色|
| SystemFeature  | 系统功能点|
| SystemRole  | 系统权限角色|
| SystemRoleBuilt  | 系统权限角色，开发使用|

###  projectType 项目类型
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectType  | 项目类型 |
| ProjectTypeAddModal  | 项目类型添加弹窗|


###  systemIntegration 系统集成
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| JiraLoadData  | JIAR 导入 |
| UrlAddData  | sward, testHubo 地址添加弹窗 |
| UrlData  |  sward, testHubo 地址列表 |

### todo 待办
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| MyTodoTask  | 我的待办列表 |
| TaskList  | 全部待办列表 |
| TodoTempList  |  待办模版 |
| TodoTypeList  |  待办类型 |

### user 成员
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ProjectDirectory  | 用户目录 |
| ProjectSystemUserGroup  | 用户组，开发使用 |
| ProjectUserGroup  |  用户组 |
| ProjectVirtualRoleList  |  虚拟角色 |

### version 应用
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| Product  | 应用访问权限 |
| ProjectFeature  | 产品特性 |
| Version|版本与许可证|


### workPrivilege 事项权限
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| WorkFieldPrivilege  | 角色事项的字段权限 |
| WorkFunctionAddModal  | 事项功能权限添加弹窗 |
| WorkFunctionList  | 事项功能权限列表 |
| WorkFunctionPrivilege  | 角色的事项功能权限 |
| WorkRoleFunction  | 角色事项权限入口 |
| WorkRoleList  | 角色列表 |

### workSeting 事项设置 
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| WorkPriority  | 事项优先级|
| WorkPriorityAddModal  | 事项优先级添加弹窗|
| WorkTypeAddModal  | 事项状态列表|
| WorkTypeFlow  | 流程列表|
| WorkTypeForm  | 表单列表|
| WorkTypeList  | 事项类型列表|
| WorkTypeListSystem  | 事项类型列表，开发使用|


## sprint 迭代

### common 
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| SprintChangeModal  | 切换迭代弹窗|
| SprintDetailAside  | 迭代详情左侧导航|
| SprintLayout  | 迭代详情入口|

### overview 迭代概况
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| SprintEndState  | 迭代转为完成状态的弹窗|
| SprintStartState  | 迭代转为开始状态的弹窗|
| SprintSurvey  | 迭代概况|

### plan 迭代规划
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| SprintPlan  | 迭代规划事项|

### setting 迭代设置
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| SprintBasicInfo  | 迭代设置页面|

### statistics 迭代统计
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| SprintStatistics  | 迭代统计页面|
| SprintStatisticsAside  | 迭代统计页面左侧导航栏|

## statistics 统计

### overview 统计概况
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| exportPDF  | 导出pdf|
| StatisticsAsicde  | 统计左侧导航|
| StatisticsFree  | 付费功能提示界面 |
| StatisticsStatusWork  | 根据事项字段统计事项|

## version 版本

### common 版本公共组件
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| VersionChangeModal  | 切换版本弹窗|
| VersionDetailAside  | 版本详情左侧导航|
| VersionLayout  | 版本详情入口|   

### overview 版本概况
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| VersionEndState  | 版本转为完成状态的弹窗|
| VersionStartState  | 版本转为开始状态的弹窗|
| VersionSurvey  | 版本概况|

### plan 版本规划
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| VersionPlan  | 版本规划事项|

### setting 版本设置
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| VersionBasicInfo  | 版本设置页面|

## work
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| ColScroll  | 路线图竖向滚动轴|
| GanttTest | 甘特图，测试用|
| RowScroll  | 路线图横向滚动轴|
| Work  | 事项页面|
| WorkAddModel  | 事项添加弹窗|
| WorkAddPage  | 事项添加信息页面|
| WorkAside  | 详情页面事项列表|
| WorkBasicInfoDefect  | 缺陷事项详情页面|
| WorkBasicInfoDemand  | 需求事项详情页面|
| WorkBasicInfoNomal  | 自定义事项详情页面|
| WorkBasicInfoTask  | 任务事项详情页面|
| WorkBodar  | 看板事项页面|
| WorkChild  | 子事项|
| WorkChildAdd  | 添加子事项|
| WorkComment  | 事项评论|
| workCreatDropdown  | 创建事项下拉选择框|
| WorkDeleteSelectModal  | 删除事项下拉框|
| WorkDetail  | 事项详情|
| WorkDetailBottom  | 事项详情tab 部分|
| WorkDetailCrumb  | 事项详情面包屑|
| WorkDetailDrawer  | 事项详情抽屉|
| WorkDetailPage  | 事项详情页面，用于事项详情视图|
| WorkDetailSprintSelect  | 事项详情的迭代选择下拉框|
| WorkDetailVersionSelect  | 事项详情页面的版本选择下拉框|
| WorkDocumentAdd  | 事项详情页面的文档选择|
| WorkDocumentList  | 事项详情页面的文档列表|
| WorkDynamic  | 事项详情页面的动态tab页|
| WorkFilterHigh  | 事项详情页面的高级筛选组件|
| WorkFilterHighItem  | 事项详情页面的高级筛选组件的单个筛选条件|
| WorkFilterMaster  | 事项详情页面的负责人筛选组件|
| WorkFilterModal  | 事项详情页面的筛选按钮|
| WorkFilterProject  | 事项详情页面的项目筛选组件|
| WorkFilterQuick  | 事项详情页面的快捷筛选组件|
| WorkFilterType  | 事项详情页面的类型筛选组件|
| WorkGantt  | 事项详情页面的甘特图组件|
| WorkGanttFree  | 事项详情页面的甘特图演示组件|
| WorkList  | 事项列表详情视图|
| WorkListFilter  | 事项列表筛选组件|
| WorkListHead  | 事项列表视图顶部组件|
| WorkLog  | 事项工时记录|
| WorkPrivilegeComponent  | 事项权限组件|
| WorkRelation  | 事项关联|
| WorkRelationAdd  | 添加关联事项弹窗|
| WorkSort  | 事项排序组件|
| WorkTable  | 事项列表页面|
| WorkTableColumn  | 事项列表列|
| WorkTableDetail  | 事项详情抽屉|
| WorkTableFilter  | 事项列表页面，甘特图页面，看板页面顶部的筛选|
| WorkTableHead  | 事项列表页面，甘特图页面，看板页面顶部|
| WorkTestCaseAdd  | 事项添加测试用例|
| WorkTestCaseList  | 测试用例列表|
| WorkTypeTab  | 事项类型筛选tab|


## workLog
### components 工时记录公共组件
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| Log  | 日志页面|
| LogAside  | 日志侧边栏|
| LogStatisticsFree  | 工时统计演示页面|

### logView 工时记录视图
| 文件            | 说明                         |
| --------------- | ---------------------------- |
| LogAdd  | 工时添加|
| LogAllList  | 工时列表|
| LogDetail  | 工时详情抽屉|
| LogFilter  | 工时筛选组件|

