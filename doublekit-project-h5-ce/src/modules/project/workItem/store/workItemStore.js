/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 18:27:59
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-22 17:01:47
 */
import { observable, action } from "mobx";
import { FindWorkItemList,FindAllWorkType,FindDmUserPage,FindAllWorkPriority,FindSprintList,
    FindModuleList, Upload,FindWorkAttachList,CreateWorkAttach,AddWork,FindWorkItem } from "../api/work";

export class WorkItemStore {
    @observable workList = [];
    @observable total = [];
    @observable workTypeList = [];
    @observable projectUserList = [];
    @observable workPriorityList = [];
    @observable sprintList = [];
    @observable moduleList = [];
    @observable workItem = [];
    
    @observable searchCondition = {
        parentIdIsNull: true,
        orderParams: [{
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1,
        }
    };
    
    @observable slateValue = [
		{
			type: "paragraph",
			children: [{ text: "" }],
		},
	]
    @observable formValue = {};

    @action
    setFormValue = (value) => {
        this.formValue = value;
    }

    @action
    setSlateValue = (value) => {
        this.slateValue = value;
    }

    @action
    getWorkConditionPage = async (value) => {
        this.setSearchCondition(value);
        this.searchCondition.parentIdIsNull = null
        let data = await FindWorkItemList(this.searchCondition);
        if(data.code === 0){
            this.workList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    @action
    setSearchCondition = (value) => {
        Object.assign(this.searchCondition, { ...value })
    }

    @action
    findAllWorkType = async() => {
        const data = await FindAllWorkType();
        if (data.code === 0) {
            const list = data.data;
            const workType = [];
            list && list.length > 0 && list.map(item => {
                workType.push({ value: item.id, label: item.name });
                return 0;
            })
            this.workTypeList = workType;
        }
        return data;
    }

    //获取已选择人员
    @action
    getProjectUserList = async(value) => {
        const params = {
            domainId: value.projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data= await FindDmUserPage(params)
        if(data.code === 0){
            const list = data.data.dataList;
            const userList = [];
            list && list.length > 0 && list.map(item => {
                userList.push({ value: item.user.id, label: item.user.name });
                return 0;
            })
            this.projectUserList = userList;
        } 
    }

    @action
    findAllWorkPriority = async() => {
        const data= await FindAllWorkPriority()
        if(data.code === 0){
            const list = data.data;
            const priorityList = [];
            list && list.length > 0 && list.map(item => {
                priorityList.push({ value: item.id, label: item.name });
                return 0;
            })
            this.workPriorityList = priorityList;
        } 
    }

    @action
    findSprintList = async(value) => {
        const params = {
            projectId: value.projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data= await FindSprintList(params)
        if(data.code === 0){
            const list = data.data;
            const sprint = [];
            list && list.length > 0 && list.map(item => {
                sprint.push({ value: item.id, label: item.sprintName });
                return 0;
            })
            this.sprintList = sprint;
        } 
    }

    @action
    findModuleList = async(value) => {
        const params = {
            projectId: value.projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data= await FindModuleList(params)
        if(data.code === 0){
            const list = data.data;
            const module = [];
            list && list.length > 0 && list.map(item => {
                module.push({ value: item.id, label: item.moduleName });
                return 0;
            })
            this.moduleList = module;
        } 
    }

    @action
    upload = async(file) => {
        const params = new FormData();
        params.append("uploadFile",file)
        const data = await Upload(params);
        return data;
    }

    @action
    findWorkAttachList = async(value) => {
        const params = {
            workItemId: value,
        }
        const data = await FindWorkAttachList(params);
        // console.log(data.data)
        // if(data.code === 0){
        //     console.log(data.data)
        //     this.workAttachList = data.data
        // }
        return data.data;
    }

    @action
    createWorkAttach = async(value) => {
        const params = {
            workItem: {
                id: value.workId
            },
            attachment: {
                fileName: value.fileName
            }
        }
        const data = await CreateWorkAttach(params);
        
        return data.data;
    }

    @action
    addWork = async(value) => {
        const params = {
            title: value.title,
            planBeginTime: value.planBeginTime,
            planEndTime: value.planEndTime,
            planTakeupTime: value.planTakeupTime,
            project: {
                id: value.project
            },
            workType: {
                id: value.workType
            },
            parentWorkItem: {
                id: value.parentWorkItem
            },
            workPriority: {
                id: value.workPriority
            },
            workStatus: {
                id: value.workStatus
            },
            module: {
                id: value.module
            },
            sprint: {
                id: value.sprint || "nullstring"
            },
            assigner: {
                id: value.assigner
            },
            reporter: {
                id: value.reporter
            },
            builder: {
                id: value.builder
            },
            desc: JSON.stringify(value.desc) || undefined,
            preDependWorkItem: {
                id: value.predependworkitem || "nullstring"
            },
            extData: JSON.stringify(value.extData)

        }
        // return new Promise((resolve, reject) => {
        //     AddWork(params).then(response => {
        //         this.getsprintlist()
        //         resolve(response)
        //     }).catch(error => {
        //         console.log(error)
        //         reject()
        //     })
        // })
        const data = await AddWork(params);
        return data.data;
    }

    @action
    findWorkItem = async(value) => {
        const params = new FormData()
        params.append("id", value.id)
        const data = await FindWorkItem(params)

        return data;

    }

}
export const WORKITEM_STORE = "workItemStore"