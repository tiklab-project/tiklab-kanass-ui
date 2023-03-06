import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
export class OrgaStore {
    @observable workStatuslist = [];
    @observable workAllTypeList = [];

    @observable workSystemTypeList = [];
    @observable workPrioritylist = [];
    @observable fromList = [];
    @observable flowList = [];
    @observable workStatusPage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };
    @observable workStatusName = "";

    @observable workTypePage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };
    @observable workTypeName = "";
    
    @observable workPriorityPage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };
    @observable workPriorityName = "";
  
   
    // 所有事项类型
    @action
	getAllWorkTypeList = async(value) => {
        const params = {
            name: value?.name,
            scope: 0,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }]
        }
        const data = await Service("/workType/findWorkTypeList", params)
        if(data.code=== 0){
            this.workAllTypeList = data.data;
        }
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

        const data = await Service("/workType/findWorkTypeList", params)
        if(data.code=== 0){
            this.workSystemTypeList = data.data;
        }
    }


    @action
	addCustomWorkTypeList = async(value) => {
        let params = {
            name: value.name,
            grouper: "custom",
            category: value.category,
            code: "nomal",
            form: {
                id: value.form
            },
            flow: {
                id : value.flow
            },
            desc: value.desc,
            iconUrl: value.iconUrl
        }
        const data = await Service("/workType/createWorkType", params)
        if(data.code=== 0){
            this.getAllWorkTypeList()
        }
        return data;
    }

    @action
	addSystemWorkTypeList = async(value) => {
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
        const data = await Service("/workType/createWorkType", params)
        if(data.code=== 0){
            this.getSystemWorkTypeList()
        }
        return data;
    }

    @action
	editWorkTypeList = async(value) => {
        let params = {
            id: value.id,
            name: value.name,
            grouper: value.grouper,
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
        const data = await Service("/workType/updateWorkType", params)
		if(data.code=== 0){
            if(value.grouper === "system"){
                this.getSystemWorkTypeList()
            }
            if(value.grouper === "custom"){
                this.getAllWorkTypeList()
            }
        }
        return data;
    }
    // 根据id查找
    @action
	findWorkTypeListById = async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/workType/findWorkType", params)
        return data.data;
		
    }
    // 根据id删除
    @action
	deleteWorkTypeSystemList =async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/workType/deleteWorkType", params)
        if(data.code === 0){
            this.getSystemWorkTypeList()
        }
        return data;
    }

     // 根据id删除
     @action
     deleteWorkTypeCustomList =async(id) => {
         const params = new FormData()
         params.append("id", id)
         const data = await Service("/workType/deleteWorkType", params)
         if(data.code === 0){
             this.getAllWorkTypeList()
         }
         return data;
     }


    @action
	setWorkTypeList = (value) => {
        this.workTypelist = [...value]
    }



    // 事项优先级
    @action
	getWorkPriorityList = async(page,name) => {
        Object.assign(this.workPriorityPage, {...page})
        this.workPriorityName = name
        const params = {
            name: this.workPriorityName,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.workPriorityPage.current
            }
        }
        const data = await Service("/workPriority/findWorkPriorityPage", params)
        if(data.code=== 0){
            this.workPrioritylist = data.data.dataList;
            this.workPriorityPage.total = data.data.totalRecord;
        }
        return data;
		
    }

    @action
	addWorkPriorityList = async(value) => {
        const data = await Service("/workPriority/createWorkPriority", value)
        if(data.code === 0){
            this.getWorkPriorityList()
        }
        return data;
    }

    @action
	editWorkPriorityList = async(value) => {
        const data = await Service("/workPriority/updateWorkPriority", value)
        if(data.code === 0){
            this.getWorkPriorityList()
        }
        return data;
    }
    // 根据id查找
    @action
	findWorkPriorityListById = async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/workPriority/findWorkPriority", value)
        return data.data;
		
    }
    // 根据id删除
    @action
	deleteWorkPriorityList = async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/workPriority/deleteWorkPriority", value)
        if(data.code === 0){
            this.getWorkPriorityList(this.workPriorityPage,this.workPriorityName).then((res)=> {
                if(res.length === 0){
                    this.getWorkPriorityList({current: --this.workPriorityPage.current})
                }
            })
        }
        return data;
    }

    @action
	setWorkPriorityList = (value) => {
        this.workPrioritylist = [...value]
    }

    // 获取所有表单列表
    @action
    getFormList = async() => {
        const data = await Service("/form/findFormList", {group: "custom"})
        if(data.code=== 0){
            this.fromList = data.data
        }
        return data;
    }

    // 获取所有流程列表
    @action
    getFlowList = async() => {
        const data = await Service("/flow/findFlowList", {})
        if(data.code=== 0){
            this.flowList = data.data
        }
        return data;
		
    }

    /**
     * 上传icon
     */
    @action
    creatIcon = async(value) => {
        const data = await Service("/icon/createIcon", value)
        return data;
		
    }
    
    /**
     * 查找所有icon
     */
    @action
    findIconList = async(params) => {
        const data = await Service("/icon/findIconList", params)
        return data;
    }
}
export const ORGA_STORE = "orgaStore"