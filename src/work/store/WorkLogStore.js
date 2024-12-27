/*
 * @Descripttion: 事项工时接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2024-12-27 09:22:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:20:45
 */
import { observable, action } from "mobx";
import {Service} from "../../common/utils/requset";
export class WorkLogStore {
    @observable workLogList = [];
    @observable workLogDeatil = [];
    @observable PlanTime = "";
    @observable workId = ""

    @observable workLogCondition = {
        orderParams: [{
            name: "work_date",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
        }
    };
    // 获取事项工时列表
    @action
    findWorkLogPage = async(value) => {
        Object.assign(this.workLogCondition, value)
        const data = await Service("/workLog/findWorkLogPage", this.workLogCondition)
        if(data.code=== 0){
            this.workLogList = data.data.dataList;
            this.workLogCondition.total = data.data.totalRecord
        }
        return data;
    }

    //添加工时  
    @action
    addWorkLog = async(value) => {
        const data = await Service("/workLog/createWorkLog", value)

        return data;
		
    }

    //删除工时  
    @action
    deleteWorKLog = async(value) => {
        const param = new FormData()
        param.append("id", value)
        const data = await Service("/workLog/deleteWorkLog", param)
        // if(data.code === 0){
        //     this.findWorkLogPage({workItemId:this.workId})
        // }
        return data;
    }

    //编辑工时  
    @action
    editWorKLog = async(value) => {
        let params = {
            id: value.id,
            workItem: {
                id: value.workItem
            },
            worker: {
                id: value.worker
            },
            workDate: value.workDate,
            takeupTime: value.takeupTime,
            workContent: value.workContent
        }
        const data = await Service("/workLog/updateWorkLog", params)
        return data;
    }

    //查找工时
    @action
    searchWorKLog = async(value) => {
        const params = new FormData()
        params.append("id", value)
        const data = await Service("/workLog/findWorkLog", params)
        if(data.code === 0){
            this.workLogDeatil = data.data;
        }
        return data.data
        
    }

    // 获取计划用时
    @action
    setPlanTime = (value) => {
        this.PlanTime = value
    }

    // 获取事项和用时
    @action
    findWorkItemAndUsedTime = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findWorkItemAndUsedTime", params);
        return data;
    }

}

export default new WorkLogStore();