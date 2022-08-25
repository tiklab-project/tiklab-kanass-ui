import { observable, action } from "mobx";
import {GetWorkLogList,AddWorkLog,DeleteWorKLog,EditWorKLog,SearchWorKLog} from "../api/workLog";
export class WorkLogStore {
    @observable workLogList = [];
    @observable workLogDeatil = [];
    @observable PlanTime = "";
    @observable workId = ""

    @observable workLogPage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };
    //查找所有日志
    @action
    getWorkLogList = (value,page) => {
        this.workId = value.workItemId;
        if(page){
            Object.assign(this.workLogPage, {...page})
        }
        let params = {
            workItemId: value.workItemId,
            sortParams: [{
                name: "title",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.workLogPage.current
            }
        }
        return new Promise((resolve,reject)=> {
            GetWorkLogList(params).then(response => {
                if(response.code=== 0){
                    this.workLogList = response.data.dataList;
                    this.workLogPage.total = response.data.totalRecord
                }
                resolve(response.data.dataList) 
                
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    //添加日志
    @action
    addWorkLog = (value) => {
        let params = {
            workItem: {
                id: value.workItem
            },
            worker: {
                id: value.worker
            },
            project: {
                id: value.projectId
            },
            workDate: value.workDate,
            takeupTime: value.takeupTime,
            workContent: value.workContent
        }
        AddWorkLog(params).then(response => {
            this.getWorkLogList({workItemId:this.workId})
        }).catch(error => {
            console.log(error)
            
        })
		
    }

    //删除日志
    @action
    deleteWorKLog = (value) => {
        const param = new FormData()
        param.append("id", value)

		DeleteWorKLog(param).then(response => {
            this.getWorkLogList({workItemId:this.workId})
        }).catch(error => {
            console.log(error)
        })
    }

    //编辑日志
    @action
    editWorKLog = (value) => {
        console.log(value)
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
        return new Promise((resolve,reject)=> {
            EditWorKLog(params).then(response => {
                resolve()
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    }

    //查找日志
    @action
    searchWorKLog = (value) => {
        const params = new FormData()
        params.append("id", value)
        
        return new Promise((resolve,reject)=> {
            SearchWorKLog(params).then(response => {
                this.workLogDeatil = response.data;
                console.log(this.workLogDeatil)
                resolve(response.data)
            }).catch(error => {
                console.log(error)
            })
        })
        
    }

    // 获取计划用时
    @action
    setPlanTime = (value) => {
        // debugger
        this.PlanTime = value
    }

    //
}

export const WORKLOG_STORE = "workLogStore"