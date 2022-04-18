import { observable, action } from "mobx";
import {
    GetsprintList, GetSprint, AddsprintList, DelesprintList,
    SearchsprintList, EditsprintList, FindDmUserPage, FindAllSprintState
} from "../api/sprint"

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

    @action
    getsprintlist = () => {
        GetsprintList().then(response => {
            this.sprintlist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    //根据条件查询迭代列表带分页
    @action
    getSprint = (value) => {
        Object.assign(this.sprintPageParams, { ...value })
        return new Promise((resolve, reject) => {
            GetSprint(this.sprintPageParams).then(response => {
                if (response.code === 0) {
                    this.sprintlist = response.data.dataList;
                    this.totalRecord = response.data.totalRecord;
                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    }

    @action
    addsprintlist = async (values) => {
        const data = await AddsprintList(values)
        if (data.code === 0) {
            this.getSprint(values.project.id, this.searchSprintName)
        }
        return data;
    }

    @action
    delesprintList = (values) => {
        const param = new FormData()
        param.append("id", values)

        DelesprintList(param).then(response => {
            if (response.code === 0) {
                this.getSprint(this.searchSprintId, this.searchSprintName).then((res) => {
                    if (res.dataList.length === 0) {
                        this.sprintPageParams.current--
                        this.getSprint(this.searchSprintId, this.searchSprintName)
                    }
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    searchsprintList = (values) => {

        const param = new FormData()
        param.append("id", values)
        return new Promise(function (resolve, reject) {
            SearchsprintList(param).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })

    }

    @action
    editsprintList = (values) => {
        EditsprintList(values).then(response => {
            if (response.code === 0) {
                this.getSprint(this.searchSprintId, this.searchSprintName, this.searchPageInfo)
            }
        }).catch(error => {
            console.log(error)
        })
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
}

export const SPRINT_STORE = "sprintStore"