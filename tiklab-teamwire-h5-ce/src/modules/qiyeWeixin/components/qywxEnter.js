/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-12 16:30:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-24 10:35:17
 */
import React, { useEffect, useState } from "react";
import { SpinLoading } from 'antd-mobile';
import { inject, observer } from "mobx-react";
import "./QywxEnter.scss"
import { withRouter } from "react-router";
import {getUser,removeUser} from 'doublekit-core-ui';

const QywxEnter = (props) => {
    const {qywxStore} = props;
    const {getUserinfo3rd} = qywxStore;
    const { search } = props.location
    const paramsString = search ? search.substring(1) : undefined
    const searchParams = paramsString ? new URLSearchParams(paramsString) : undefined;
    const code = searchParams? searchParams.get('code'): undefined

    const [thdath, setStd] = useState({})

    const [sep, setSep] = useState("进入页面")
    const corpid = getUser().corpid;
    const ticket = getUser().ticket;
    useEffect(()=> {
        const ticket = getUser() ? getUser().ticket : undefined;
        const suite_id = "ww30f817a7f03854bd";
        const redirect_url = "http://www.dev.project.doublekit.net/#/qywxenter";
        const encode = encodeURI(redirect_url);
        const corpid = getUser() ? getUser().corpid : undefined;
        
        if(ticket && corpid){
            setSep("登录成功")
            window.location.href = "http://www.dev.project.doublekit.net/#/";
        }else {
            if(!code){
                const url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + suite_id + "&redirect_uri=" + encode + "&response_type=code&scope=snsapi_privateinfo#wechat_redirect";
                setSep("微信登录")
                window.location.href = url;
            }else {
                getUserinfo3rd({code: code, type: "pc"}).then((data)=> {
                    setSep("获取微信信息成功")
                    
                    if(data.code === 0){
                        window.location.href = data.data;
                    }
                })
            }
        }
    },[code])

    return (
        <div className="qywx-enter">
            <SpinLoading style={{ '--size': '48px' }} />
            <div>{sep}</div>
        </div>
    )
}
export default withRouter(inject("qywxStore")(observer(QywxEnter))) ;