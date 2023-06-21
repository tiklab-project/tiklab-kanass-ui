/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-03 16:41:54
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-03 16:49:56
 */
import { observable, action } from "mobx";
import {Service} from "../../common/utils/requset";
export class WorkDynamicStore {
    @observable dynamicList = [];
    @action
    findlogpage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 20,
                currentPage: 1
            },
            bgroup: "teamwire",
            content: {
                workItemId: value.workItemId
            }
        }
        const data = await Service("/oplog/findlogpage", params)
      
        return data;
    }
}

export default new WorkDynamicStore();
