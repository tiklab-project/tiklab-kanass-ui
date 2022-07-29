/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-08 16:29:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-16 16:10:57
 */
import React, { useEffect } from "react";
import { inject, observer } from "mobx-react";
import {getUser,removeUser} from 'tiklab-core-ui';
const QywxInstall = () => {
    useEffect(() => {
        removeUser()
    },[])
    return <div>删除缓存</div>
}
export default inject("qywxStore")(observer(QywxInstall));