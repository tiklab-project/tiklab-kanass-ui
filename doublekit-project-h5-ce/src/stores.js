/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-23 09:51:20
 */
import { createContext } from 'react';

import { PROJECT_STORE, ProjectStore } from "../src/modules/project/project/store/project";
import { PROJECTSURVEY_STORE, ProjectSurveyStore } from "../src/modules/project/survey/store/surveyStore";
import { WORKITEM_STORE, WorkItemStore } from "../src/modules/project/workItem/store/workItemStore";
import { SPRINT_STORE, SprintStore } from "../src/modules/project/sprint/store/sprintStore";
import { QYWX_STORE, QywxStore } from "../src/modules/qiyeWeixin/store/qywxStore";
import {LOGIN_STATUS,LoginStore} from "doublekit-portal-h5"
function createStores() {
    return {
        [PROJECT_STORE]:new ProjectStore(),
        [PROJECTSURVEY_STORE]:new ProjectSurveyStore(),
        [WORKITEM_STORE]:new WorkItemStore(),
        [SPRINT_STORE]:new SprintStore(),
        [LOGIN_STATUS]:new LoginStore(),
        [QYWX_STORE]:new QywxStore(),
    }
}

const store = createStores();

export default store;