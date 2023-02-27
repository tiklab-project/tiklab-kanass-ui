/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-05-28 15:09:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-26 11:44:17
 */

import {Layout,HomeStore,HOME_STORE } from "./home/containers/index";
import {Log,LogStore, LOG_STORE} from "./log/containers/index";
import {ProjectLogOut,ProjectLogin, Wechat} from "./login/containers/index";
import {ProjectSet,ProjectSetStore, PROGRAM_STORE } from "./projectSet/containers/index";
import {ProjectDetail,ProjectDetailStore, PROJECTDETAIL_STORE} from "./project/common/containers/index";
import {Linemap,LineMapStore,LINEMAP_STORE} from "./project/line-map/constainer/index";
import {Milestone,MilestoneStore,MILESTONE_STORE} from "./project/milestone/containers/index";
import {Plan,PlanStore,PLAN_STORE, PlanWorkItemStore,PLANWORKITEM_STORE } from "./project/plan/containers/index";

import {ProjectDomainRole} from "./project/privilege/index";
import {Project,ProjectStore, PRO_STORE} from "./project/project/containers/index";
import {Sprint,SprintStore, SPRINT_STORE} from "./project/sprint/containers/index";
import {SprintPlan,ProjectSprintPlanStore, PLANSPRINT_STORE} from "./project/sprint-plan/containers/index";
import {Statistics,StatisticStore, STATISTICS_STORE} from "./project/statistics/containers/index";
import {Survey,ProjectSurveyStore, PROJECTSURVEY_STORE} from "./project/survey/containers/index";

import {User} from "./project/user/index";
import {Version,VersionPlanStore, EDITIONPLAN_STORE,VersionStore, EDITION_STORE} from "./project/version/containers/index";
import {Work,WorkChild, WORKCHILD_STORE, WorkCommentStore, WORKCOMMENT_STORE, WorkDynamicStore, WORKDYNAMIC_STORE,
    WorkLogStore, WORKLOG_STORE,WorkRelation, WORKRELATION_STORE, WorkStore, AFFAIR_STORE, WorkWikiStore, WORKWIKI_STORE
} from "./project/work/containers/index";
import {BasicInfo} from "./project-set/basic-info/containers/index";
import {ProjectSetDetail} from "./project-set/common/containers/index";
import routesSaas from "./routersSaas";
import { store as projectStore } from "./stores";
export {
    Layout,
    HomeStore, 
    HOME_STORE,
    Log,
    LogStore,
    LOG_STORE,
    ProjectLogOut,
    ProjectLogin,
    Wechat,
    ProjectSet,
    PROGRAM_STORE,
    ProjectSetStore,
    ProjectDetail,
    PROJECTDETAIL_STORE,
    ProjectDetailStore,
    Linemap,
    LineMapStore,
    LINEMAP_STORE,
    Milestone,
    MilestoneStore,
    MILESTONE_STORE,
    Plan,
    PlanStore,
    PLAN_STORE,
    PlanWorkItemStore,
    PLANWORKITEM_STORE,
    ProjectDomainRole,
    Project,
    ProjectStore,
    PRO_STORE,
    Sprint,
    SprintStore, 
    SPRINT_STORE,
    SprintPlan,
    PLANSPRINT_STORE,
    ProjectSprintPlanStore,
    Statistics,
    StatisticStore,
    STATISTICS_STORE,
    Survey,
    ProjectSurveyStore, 
    PROJECTSURVEY_STORE,
    User,
    Version,
    VersionPlanStore, 
    EDITIONPLAN_STORE,
    VersionStore, 
    EDITION_STORE,
    Work,
    WorkChild, 
    WORKCHILD_STORE,
    WorkCommentStore, 
    WORKCOMMENT_STORE,
    WorkDynamicStore, 
    WORKDYNAMIC_STORE,
    WorkLogStore, 
    WORKLOG_STORE,
    WorkRelation, 
    WORKRELATION_STORE,
    WorkStore, 
    AFFAIR_STORE,
    WorkWikiStore, 
    WORKWIKI_STORE,
    BasicInfo,
    ProjectSetDetail,
    routesSaas,
    projectStore
}