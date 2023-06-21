import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";
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
    getProjectTypeList = async(page, name) => {
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
        const data = await Service("/projectType/findProjectTypePage", params)
        if (data.code === 0) {
            this.projectTypelist = data.data.dataList;
            this.projectTypePage.total = data.data.totalRecord;
        }
        return data.data.dataList;

    }

    @action
    addProjectTypeList = async(value) => {
        const data = await Service("/projectType/createProjectType", value)
        return data;
    }

    @action
    editProjectTypeList = async(value) => {
        const data = await Service("/projectType/updateProjectType", value)
        if (data.code === 0) {
            this.getProjectTypeList()
        }
        return data;
    }
    // 根据id查找
    @action
    findProjectTypeListById = async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/projectType/findProjectType", params)
        return data;

    }
    // 根据id删除
    @action
    deleteProjectTypeList = async(id) => {
        const params = new FormData()
        params.append("id", id)
        const data = await Service("/projectType/deleteProjectType", params)
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
export default new ProjectTypeStore();