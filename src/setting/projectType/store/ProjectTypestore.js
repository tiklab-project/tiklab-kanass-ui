import { observable, action } from "mobx";
import {
    GetProjectTypeList, AddProjectTypeList, EditProjectTypeList,
    FindProjectTypeListById, DeleteProjectTypeList
} from "../api/ProjectType";

export class ProjectTypeStore {
    @observable projectTypelist = [];

    @observable projectTypePage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "10",
        total: "1"
    };
    @observable projectTypeName = "";

    // 事件类型
    @action
    getProjectTypeList = (page, name) => {
        Object.assign(this.projectTypePage, { ...page })
        this.projectTypeName = name
        const params = {
            name: this.projectTypeName,
            sortParams: [{
                name: "name",
                sortType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.projectTypePage.current
            }
        }
        return new Promise((resolve, reject) => {
            GetProjectTypeList(params).then(response => {
                // this.projectTypelist = response.data;
                if (response.code === 0) {
                    this.projectTypelist = response.data.dataList;
                    this.projectTypePage.total = response.data.totalRecord;
                }
                resolve(response.data.dataList)
            }).catch(error => {
                console.log(error)
            })
        })

    }
    @action
    addProjectTypeList = async(value) => {
        const data = AddProjectTypeList(value)
        // if (data.code === 0) {
        //     this.getProjectTypeList()
        // }
        return data;
    }
    @action
    editProjectTypeList = (value) => {
        EditProjectTypeList(value).then(response => {
            // this.projectTypelist = response.data;
            if (response.code === 0) {

                this.getProjectTypeList()
            }
        }).catch(error => {
            console.log(error)
        })
    }
    // 根据id查找
    @action
    findProjectTypeListById = (id) => {
        const params = new FormData()
        params.append("id", id)

        return new Promise((resolve, reject) => {
            FindProjectTypeListById(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })

    }
    // 根据id删除
    @action
    deleteProjectTypeList = async(id) => {

        const params = new FormData()
        params.append("id", id)
        const data = await DeleteProjectTypeList(params);
        if(data.code === 0){
            this.getProjectTypeList(this.projectTypePage, this.projectTypeName).then((res) => {
                if (res.length === 0) {
                    this.getProjectTypeList({ current: --this.projectTypePage.current })
                }
            })
        }
        return data;
    }

    @action
    setProjectTypeList = (value) => {
        this.projectTypelist = [...value]
    }

}
export const PROJECTYPE_STORE = "projectTypeStore"