/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-08 17:00:38
 */
import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";
import routers from './routers';
import {renderRoutes} from "react-router-config";
import { Provider } from 'mobx-react';
import {store } from "./stores"
import {orgStores} from "doublekit-user-ui";
import {privilegeStores} from 'doublekit-privilege-ui'
import {getUser} from 'doublekit-core-ui'
import {formStores} from 'doublekit-form-ui'
import {flowStores} from 'doublekit-flow-ui'
import {messageModuleStores} from 'doublekit-message-ui'
import { useLoadLanguage } from "doublekit-plugin-ui";
import "./assets/font-icon/iconfont"
import './common/language/i18n';
import "./index.scss";
import {observer} from "mobx-react"
import App from './app';


const Index = observer(() => {
    // useLoadLanguage(resources,fetchMethod, pluginAddressUrl, "zh")
    const allStore = {  
        ...privilegeStores,
        ...orgStores,
        ...formStores,
        ...flowStores,
        ...messageModuleStores,
        ...store
    }
    // allStore.authConfigStore.getFindAuthConfig()
    const userInfo = getUser()
    if (userInfo && userInfo.userId) {
        allStore.systemRoleStore.getSystemPermissions(userInfo.userId)
    }
    allStore.pluginsStore.initLoadPlugin(fetchMethod, pluginAddressUrl)

    // useLoadLanguage(resources, method, plugin_url, 'zh')

    // 把所有的项目中的路由全部加载到插件store中。
    allStore.pluginsStore.setProjectRouter(routers)

    
    return (
        <Provider {...allStore}>
            <HashRouter >
                {renderRoutes(routers) }
            </HashRouter>
        </Provider>
    )
});

ReactDOM.render(<Index/>, document.getElementById('root'));

if (module.hot) {
    module.hot.accept()
}
