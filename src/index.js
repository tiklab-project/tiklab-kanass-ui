/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:23:40
 */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import Routers from './Routers';
import { Provider } from 'mobx-react';
import { store } from "./stores"
import { orgStores } from "tiklab-user-ui/es/store";
import { privilegeStores } from 'tiklab-privilege-ui/es/store'
import { getUser, enableAxiosCE } from 'tiklab-core-ui'
import { formStores } from 'tiklab-form-ui/es/store'
import { flowStores } from 'tiklab-flow-ui/es/store'
import { messageModuleStores } from 'tiklab-message-ui/es/store';
import { useTranslation } from 'react-i18next';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { renderRoutes } from "react-router-config";
import './common/language/i18n'
import "./index.scss"
import { observer } from "mobx-react"
import { pluginLoader, PluginProvider } from "tiklab-plugin-core-ui";
import "./assets/index";
import resources from "./common/language/resources";
enableAxiosCE()
const Index = observer((props) => {

    const { i18n } = useTranslation();
    const [visable, setVisable] = useState(true);
    useEffect(() => {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|ios|iPad|Android|Mobile|BlackBerry|IEMobile |MQQBrowser|JUC|Fennec|woSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            window.location.href = `${mobile_url}${window.location.search}${window.location.hash}`;// 手机
        }
        return;
    }, [])

    // useLoadLanguage(resources,fetchMethod, pluginAddressUrl, "zh")
    const allStore = {
        ...privilegeStores,
        ...orgStores,
        ...formStores,
        ...flowStores,
        ...messageModuleStores,
        ...store
    }
    
    const userInfo = getUser()

    if (userInfo && userInfo.userId) {
        allStore.systemRoleStore.getSystemPermissions(userInfo.userId, "teamwire")
    }

    const [pluginData, setPluginData] = useState({
        routes: Routers,
        pluginStore: [],
        languageStore: []
    });

    useEffect(() => {
        pluginLoader(Routers, resources,i18n).then(res => {
            setPluginData(res)
            setVisable(false)
        })
    }, []);


    // if(visable) return <div>加载。。。</div>

    return (
        
        <PluginProvider store={pluginData}>
            {
                console.log(pluginData)
            }
            <Provider {...allStore}>
                <ConfigProvider locale={zhCN}>
                    <HashRouter>
                        {
                            renderRoutes(pluginData?.routes)
                        }
                    </HashRouter>
                </ConfigProvider>
            </Provider>
        </PluginProvider>
    )
});

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
    module.hot.accept()
}
