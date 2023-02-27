import { observable, action } from "mobx";
import {
    FindProjectList, AddproList, DeleproList, Searchpro, UpdateproList,
    GetProjectTypeList, GetUseList, GetAllProList, FindJoinProjectList,
    GreatIcon,FindIconList, CreateRecent,FindRecentProjectPage, 
    CreateProjectFocus, FindProjectFocusList, DeleteProjectFocusByQuery, 
    FindFocusProjectList, StatProjectWorkItem
} from "../api/ProjectApi";

export class ProjectStore {
    @observable prolist = [];
    @observable projectTypelist = [];
    @observable uselist = [];
    @observable project = [];
    @observable allProlist = [];
    @observable projectName = "";
    @observable projectPageParams = {
        orderParams: [{
            name: "projectName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    @action
    findProjectList = (value) => {
        Object.assign(this.projectPageParams, { ...value })
        FindProjectList(this.projectPageParams).then(response => {
            this.prolist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    findJoinProjectList = (value) => {
        // const params = new FormData()
        // params.append("masterId", value.id)
        FindJoinProjectList(value).then(response => {
            this.prolist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }
    
    @action
    findRecentProjectPage = async(value) => {
        const params = {
            projectName : value?.projectName,
            orderParams: [{
                name: "projectName",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.projectPageParams.current
            }
        }
        const data = await FindRecentProjectPage(params);
        if(data.code === 0){
            this.prolist = data.data;
        }
        return data
    }

    @action
    getAllProlist = () => {
        GetAllProList(params).then(response => {
            this.allProlist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    addProlist = async(values) => {
        let param = {
            projectName: values.projectName,
            projectType:values.projectType,
            projectKey: values.projectKey,
            master: values.master,
            desc: values.desc,
            projectLimits: values.projectLimits,
            startTime: values.startTime,
            endTime: values.endTime,
            iconUrl: values.iconUrl
        }
        const data = await AddproList(param)
        if(data.code === 0){
            this.findProjectList()
        }
        return data;
    }

    @action
    deleproList = async (values) => {
        const param = new FormData()
        param.append("id", values)

        const that = this;
        const data = DeleproList(param);
        if (data.code === 0) {
            that.findProjectList()
        }
        return data;
    }


    @action
    updateProject = (values) => {
        const that = this;
        return new Promise((resolve, reject) => {
            UpdateproList(values).then(response => {
                if (response.code === 0) {
                    that.findProjectList()
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
            }
        )

    }

    @action
    searchproList = (values) => {
        const param = new FormData()
        param.append("id", values)
        const that = this;
        return new Promise((resolve, reject) => {
                Searchpro(param).then(response => {
                    that.prolist = [response.data];
                    resolve(response.data)
                }).catch(error => {
                    console.log(error)
                    reject()
                })
            }
        )
    }

    @action
    searchpro = async(values) => {
        const params = new FormData()
        params.append("id", values)

        const that = this;
        const data = await Searchpro(params);
        // if(data.code === 0){
        //     that.project = response.data;
        //     that.projectName = response.data.projectName;
        // }
        return data;

    }

    @action
    getProjectTypeList = () => {
        GetProjectTypeList().then(response => {
            this.projectTypelist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    getUseList = () => {
        GetUseList().then(response => {
            this.uselist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    /**
    * 上传icon
    */
    @action
    creatIcon = async (value) => {
        const data = await GreatIcon(value)
        return data;

    }

    //获取项目icon
    @action
    findIconList = async (params) => {
        const data = await FindIconList(params)
        return data;
    }

    @action
    createRecent = async (value) => {
        const data = await CreateRecent(value)
        return data;

    }

    @action
    createProjectFocus = async (value) => {

        const data = await CreateProjectFocus(value)
        return data;
    }


    @action
    findProjectFocusList = async (value) => {

        const data = await FindProjectFocusList(value)
        return data;
    }

    @action
    deleteProjectFocusByQuery = async (value) => {

        const data = await DeleteProjectFocusByQuery(value)
        return data;
    }

    @action
    findFocusProjectList = async (value) => {
        const data = await FindFocusProjectList(value);
        if(data.code === 0){
            this.prolist = data.data;
        }
        
        return data;
    }


    @action
	statProjectWorkItem = async(value) => {
        const params = new FormData();
        params.append("recentMasterId",value)
		const data = await StatProjectWorkItem(params);
        return data;
    }
}

export const PRO_STORE = "projectStore";