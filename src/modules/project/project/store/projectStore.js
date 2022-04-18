import { observable, action } from "mobx";
import {
    GetproList, AddproList, DeleproList, Searchpro, UpdateproList,
    GetProjectTypeList, GetUseList, GetAllProList, FindMaterProjectList, FindJoinProjectList,
    GreatIcon,FindIconList
} from "../api/project";

export class ProStore {
    @observable prolist = [];
    @observable projectTypelist = [];
    @observable uselist = [];
    @observable project = [];
    @observable allProlist = [];
    @observable projectName = "";
    @observable projectPageParams = {
        current: 1,
        pageSize: 10
    };

    @action
    getProlist = (value) => {
        Object.assign(this.projectPageParams, { ...value })
        const params = {
            projectName: this.projectPageParams.name,
            orderParams: [{
                name: "projectName",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.projectPageParams.current
            }
        }
        GetproList(params).then(response => {
            this.prolist = response.data.dataList;
            this.projectPageParams.total = response.data.totalRecord;
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    findMaterProjectList = (value) => {
        const params = new FormData()
        params.append("masterId", value.id)
        FindMaterProjectList(params).then(response => {
            this.prolist = response.data;
        }).catch(error => {
            console.log(error)
        })
    }

    @action
    findJoinProjectList = (value) => {
        const params = new FormData()
        params.append("masterId", value.id)
        FindJoinProjectList(params).then(response => {
            this.prolist = response.data.dataList;
        }).catch(error => {
            console.log(error)
        })
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
    addProlist = (values) => {
        let param = {
            projectName: values.projectName,
            projectType:values.projectType,
            projectKey: values.projectKey,
            master: values.master,
            desc: values.desc,
            startTime: values.startTime,
            endTime: values.endTime,
            iconUrl: values.iconUrl
        }
        AddproList(param).then(response => {
            if (response.code === 0) {
                this.getProlist()
            }

        }).catch(error => {
            console.log(error)
        })
    }

    @action
    deleproList = async (values) => {
        const param = new FormData()
        param.append("id", values)

        const that = this;
        const data = DeleproList(param);
        if (data.code === 0) {
            that.getProlist()
        }
        return data;
    }


    @action
    updateProject = (values) => {
        const that = this;
        return new Promise((resolve, reject) => {
            UpdateproList(values).then(response => {
                if (response.code === 0) {
                    that.getProlist()
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
            Searchpro(params).then(response => {
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
    searchpro = (values) => {
        const params = new FormData()
        params.append("id", values)

        const that = this;
        return new Promise((resolve, reject) => {
            Searchpro(params).then(response => {
                that.project = response.data;
                that.projectName = response.data.projectName;

                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        }
        )

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
}

export const PRO_STORE = "proStore";