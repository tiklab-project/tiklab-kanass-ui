/*
 * @Descripttion: 里程碑store
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 09:18:32
 */
import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset"
export class MilestoneStore {
    // 里程碑列表
    @observable milestonelist = [];

    // 查询里程碑的名称
    @observable searchMilestoneName = "";

    @observable uselist = "";
    // 分页参数
    @observable milestonePageParam = {
        current: 1,
        pageSize: 10,
        totalRecord: ""
    };


    /**
     * 获取里程碑列表
     */
    @action
    getmilestone = async () => {
        const data = await Service("/milestone/findMilestoneList", value)
        if (data.code === 0) {
            this.milestonelist = data.data;
        }
        return data;
    }

    /**
     * 添加里程碑
     * @param {*} values 
     */
    @action
    addMilestone = async (values) => {
        const data = await Service("/milestone/createMilestone", values)
        if (data.code === 0) {
            this.findMilestonePage()
        }
        return data;
    }

    /**
     * 删除里程碑
     * @param {*} milestoneId 
     * @param {*} projectId 
     */
    @action
    deleMilestone = async (milestoneId) => {
        const param = new FormData()
        param.append("id", milestoneId)
        const data = await Service("/milestone/deleteMilestone", param)
        if (data.code === 0) {
            this.findMilestonePage().then((res) => {
                if (res.dataList.length === 0) {
                    that.milestonePageParam.current--
                }
            })
        }
        return data;
    }

    /**
     * 根据id 查找里程碑详情
     * @param {*} values 
     * @returns 
     */
    @action
    searchMilestoneById = async (values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/milestone/findMilestone", param);
        return data.data;

    }

    /**
     * 编辑里程碑
     * @param {*} values 
     */
    @action
    editMilestoneById = async (values) => {
        const data = await Service("/milestone/updateMilestone", values)
        if (data.code === 0) {
            this.findMilestonePage(values.project.id, this.searchMilestoneName)
        }
        return data;
    }

    /**
     * 根据项目id查找里程碑，带分页
     * @param {*} projectId 
     * @param {*} milestoneName 
     * @returns 
     */
    @action
    findMilestonePage = async (value) => {
        Object.assign(this.milestonePageParam, { ...value })
        const params = {
            projectId: this.milestonePageParam.projectId,
            name: this.milestonePageParam.name,
            orderParams: [{
                name: "milestoneTime",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: this.milestonePageParam.pageSize,
                currentPage: this.milestonePageParam.current
            }
        }
        const data = await Service("/milestone/findMilestonePage", params);
        if (data.code === 0) {
            this.milestonelist = data.data.dataList
            this.milestonePageParam.totalRecord = data.data.totalRecord
        }
        return data;
    }

    /**
     * 设置分页参数
     * @param {*} value 
     */
    @action
    setPageParam = (value) => {
        this.milestonePageParam = { ...value }
    }

    @action
    getUseList = async(projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserPage", params)
        if(data.code === 0){
            this.uselist = data.data.dataList;
        }
        return data;
    }
}

export const MILESTONE_STORE = "milestoneStore"