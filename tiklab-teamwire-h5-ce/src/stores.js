/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-23 09:51:20
 */
import { createContext } from 'react';

import { PROJECT_STORE, ProjectStore } from "./modules/project/project/store/project";
import { PROJECTSURVEY_STORE, ProjectSurveyStore } from "./modules/project/survey/store/surveyStore";
import { WORKITEM_STORE, WorkItemStore } from "./modules/project/workItem/store/workItemStore";
import { SPRINT_STORE, SprintStore } from "./modules/project/sprint/store/sprintStore";
import { VERSION_STORE, VersionStore } from "./modules/project/version/store/versionStore";
import { MILESTONE_STORE, MilestoneStore } from "./modules/project/milestone/store/milestoneStore";
import { MODULE_STORE, ModuleStore } from "./modules/project/module/store/moduleStore";
import { PROJECTSET_STORE, ProjectSetStore } from "./modules/projectSet/store/projectSet";
import { LOG_STORE, LogStore } from "./modules/log/store/logStore";
import { STATISTICS_STORE, StatisticStore } from "./modules/project/statistics/store/statisticStore";
import { SYSTEMSET_STORE, SystemSetStore } from "./modules/systemSet/store/systemSet";
import {WORKLOG_STORE, WorkLogStore} from "./modules/project/workItem/store/workLogStore";
import {WORKRELATION_STORE, WorkRelation} from "./modules/project/workItem/store/workRelationStore";
import {WORKCHILD_STORE, WorkChild} from "./modules/project/workItem/store/workChildStore";
import {WORKCOMMENT_STORE, WorkCommentStore} from "./modules/project/workItem/store/workCommentStore";
import {WORKWIKI_STORE, WorkWikiStore} from "./modules/project/workItem/store/workWikiStore";
import {HOME_STORE, HomeStore} from "./modules/home/store/homeStore";

import { QYWX_STORE, QywxStore } from "./modules/qiyeWeixin/store/qywxStore";
import {SlateStore,SLATE_STORE} from "tiklab-slate-h5-ui";
function createStores() {
    return {
        [PROJECT_STORE]:new ProjectStore(),
        [PROJECTSURVEY_STORE]:new ProjectSurveyStore(),
        [WORKITEM_STORE]:new WorkItemStore(),
        [WORKLOG_STORE]:new WorkLogStore(),
        [WORKRELATION_STORE]:new WorkRelation(),
        [WORKCHILD_STORE]:new WorkChild(),
        [WORKCOMMENT_STORE]:new WorkCommentStore(),
        [WORKWIKI_STORE]: new WorkWikiStore(),
        [HOME_STORE]: new HomeStore(),

        [SPRINT_STORE]:new SprintStore(),
        [QYWX_STORE]:new QywxStore(),
        [VERSION_STORE]:new VersionStore(),
        [MILESTONE_STORE]:new MilestoneStore(),
        [MODULE_STORE]:new ModuleStore(),
        [PROJECTSET_STORE]:new ProjectSetStore(),
        [LOG_STORE]:new LogStore(),
        [STATISTICS_STORE]:new StatisticStore(),
        [SYSTEMSET_STORE]:new SystemSetStore(),
        [SLATE_STORE]:new SlateStore(),
    }
}

const store = createStores();

export default store;