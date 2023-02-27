import { observable, action } from "mobx";
import { async } from "tiklab-form-ui/lib/project-form-list";
import {
    FindSprintList, FindSprintPage, AddsprintList, DelesprintList,
    SearchsprintList, EditsprintList, FindDmUserPage, FindAllSprintState,
    CreateSprintFocus, FindSprintFocusList, DeleteProjectFocusByQuery, FindFocusSprintList
} from "../api/SprintApi"

export class SprintStore {
    @observable sprintlist = [];
    @observable searchSprintName = [];
    @observable searchSprintId = [];
    @observable uselist = [];
    @observable sprintPageParams = {
        orderParams: [{
            name: "sprintName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };
    @observable totalRecord = "";
    @observable sprintStateList = []
    @observable filterType = "pending"

    @action 
    setFilterType = (value) => {
        this.filterType = value
    }

    @action
    getsprintlist = () => {
        FindSprintList().then(response => {
            this.sprintlist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    //根据条件查询迭代列表带分页
    @action
    findSprintList = async(value) => {
        Object.assign(this.sprintPageParams, {...value})
        const data = await FindSprintList(this.sprintPageParams)
        if(data.code === 0) {
            this.sprintlist = data.data;
            // this.totalRecord = response.data.totalRecord;
        }
        return data.data;
    }

    @action
    findFocusSprintList = async(value) => {
        Object.assign(this.sprintPageParams, { ...value })
        const data = await FindFocusSprintList(this.sprintPageParams)
        if(data.code === 0) {
            this.sprintlist = data.data;
            // this.totalRecord = response.data.totalRecord;
        }
        return data.data;
    }

    @action
    addsprintlist = async (values) => {
        const data = await AddsprintList(values)
        if (data.code === 0) {
            this.findSprintList(values.project.id, this.searchSprintName)
        }
        return data;
    }

    @action
    delesprintList = async(values) => {
        const param = new FormData()
        param.append("id", values)

        const data = await DelesprintList(param);
        if(data.code === 0){
            return data;
        }
    }

    @action
    searchSprint = async(values) => {

        const param =  new FormData()
        param.append("id", values)
        const data = await SearchsprintList(param)
        if(data.code === 0){
            return data;
        }

    }

    @action
    editSprint = async(values) => {
        const data = await EditsprintList(values)
        if (data.code === 0) {
            this.findSprintList(values.project.id, this.searchSprintName)
        }
        return data;
    }

    @action
    setSprintPageParam = (value) => {
        this.sprintPageParams = { ...value }
    }

    @action
    getUseList = (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        FindDmUserPage(params).then(response => {
            this.uselist = response.data.dataList;
        }).catch(error => {
            console.log(error)
        })
    }

    // 迭代状态列表
    @action
    findAllSprintState = () => {
        FindAllSprintState().then(response => {
            this.sprintStateList = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    createSprintFocus = async(value) => {
       const data = await CreateSprintFocus(value);
       return data;
    }

    @action
    findSprintFocusList = async(value) => {
       const data = await FindSprintFocusList(value);
       return data;
    }

    // 取消关注
    @action
    deleteSprintFocus = async(value) => {
       const data = await DeleteProjectFocusByQuery(value);
       return data;
    }
}

export const SPRINT_STORE = "sprintStore"