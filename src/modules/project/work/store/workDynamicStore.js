/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-03 16:41:54
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-03 16:49:56
 */
import { observable, action } from "mobx";
import {FindDynamicList} from "../api/workDynamic";

export class WorkDynamicStore {
    @observable dynamicList = [];
    @action
    findDynamicList = async(value) => {
        const data = await FindDynamicList(value);
        if(data.code === 0){
            this.dynamicList = data.data;
        }
        return data;
    }
}

export const WORKDYNAMIC_STORE = "workDynamicStore"
