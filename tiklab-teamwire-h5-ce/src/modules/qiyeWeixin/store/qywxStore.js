/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-11 16:08:46
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-23 09:52:30
 */
import { observable, action } from "mobx";
import { GetPreAuthCode, GetUserinfo3rd } from "../api/qywxApi";
import axios from "axios";
export class QywxStore {

    // 获取预授权码
    @action
    getPreAuthCode = async () => {
        const data = await GetPreAuthCode();
        return data;
    }

    // 获取第三方信息
    @action
    getUserinfo3rd = async(param) => {
        const params = new FormData();
        params.append("code",param.code)
        params.append("type",param.type)
        const data = await GetUserinfo3rd(params);
        return data;
    }


}

export const QYWX_STORE = "qywxStore"