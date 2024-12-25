/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-23 09:35:35
 */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import Routers from './Routers';
import { Provider } from 'mobx-react';
import { orgStores } from "tiklab-user-ui/es/store";
import { enableAxios } from 'tiklab-core-ui';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { renderRoutes } from "react-router-config";
import './common/language/i18n'
import "./index.scss"
import { observer } from "mobx-react"
import "./assets/index";
import { useVersion } from "tiklab-eam-ui/es/utils";
import { privilegeStores } from "tiklab-privilege-ui/es/store";
import { InitInstallProvider } from 'tiklab-eam-ui';

enableAxios()
const Index = observer((props) => {
    console.log(window.location.search)
    console.log(window.location.hash)
    useVersion()
    useEffect(() => {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|ios|iPad|Android|Mobile|BlackBerry|IEMobile |MQQBrowser|JUC|Fennec|woSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            window.location.href = `${mobile_url}#/index/home`;// 手机
        }
        return;
    }, [])

    const allStore = {
        ...privilegeStores,
        ...orgStores
    }

    return (
        <InitInstallProvider bgroup={'kanass'}>
            <Provider {...allStore}>
                <ConfigProvider locale={zhCN}>
                    <HashRouter>
                        {
                            renderRoutes(Routers)
                        }
                    </HashRouter>
                </ConfigProvider>
            </Provider>
        </InitInstallProvider>

    )
});

ReactDOM.render(<Index />, document.getElementById('root'));

if (module.hot) {
    module.hot.accept()
}
