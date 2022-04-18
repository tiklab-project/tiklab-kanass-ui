/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-11 16:37:03
 */
import { createContext } from 'react';
import {LOGIN_STATUS, LoginStore} from 'doublekit-portal-ui'
import {PLUGIN_STORE, PluginStore} from 'doublekit-plugin-ui'
import {HOME_STORE,HomeStore} from "./modules/home/store/home"
import {PRO_STORE,ProStore} from "./modules/project/project/store/projectStore";
import {MODULE_STORE, ModuleStore} from "./modules/projectSet/module/store/moduleStore";
import {SPRINT_STORE, SprintStore} from "./modules/project/sprint/store/sprintStore";
import {EDITION_STORE, VersionStore} from "./modules/project/version/store/versionStores";
import {EDITIONPLAN_STORE,VersionPlanStore} from "./modules/project/version/store/versionPlanStores";
import {AFFAIR_STORE, WorkStore} from "./modules/project/work/store/workStore";
import {ORGA_STORE,OrgaStore} from "./modules/sysmgr/workSeting/store/workStore";
import {PROJECTDETAIL_STORE,ProjectDetailStore} from "./modules/project/common/store/projectDetailStore";
import {STATISTICS_STORE,StatisticStore} from "./modules/project/statistics/store/statisticStore"
import {WORKLOG_STORE,WorkLogStore} from "./modules/project/work/store/workLogStore";
import {WORKDYNAMIC_STORE,WorkDynamicStore} from "./modules/project/work/store/workDynamicStore";
import {PROJECTYPE_STORE,ProjectTypeStore} from "./modules/sysmgr/projectType/store/projectTypestore";
import {WORKCALENDA_STORE,WorkCalendarStore} from "./modules/project/work/store/workCalendarStore";
// 每个迭代下的规划
import {SPRINTPLAN_STORE,SprintPlanStore} from "./modules/sprint/sprintPlan/stores/sprintPlanStores";
import {WORKRELATION_STORE,WorkRelation} from "./modules/project/work/store/workRelationStore";
import {WORKCHILD_STORE,WorkChild} from "./modules/project/work/store/workChildStore";
import {SEARCH_STORE,SearchStore} from "./modules/search/store/search";
import {PROGRAM_STORE, ProgramStore} from "./modules/program/store/programStore";
import {OVERALLSTORE_STORE, OverAllStore} from "./common/store/store";
import {LINEMAP_STORE, LineMapStore} from "./modules/project/lineMap/store/lineMapStore";
import {LOG_STORE,LogStore} from "./modules/log/store/logStore";
import {WORKWIKI_STORE,WorkWikiStore} from "./modules/project/work/store/workWikiStore";
import {PROJECTSURVEY_STORE,ProjectSurveyStore} from "./modules/project/survey/store/surveyStore";
import {WORKCOMMENT_STORE,WorkCommentStore} from "./modules/project/work/store/workCommentStore";

import {SPRINTSURVEY_STORE,SprintSurveyStore} from "./modules/sprint/sprintSurvey/store/sprintSurveyStore";
// 迭代下的统计
import {SPRINTSTATISTICS_STORE,SprintStatisticStore} from "./modules/sprint/sprintStatistics/store/statisticStore"
// 规划所有迭代事项
import {PLANSPRINT_STORE,ProjectSprintPlanStore} from "./modules/project/sprintPlan/stores/sprintPlanStores";
import {MILESTONE_STORE,MilestoneStore} from "./modules/project/milestone/store/milestoneStore";
import {PLAN_STORE,PlanStore} from "./modules/project/plan/store/planStores";
import {PLANWORKITEM_STORE,PlanWorkItemStore} from "./modules/project/plan/store/planWorkItemStores";
import {QYWX_STORE,QywxStore} from "./modules/qiyeWeixin/store/qywxStore"

function createStores() {
    return {
        [PRO_STORE]:new ProStore(),
        [MODULE_STORE]:new ModuleStore(),
        [SPRINT_STORE]:new SprintStore(),
        [AFFAIR_STORE]:new WorkStore(),
        [ORGA_STORE]:new OrgaStore(),
        [PROJECTDETAIL_STORE]: new ProjectDetailStore(),
        [STATISTICS_STORE]: new StatisticStore(),
        [WORKLOG_STORE]: new WorkLogStore(),
        [WORKDYNAMIC_STORE]: new WorkDynamicStore(),
        [PROJECTYPE_STORE]: new ProjectTypeStore(),
        [WORKCALENDA_STORE]: new WorkCalendarStore(),
        [EDITION_STORE]: new VersionStore(),
        [EDITIONPLAN_STORE]: new VersionPlanStore(),
        [PLAN_STORE]: new PlanStore(),
        [PLANWORKITEM_STORE]: new PlanWorkItemStore(),
        [SPRINTPLAN_STORE]: new SprintPlanStore(),

        [PLANSPRINT_STORE]: new ProjectSprintPlanStore(),
        [WORKRELATION_STORE]: new WorkRelation(),
        [WORKCHILD_STORE]: new WorkChild(),
        [SEARCH_STORE]: new SearchStore(),
        [PROGRAM_STORE]: new ProgramStore(),
        [OVERALLSTORE_STORE]: new OverAllStore(),
        [LINEMAP_STORE]: new LineMapStore(),
        [LOG_STORE]: new LogStore(),
        [WORKWIKI_STORE]: new WorkWikiStore(),
        [LOGIN_STATUS]: new LoginStore(),
        [HOME_STORE]: new HomeStore(),
        [PROJECTSURVEY_STORE]: new ProjectSurveyStore(),
        [WORKCOMMENT_STORE]: new WorkCommentStore(),
        [SPRINTSURVEY_STORE]: new SprintSurveyStore(),
        [MILESTONE_STORE]: new MilestoneStore(),
        [SPRINTSTATISTICS_STORE]: new SprintStatisticStore(),
        [PLUGIN_STORE]: new PluginStore(),

        [QYWX_STORE]: new QywxStore()
    };
}

const store = createStores();

const storeContext = createContext(store);

export {
    store,
    storeContext
}