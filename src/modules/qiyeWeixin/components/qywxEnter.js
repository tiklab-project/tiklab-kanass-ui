/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-12 16:30:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-15 10:28:58
 */
import React, { useEffect, useState } from "react";
import { Spin } from 'antd';
import { inject, observer } from "mobx-react";
import "./QywxEnter.scss"
import { withRouter } from "react-router";
import {getUser,removeUser} from 'doublekit-core-ui';

const QywxEnter = (props) => {
    const {qywxStore} = props;
    const {getUserinfo3rd} = qywxStore;
    const { search } = props.location
    const paramsString = search.substring(1)
    const searchParams = new URLSearchParams(paramsString)
    const code = searchParams.get('code')

    const [thdath, setStd] = useState({})

    const [sep, setSep] = useState(0)
    useEffect(()=> {
        const ticket = getUser().ticket;
        const suite_id = "ww30f817a7f03854bd";
        const redirect_url = "http://www.doublekit.cn/project/#/qywxenter";
        const encode = encodeURI(redirect_url);
        const corpid = getUser().corpid;
        if(ticket && corpid){
            setSep(1)
            window.location.href = "http://www." + corpid +".doublekit.cn/project/#/index";
            
        }else {
            if(!code){
                const url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + suite_id + "&redirect_uri=" + encode + "&response_type=code&scope=snsapi_privateinfo#wechat_redirect";
                setSep(2)
                window.location.href = url;
            }else {
                getUserinfo3rd({code:code}).then((data)=> {
                    console.log(data)
                    setStd(data)
                    
                    if(data.code === 0){
                        window.location.href = data.data;
                    }
                })
            }
        }
    },[code])


    return (
        <div className="qywx-enter">
            <Spin />
            {/* <div>{getUser().ticket}——————{search}——————{code}</div>
            <h2>{JSON.stringify(thdath)}</h2>
            <h2>{sep}</h2> */}

        </div>
    )
}
export default withRouter(inject("qywxStore")(observer(QywxEnter))) ;