/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-11 16:08:46
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 21:05:35
 */
import { async } from "@antv/x6/lib/registry/marker/async";
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
    getUserinfo3rd = async(code) => {
        const params = new FormData();
        params.append("code",code.code)
        console.log(code,"code")
        // let data;
        // axios.get('/callback/getUserinfo3rd',{
        //     params: params
        // }).then(function (response) {
        //     data = response.data;
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
        // axios({
        //     url:`${base_url}callback/getUserinfo3rd`,
        //     methods:'get',
        //     data:"ddddd"
        // })
        // .then((response) => {
        //     // 因为层级比较深，匿名函数会导致this指向发生改变
        //     // 这个时候使用箭头函数解决
            
        // })
        // .catch(function () {
        //     alert('网络超时, 请重新加载!')
        // });
        const data = await GetUserinfo3rd(params);
        return data;
    }


}

export const QYWX_STORE = "qywxStore"