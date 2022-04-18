/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-04 10:47:36
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-11 14:50:05
 */
import React, {useEffect, useState} from 'react'
import {inject, observer} from "mobx-react";
import {PLUGIN_STORE,loadLanguage} from "doublekit-plugin-ui";
import {renderRoutes} from "react-router-config";
import { useTranslation } from 'react-i18next';
import resources from './common/language/resources';

const App = (props) => {
    const {pluginsStore} = props;
    const {routers,languages, isInitLoadPlugin} = pluginsStore;
    const [loading, setLoading] = useState(false);
    const {i18n, t} = useTranslation();
    const [resourcesLanguage, setResources] = useState({});

    useEffect(() => {
        if (isInitLoadPlugin) {
            setLoading(true)
            console.log(resources)
            loadLanguage(i18n, resources, languages, fetchMethod, 'zh').then(res => {
                const resources2 = {
                    zh:res.zh || {translation:{}}
                }
                setResources(resources2)
            })
        }
    }, [isInitLoadPlugin]);

    Object.keys(resourcesLanguage).map(key => {
        i18n.addResourceBundle(key,'translation', resourcesLanguage[key].translation, true,true)
    })
    
    return(
        <>
            {
                loading ? renderRoutes(routers) : <div>加载中....</div>
            }
        </>
    )

};

export default inject(PLUGIN_STORE)(observer(App))