import { observable, action } from "mobx";
import {GetWorkStatusList,AddWorkStatusList,EditWorkStatusList,
            FindWorkStatusListById,DeleteWorkStatusList,Exchange} from "../api/workStatus";
import {GetWorkTypeList,AddWorkTypeList,EditWorkTypeList,
            FindWorkTypeListById,DeleteWorkTypeList,GreatIcon,FindIconList} from "../api/workType";
import {GetWorkPriorityList,AddWorkPriorityList,EditWorkPriorityList,
            FindWorkPriorityListById,DeleteWorkPriorityList} from "../api/workPriority";
import {GetAllForm,GetAllFlow} from "../api/workFormFlow";
export class OrgaStore {
    @observable workStatuslist = [];
    @observable workTypelist = [];
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
    @action
	getWorkStatusList = (page,name) => {
        Object.assign(this.workStatusPage, {...page})
        this.workStatusName = name
        const params = {
            name: this.workStatusName,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.workStatusPage.current
            }
        }
        return new Promise((resolve,reject)=> {
            GetWorkStatusList(params).then(response => {
                if(response.code=== 0){
                    this.workStatuslist = response.data.dataList;
                    this.workStatusPage.total = response.data.totalRecord;
                }
                resolve(response.data.dataList)
            }).catch(error => {
                console.log(error)
            })
        })
		
    }
    @action
	addWorkStatusList = (value) => {
		AddWorkStatusList(value).then(response => {
            if(response.code=== 0){
                this.getWorkStatusList()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    @action
	editWorkStatusList = (value) => {
		EditWorkStatusList(value).then(response => {
            if(response.code=== 0){
                this.getWorkStatusList()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    // 根据id查找
    @action
	findWorkStatusListById = (id) => {
        const params = new FormData()
        params.append("id", id)

        return new Promise((resolve,reject)=> {
            FindWorkStatusListById(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }
    
    // 根据id删除
    @action
	deleteWorkStatusList = (id) => {
        const params = new FormData()
        params.append("id", id)

        DeleteWorkStatusList(params).then(response => {
            this.getWorkStatusList(this.workStatusPage,this.workStatusName).then((res)=> {
                if(res.length === 0){
                    this.getWorkStatusList({current: --this.workStatusPage.current})
                }
            })
        }).catch(error => {
            console.log(error)
            reject()
        })
    }
    @action
	setWorkStatusList = (value) => {
        this.workStatuslist = [...value]
    }

    @action
	exchange = (sourceId,targetId) => {
        const params = { 
            items: [
                {
                    sourceId: sourceId,
                    targetId: targetId
                }
            ]
        }
        return new Promise((resolve,reject)=> {
            Exchange(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }




    // 事件类型
    @action
	getWorkTypeList = (page,name) => {
        Object.assign(this.workTypePage, {...page})
        this.workTypeName = name
        const params = {
            name: this.workTypeName,
            sortParams: [{
                name: "name",
                sortType:"asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.workTypePage.current
            }
        }
        return new Promise((resolve,reject)=> {
            GetWorkTypeList(params).then(response => {
                if(response.code=== 0){
                    this.workTypelist = response.data.dataList;
                    this.workTypePage.total = response.data.totalRecord;
                }
                resolve(response.data.dataList)
            }).catch(error => {
                console.log(error)
            })
        })
		
    }
    @action
	addWorkTypeList = (value) => {
        let params = {
            name: value.name,
            group: value.group,
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
                this.getWorkTypeList()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    @action
	editWorkTypeList = (value) => {
        let params = {
            id: value.id,
            name: value.name,
            group: value.group,
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
		EditWorkTypeList(params).then(response => {
            if(response.code=== 0){
                this.getWorkTypeList()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    // 根据id查找
    @action
	findWorkTypeListById = (id) => {
        const params = new FormData()
        params.append("id", id)

        return new Promise((resolve,reject)=> {
            FindWorkTypeListById(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }
    // 根据id删除
    @action
	deleteWorkTypeList = (id) => {
        const params = new FormData()
        params.append("id", id)

        DeleteWorkTypeList(params).then(response => {
            this.getWorkTypeList(this.workTypePage,this.workTypeName).then((res)=> {
                if(res.length === 0){
                    this.getWorkTypeList({current: --this.workTypePage.current})
                }
            })
        }).catch(error => {
            console.log(error)
            reject()
        })
    }
    @action
	setWorkTypeList = (value) => {
        this.workTypelist = [...value]
    }



    // 事项优先级
    @action
	getWorkPriorityList = (page,name) => {
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
        return new Promise((resolve,reject)=> {
            GetWorkPriorityList(params).then(response => {
                if(response.code=== 0){
                    this.workPrioritylist = response.data.dataList;
                    this.workPriorityPage.total = response.data.totalRecord;
                }
                resolve(response.data.dataList)
            }).catch(error => {
                console.log(error)
            })
        })
		
    }
    @action
	addWorkPriorityList = (value) => {
		AddWorkPriorityList(value).then(response => {
            if(response.code=== 0){
                this.getWorkPriorityList()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    @action
	editWorkPriorityList = (value) => {
		EditWorkPriorityList(value).then(response => {
            if(response.code=== 0){
                this.getWorkPriorityList()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    // 根据id查找
    @action
	findWorkPriorityListById = (id) => {
        const params = new FormData()
        params.append("id", id)

        return new Promise((resolve,reject)=> {
            FindWorkPriorityListById(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
    }
    // 根据id删除
    @action
	deleteWorkPriorityList = (id) => {
        const params = new FormData()
        params.append("id", id)
        
        DeleteWorkPriorityList(params).then(res => {
            this.getWorkPriorityList(this.workPriorityPage,this.workPriorityName).then((res)=> {
                if(res.length === 0){
                    this.getWorkPriorityList({current: --this.workPriorityPage.current})
                }
            })
        }).catch(error => {
            console.log(error)
            reject()
        })
    }

    @action
	setWorkPriorityList = (value) => {
        this.workPrioritylist = [...value]
    }

    // 获取所有表单列表
    @action
    getFormList = () => {
        return new Promise((resolve,reject)=> {
            GetAllForm({}).then(response => {
                if(response.code=== 0){
                    this.fromList = response.data
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 获取所有流程列表
    @action
    getFlowList = () => {
        return new Promise((resolve,reject)=> {
            GetAllFlow({}).then(response => {
                if(response.code=== 0){
                    this.flowList = response.data
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
		
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
export const ORGA_STORE = "orgaStore"