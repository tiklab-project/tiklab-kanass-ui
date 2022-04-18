/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-08 16:29:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 16:30:06
 */
import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
const QywxInstall = () => {
    const {qywxStore} = props;
    const {getPreAuthCode} = qywxStore;
    useEffect(() => {
        getPreAuthCode().then((data)=> {
            console.log(data)
        })
    },[])
    return <div>
        DoubleKit服务商网站3233333
        <a href="https://open.work.weixin.qq.com/3rdapp/install?suite_id=ww30f817a7f03854bd&pre_auth_code=2dTPsmqICGqJQ1iKlNC87KzENVJXt37Er6EOtR_78vBVjHo2jGHeVj50Jfk2ud5I&redirect_uri=http%3A%2F%2F49536dr156.qicp.vip%2F&state=STATE">安装应用</a>
    </div>
}
export default inject("qywxStore")(observer(QywxInstall));