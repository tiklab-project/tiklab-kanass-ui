import { observable, action } from "mobx";
import {FindWorkTypeDmList,AddWorkTypeList,UpdateWorkTypeDm,
        FindWorkTypeDm,DeleteWorkType,GreatIcon,
        FindIconList, FindDmFormList, FindDmFlowPage, FindSelectWorkTypeDmList, CreateWorkTypeDm} from "../api/WorkType";

export class ProjectWorkStore {
    @observable workAllTypeList = [];
    @observable workSelectTypeList = [];
    @observable workSystemTypeList = [];
    @observable formList = [];
    @observable flowList = [];

    @observable workTypePage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };



    // 所有事项类型
    @action
	createWorkTypeDm = async(value) => {

        const data = await CreateWorkTypeDm(value);
        if(data.code=== 0){
            return data;
        }
    }

    //新增关联事项
    @action
	findWorkTypeDmList = async(value) => {
        const params = {
            projectId: value.projectId,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }]
        }

        const data = await FindWorkTypeDmList(params);
        if(data.code=== 0){
            this.workAllTypeList = data.data;
        }
    }



    @action
	findSelectWorkTypeDmList = async(value) => {
        const params = {
            selectIds: value.selectIds,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }]
        }

        const data = await FindSelectWorkTypeDmList(params);
        if(data.code=== 0){
            this.workSelectTypeList = data.data;
        }
        return data;
    }


    @action
	getSystemWorkTypeList = async(value) => {
        const params = {
            name: value?.name,
            grouper: "system",
            sortParams: [{
                name: "name",
                sortType:"asc"
            }]
        }

        const data = await GetWorkTypeList(params);
        if(data.code=== 0){
            this.workSystemTypeList = data.data;
        }
    }


    @action
	addCustomWorkTypeList = (value) => {
        let params = {
            name: value.name,
            grouper: "custom",
            category: value.category,
            projectId: value.projectId,
            scope: 1,
            form: {
                id: value.form
            },
            flow: {
                id : value.flow
            },
            code: "nomal",
            desc: value.desc,
            iconUrl: value.iconUrl
        }
		AddWorkTypeList(params).then(response => {
            if(response.code=== 0){
                this.getAllWorkTypeList({projectId: value.projectId })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    @action
	addSystemWorkTypeList = (value) => {
        let params = {
            name: value.name,
            grouper: "system",
            category: value.category,
            form: {
                id: value.form
            },
            flow: {
                id : value.flow
            },
            desc: value.desc,
            iconUrl: value.iconUrl
        }
		AddWorkTypeList(params).then(response => {
            if(response.code=== 0){
                this.getSystemWorkTypeList()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    @action
	editWorkType = async(value) => {
        let params = {
            id: value.id,
            name: value.name,
            form: {
                id: value.form
            },
            flow: {
                id : value.flow
            }
        }
		const data = await UpdateWorkTypeDm(params)

        return data;
    }

    // 根据id查找
    @action
	findWorkTypeDmtById = (id) => {
        const params = new FormData()
        params.append("id", id)

        return new Promise((resolve,reject)=> {
            FindWorkTypeDm(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }
    // 根据id删除
  

     // 根据id删除
     @action
     deleteWorkTypeCustomList =async(value) => {
        const params = new FormData();
        params.append("id", value.id)
         const data = await DeleteWorkType(params);
        //  if(data.code === 0){
        //      this.getAllWorkTypeList({projectId: value.projectId})
        //  }
         return data;
     }


    @action
	setWorkTypeList = (value) => {
        this.workTypelist = [...value]
    }

    // 获取所有表单列表
    @action
    getFormList = async(value) => {
        const params = {
            domainId: value.projectId,
            // group: "custom",
            pageParam: {
                pageSize: 10, 
                currentPage: 1
            }
        }
        const data = await FindDmFormList(params)
        console.log(data)
        if(data.code=== 0){
            this.formList = data.data
        }
    }

    // 获取所有流程列表
    @action
    getFlowList = async(value) => {
        const params = {
            domainId: value.projectId,
            group: "custom",
            pageParam: {
                pageSize: 10, 
                currentPage: 1
            }
        }
        const data = await FindDmFlowPage(params)
        if(data.code=== 0){
            this.flowList = data.data.dataList
        }
		
    }

    /**
     * 上传icon
     */
    @action
    creatIcon = async(value) => {
        const data = await GreatIcon(value)
        return data;
		
    }
    
    /**
     * 查找所有icon
     */
    @action
    findIconList = async(params) => {
        const data = await FindIconList(params)
        return data;
    }
}
export const PROJECTWORK_STORE = "projectWorkStore"