/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-05-28 15:09:43
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-26 11:44:17
 */
import {orgStores} from "doublekit-user-ui";
import {privilegeStores} from 'doublekit-privilege-ui'
import {stores as portalStores} from 'doublekit-portal-ui'
import {formStores} from 'doublekit-form-ui'
import {flowStores} from 'doublekit-flow-ui'
import {messageModuleStores} from 'doublekit-message-ui'
import orgaRouter from "./module/modules/sysmgr/common/components/orgaRouter"
import projectRoutes from "./module/routers";
import projectSaasRoutes from "./module/routersSaas"
import {store} from "./module/stores"
import resources from './module/common/language/resources';
import Search from "./module/modules/search/container/search";
const projectStore = {
    ...orgStores,
    ...privilegeStores,
    ...portalStores,
    ...formStores,
    ...flowStores,
    ...messageModuleStores,
    ...store
}
export {
    projectRoutes,
    projectSaasRoutes,
    projectStore,
    orgaRouter,
    resources,
    Search
}