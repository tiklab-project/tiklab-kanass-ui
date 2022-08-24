/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-22 15:37:26
 */
import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";
import routers from './routers';
import {renderRoutes} from "react-router-config";
import { Provider } from 'mobx-react';
import store from "./stores";
import "./assets/font-icon/iconfont"
// import './common/language/i18n';
import "./index.scss";
import {observer} from "mobx-react"
import "./assets/index";
const Index = observer(() => {
    console.log(base_url)
    const allStore = {...store}
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
