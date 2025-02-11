
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
export class ProjectStore {
    @observable projectList = [];
    @observable projectTypelist = [];
    @observable uselist = [];
    @observable project = null;
    @observable allProlist = [];
    @observable projectName = "";
    @observable activeTabs = "1";
    @observable projectQuickFilter = null;

     
    @observable projectPageParams = {
        orderParams: [{
            name: "startTime",
            orderType: "desc"
        }]
    };
    @action
    setProject = (value) => {
        this.project = value
    }

    @action
    setProjectPageParams = (value) => {
        Object.assign(this.projectPageParams, value)
    }

    @action
    setActiveTabs = (value) => {
        this.activeTabs = value;
    }

    @action
    setProjectQuickFilter = (value) => {
        this.projectQuickFilter = value;
    }

    @action
    findProjectList = async(value) => {
        Object.assign(this.projectPageParams, { ...value })
        const data = await Service("/project/findProjectList", this.projectPageParams)
        if(data.code === 0){
            this.projectList = data.data;
        }
        return data;
    }

    @action
    findJoinProjectList = async(value) => {
        Object.assign(this.projectPageParams, value)
        const data = await Service("/project/findJoinProjectList", this.projectPageParams)
        if(data.code === 0){
            this.projectList = data.data;
        }
        return data;
    }

    @action
    findMyAllProjectList = async(value) => { 
        const data = await Service("/project/findJoinProjectList", value)
        if(data.code === 0){
            this.allProlist = data.data;
        }
        return data
    }
    
    @action
    findRecentProjectList = async(value) => {
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
        
        const data = await Service("/project/findRecentProjectList", params)
        if(data.code === 0){
            this.projectList = data.data;
        }
        return data
    }

    @action
    getAllProlist = async() => {
        const data = await Service("/project/findAllProject", params)
        if(data.code === 0){
            this.allProlist = data.data;
        }
        return data;
    }

    @action
    createProject = async(values) => {
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
        const data = await Service("/project/createProject", param)
        if(data.code === 0){
            this.findProjectList()
        }
        return data;
    }

    @action
    deleproList = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/project/deleteProject", param)
        if (data.code === 0) {
            this.findProjectList()
        }
        return data;
    }


    @action
    updateProject = async(values) => {
        const data = await Service("/project/updateProject", values)
        return data;
    }

    @action
    searchproList = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/project/findProject", values)
        if(data.code === 0){
            this.projectList = [data.data];
        }
        return data;
    }

    @action
    searchpro = async(values) => {
        const params = new FormData()
        params.append("id", values)
        const data = await Service("/project/findProject", params)
        return data;

    }

    @action
    getProjectTypeList = async() => {
        const data = await Service("/projectType/findAllProjectType")
        if(data.code === 0){
            this.projectTypelist = data.data;
        }
        return data;
    }

    @action
    getUseList = async() => {
        const data = await Service("/user/user/findAllUser")
        if(data.code === 0){
            this.uselist = data.data;
        }
        return data;
    }

    /**
    * 上传icon
    */
    @action
    creatIcon = async (value) => {
        const data = await Service("/icon/createIcon", value)
        return data;

    }

    //获取项目icon
    @action
    findIconList = async (params) => {
        const data = await Service("/icon/findIconList", params)
        return data;
    }

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;

    }

    @action
    createProjectFocus = async (value) => {
        const data = await Service("/projectFocus/createProjectFocus", value)
        return data;
    }

    @action
    findProjectFocusList = async (value) => {
        const data = await Service("/projectFocus/findProjectFocusList", value)
        return data;
    }

    @action
    deleteProjectFocusByQuery = async (value) => {
        const data = await Service("/projectFocus/deleteProjectFocusByQuery", value)

        return data;
    }

    // @action
    // findFocusProjectList = async (value) => {
    //     const data = await Service("/project/findFocusProjectList", value)
    //     if(data.code === 0){
    //         this.projectList = data.data;
    //     }
    //     return data;
    // }


    @action
	findProjectSortRecentTime = async(value) => {

        const data = await Service("/project/findProjectSortRecentTime", value)
        return data;
    }
    
    @action
    creatProjectKey = async(value) => {
        const params = new FormData();
        params.append("projectName", value)
        const data = await Service("/project/creatProjectKey", params)
        return data;
    }
}

export default new ProjectStore();