/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-11 16:37:03
 */
import { createContext } from 'react';
import {EAM_STORE, EamStore} from 'tiklab-eam-ui/es/store'
import {HOME_STORE,HomeStore} from "./home/common/store/HomeStore"
//仪表盘
import {INSIGHT_STORE,InsightStore} from "./home/insight/store/InsightStore";
import {PRO_STORE,ProjectStore} from "./project/project/store/ProjectStore";
import {STATISTICS_STORE, StatisticsStore} from "./statistics/store/statisticStore";
import {SPRINT_STATISTICS_STORE, SprintStatisticStore} from "./sprint/statistics/store/SprintStatisticStore";
//需求集
import {EPIC_STORE,EpicStore} from "./project/lineMap/store/EpicStore";

import {MODULE_STORE, ModuleStore} from "./project/setting/module/store/ModuleStore";
import {SPRINT_STORE, SprintStore} from "./project/sprint/store/SprintStore";
import {EDITION_STORE, VersionStore} from "./project/version/store/VersionStores";
import {EDITIONPLAN_STORE,VersionPlanStore} from "./project/version/store/VersionPlanStores";
import {AFFAIR_STORE, WorkStore} from "./work/store/WorkStore";
import {ORGA_STORE,OrgaStore} from "./setting/workSeting/store/WorkSetingStore";
import {WORKLOG_STORE,WorkLogStore} from "./work/store/WorkLogStore";
import {PROJECTWORK_STORE,ProjectWorkStore} from "./project/setting/projectWorkType/store/ProjectWorkStore";

import {WORKDYNAMIC_STORE,WorkDynamicStore} from "./work/store/WorkDynamicStore";
import {PROJECTYPE_STORE,ProjectTypeStore} from "./setting/projectType/store/projectTypestore";
import {WORKCALENDA_STORE,WorkCalendarStore} from "./work/store/WorkCalendarStore";
// 每个迭代下的规划

import {WORKRELATION_STORE,WorkRelation} from "./work/store/WorkRelationStore";
import {WORKCHILD_STORE,WorkChild} from "./work/store/WorkChildStore";
import {SEARCH_STORE,SearchStore} from "./home/search/store/Search";
import {PROJECTSETPROJECT_STORE, ProjectSetProjectStore} from "./projectSet/projectList/store/ProjectSetProjectStore";
import {PROJECTSET_STORE, ProjectSetStore} from "./projectSet/projectSet/store/ProjectSetStore";

import {LINEMAP_STORE, LineMapStore} from "./project/lineMap/store/LineMapStore";
import {LOG_STORE,LogStore} from "./project/workLog/store/LogStore";
import {WORKWIKI_STORE,WorkWikiStore} from "./work/store/WorkWikiStore";
import {PROJECTSURVEY_STORE,ProjectSurveyStore} from "./project/overview/store/ProjectSurveyStore";
import {WORKCOMMENT_STORE,WorkCommentStore} from "./work/store/WorkCommentStore";

import {SPRINTSURVEY_STORE,SprintSurveyStore} from "./sprint/overview/store/sprintSurveyStore";
import {SPRINTPLAN_STORE,SprintPlanStore} from "./sprint/plan/stores/SprintPlanStore";
import {SPRINTDETAIL_STORE,SprintDetailStore } from "./sprint/common/store/sprintDetailStore"
// import {SPRINTPLAN_STORE,SprintPlanStore} from "./sprint/common/components/sprint";

// 规划所有迭代事项
import {PLANSPRINT_STORE,ProjectSprintPlanStore} from "./project/sprint/store/SprintPlanStore";
import {MILESTONE_STORE,MilestoneStore} from "./project/milestone/store/MilestoneStore";
import {PLAN_STORE,PlanStore} from "./project/plan/store/PlanStores";
import {PLANWORKITEM_STORE,PlanWorkItemStore} from "./project/plan/store/PlanWorkItemStores";
import {BASICINFO_STORE,BasicInfoStore} from "./projectSet/overview/store/basicInfoStore";


import {STAGE_STORE,StageStore} from "./project/stage/store/StageStore";

import {URLDATA_STORE, UrlDataStore} from "./setting/systemIntegration/store/UrlDataStore";

import {WIKIREPOSITORY_STORE, WikiRepositoryStore} from "./project/wiki/store/WikiRepositoryStore";

import {TESTREPOSITORY_STORE, TestRepositoryStore} from "./project/test/store/TestRepositoryStore";

import {WORKTEST_STORE, WorkTestStore} from "./work/store/WorkTestStore";
function createStores() {
    return {
        [PRO_STORE]:new ProjectStore(),
        [MODULE_STORE]:new ModuleStore(),
        [SPRINT_STORE]:new SprintStore(),
        [AFFAIR_STORE]:new WorkStore(),
        [ORGA_STORE]:new OrgaStore(),
        [STATISTICS_STORE]:new StatisticsStore(),
        [SPRINT_STATISTICS_STORE]:new SprintStatisticStore(),

        [WORKLOG_STORE]: new WorkLogStore(),
        [PROJECTWORK_STORE]: new ProjectWorkStore(),

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

        [PROJECTSET_STORE]: new ProjectSetStore(),
        [PROJECTSETPROJECT_STORE]: new ProjectSetProjectStore(),

        [LINEMAP_STORE]: new LineMapStore(),
        [LOG_STORE]: new LogStore(),
        [WORKWIKI_STORE]: new WorkWikiStore(),
        [EAM_STORE]: new EamStore(),
        [HOME_STORE]: new HomeStore(),
        [PROJECTSURVEY_STORE]: new ProjectSurveyStore(),
        [WORKCOMMENT_STORE]: new WorkCommentStore(),
        [SPRINTSURVEY_STORE]: new SprintSurveyStore(),
        [MILESTONE_STORE]: new MilestoneStore(),
        [SPRINTDETAIL_STORE]: new SprintDetailStore(),
        
        // [SLATE_STORE]:new SlateStore(),
        [BASICINFO_STORE]:new BasicInfoStore(),

        [INSIGHT_STORE]: new InsightStore(),

        [EPIC_STORE]: new EpicStore(),
        [STAGE_STORE]: new StageStore(),
        [URLDATA_STORE]: new UrlDataStore(),
        [WIKIREPOSITORY_STORE]: new WikiRepositoryStore(),
        [TESTREPOSITORY_STORE]: new TestRepositoryStore(),
        [WORKTEST_STORE]: new  WorkTestStore()
        
    };
}

const store = createStores();

const storeContext = createContext(store);

export {
    store,
    storeContext
}