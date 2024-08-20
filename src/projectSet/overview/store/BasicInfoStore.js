
import { observable, action, extendObservable } from "mobx";
import {Service} from "../../../common/utils/requset"
export class BasicInfoStore {
    @observable logList = [];
    @observable todoTaskList = [];


    @observable projectPageParams = {
        orderParams: [{
            name: "projectName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }

    @observable opLogCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 1,
            total: 1
        },
        bgroup: "kanass",
        data: {}
    }

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;

    }
    
    @action
    statProjectSetWorkItemProcess = async (values) => {
        const params = new FormData();
        params.append("ids", values)
        const data = await Service("/workItemStat/statProjectWorkItem", params)
        return data;
    }



    //获取关联项目
    @action
    findPrecessProjectList = async (values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await Service("/projectSet/findProjectList", this.projectPageParams)
        this.projectRelevance = data.data
        return data;
    }

    @action
    findlogpage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            bgroup: "kanass",
            data: {
                projectId: value.projectId
            }
        }
        const data = await Service("/oplog/findlogpage", params)
        if(data.code === 0) {
            this.opLogList = data.data.dataList
        }
        return data;
    }

    @action
    setOpLogCondition = (value) => {
        this.opLogCondition = extendObservable(this.opLogCondition, { ...value })
    }


    @action
    findProjectSetLogpage = async (value) => {
        const project = await Service("/projectSet/findProjectList", value);
        if (project.code === 0) {
            const list = project.data;

            const getAllLogList = async (list, value) => {
                let dataList = [];
                for (let i = 0; i < list.length; i++) {
                    const params = { ...value, data: { ...this.opLogCondition.data, projectId: list[i].id } };
                    this.setOpLogCondition(params);

                    try {
                        const data = await Service("/oplog/findLogPageByTime", this.opLogCondition);
                        if (data.code === 0 && data.data.dataList.length > 0) {
                            if(dataList.length === 0){
                                dataList.push(...data.data.dataList);
                            }else {
                                data.data.dataList.forEach(item => {
                                    const existingDateItem = dataList.find(dateItem => dateItem.time === item.time);
                                    if(existingDateItem){
                                        existingDateItem.loggingList.push(...item.loggingList);
                                        existingDateItem.loggingList.sort((a, b) => a.createTime - b.createTime);
                                    }
                                    
                                })
                               
                            }
                        }
                        dataList.sort((a, b) => a.time - b.time);
                    } catch (error) {
                        console.error(`Error fetching logs for project ${list[i].id}:`, error);
                    }
                }
                return dataList;
            };

            const dataList = await getAllLogList(list, value);
            this.logList = dataList;

           
        }
        console.log(this.logList)
    }
    
   
    
    @action
    findtodopage = async(value)=> {
        const params={
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            bgroup: "kanass",
            userId: value.userId,
            data: {
                projectId: value.projectId
            }
        }
        const data = await Service("/todo/findtodopage", params)
        if(data.code === 0) {
            this.todoTaskList = data.data.dataList;
        }
        return data;
    }

    @action
    findProjectList = async(values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await Service("/projectSet/findProjectList", this.projectPageParams);
        return data;
    }

    @action
    findProjectSet = async(valuvaluees) => {
        const params = new FormData();
        params.append("id", value)
        const data = await Service("/projectSet/findProjectSet", params);
        return data;
    }

}

export default new BasicInfoStore();