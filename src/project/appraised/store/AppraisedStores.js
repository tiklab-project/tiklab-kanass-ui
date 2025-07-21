import {action, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

export class AppraisedStore {

    @observable
    appraisedList = [];

    // 版本信息
    @observable appraisedItem = [];

    @observable userList = [];

    // 分页参数
    @observable total = [];

    @observable status = [
        {
            id: "0",
            name: "未开始"
        },
        {
            id: "1",
            name: "进行中"
        },
        {
            id: "2",
            name: "已完成"
        }
    ]

    @observable
    searchCondition = {
        orderParams: [{
            name: "startTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };

    /**
     * 查找项目下的评审
     * @param value
     * @returns
     */
    @action
    getAppraisedList = async (value) => {
        Object.assign(this.searchCondition, { ...value })
        const data = await Service("/appraised/findAppraisedPage", this.searchCondition)
        if (data.code === 0) {
            this.appraisedList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    /**
     * 添加评审
     * @param {评审信息} value
     * @returns
     */
    @action
    addAppraised = async (value) => {
        const data = await Service("/appraised/createAppraised", value)
        return data;

    }

    /**
     * 修改版本
     * @param  value
     * @returns
     */
    @action
    editAppraised = async (value) => {
        let params = {
            id: value.id,
            name: value.name,
            startTime: value.startTime,
            endTime: value.endTime,
            projectId: value.project.id,
            appraisedState: value.appraisedState,
            description: value.description
        }
        const data = await Service("/appraised/updateAppraised", params);
        return data;
    }

    /**
     * 删除评审
     * @param {评审id} params
     */
    @action
    deleteAppraised = async (value) => {
        const param = new FormData()
        param.append("id", value)

        const data = await Service("/appraised/deleteAppraised", param)
        if (data.code === 0) {
            this.getAppraisedList()
        }
        return data;
    }

    @action
    getUserList = async (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserPage", params)
        if (data.code === 0) {
            this.userList = data.data.dataList;
        }
        return data;
    }

    /**
     * 根据id查找评审
     * @returns
     * @param id
     */
    @action
    searchAppraisedById = async (id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/appraised/findAppraised", param);
        if (data.code === 0) {
            this.appraisedItem = data.data;
        }
        return data;
    }

    /**
     * 根据id查找评审
     * @returns
     * @param id
     */
    @action
    searchAppraisedAndWorkItemNumById = async (id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/appraised/findAppraisedAndWorkItemNum", param);
        if (data.code === 0) {
            this.appraisedItem = data.data;
        }
        return data;
    }

}
export default new AppraisedStore();