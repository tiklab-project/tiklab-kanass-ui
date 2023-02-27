/*
 * @Descripttion: 里程碑接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 09:18:32
 */
import { observable, action } from "mobx";
import { GetMilestoneList,AddMilestone,DeleMilestone,SearchMilestoneById,
    EditMilestoneById,FindMilestonePage,FindDmUserPage } from "../api/MilestoneApi";

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
	getmilestone = () => {
		GetMilestoneList().then(response => {
            if(response.code=== 0){
                this.milestonelist = response.data;
            }
        }).catch(error => {
            console.log(error)
        })
    }
    
    /**
     * 添加里程碑
     * @param {*} values 
     */
    @action
	addMilestone = (values) => {
        // const params = {
        //     name: values.name,
        //     project: {
        //         id: values.projectId,
        //     },
        //     master: {
        //         id: values.master
        //     },
        //     milestoneStatus: values.milestoneStatus,
        //     milestoneTime: values.milestoneTime
        // }
		AddMilestone(values).then(response => {
            if(response.code=== 0){
                this.findMilestonePage()
            }
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 删除里程碑
     * @param {*} milestoneId 
     * @param {*} projectId 
     */
    @action
	deleMilestone = (milestoneId) => {
        const param = new FormData()
        param.append("id", milestoneId)

		DeleMilestone(param).then(response => {
            if(response.code=== 0){
                // 删除当前页最后一条，返回上一页
                const that = this;
                this.findMilestonePage().then((res)=> {
                    if(res.dataList.length === 0){
                        that.milestonePageParam.current--
                    }
                })
                
            }
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 根据id 查找里程碑详情
     * @param {*} values 
     * @returns 
     */
    @action
	searchMilestoneById = async(values) => {
        const param = new FormData()
        param.append("id", values)
        
        const data = await SearchMilestoneById(param);
        return data.data;
		
    }

    /**
     * 编辑里程碑
     * @param {*} values 
     */
    @action
	editMilestoneById = (values) => {
		EditMilestoneById(values).then(response => {
            if(response.code===0){
                this.findMilestonePage(values.project.id,this.searchMilestoneName)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    /**
     * 根据项目id查找里程碑，带分页
     * @param {*} projectId 
     * @param {*} milestoneName 
     * @returns 
     */
    @action
	findMilestonePage = (value) => {
        Object.assign(this.milestonePageParam, {...value})
        const params={
            projectId: this.milestonePageParam.projectId,
            name: this.milestonePageParam.name,
            orderParams: [{
                name: "name",
                orderType:"asc"
            }],
            pageParam: {
                pageSize: this.milestonePageParam.pageSize,
                currentPage: this.milestonePageParam.current
            }
        }
        return new Promise((resolve,reject)=>{
            FindMilestonePage(params)
                .then(response => {
                    if(response.code===0){
                        this.milestonelist = response.data.dataList
                        this.milestonePageParam.totalRecord = response.data.totalRecord
                        }
                        resolve(response.data)
                    })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            }

        )
    }

    /**
     * 设置分页参数
     * @param {*} value 
     */
    @action
    setPageParam = (value)=> {
        this.milestonePageParam = {...value}
    }

    @action
    getUseList = (projectId) => {
        const params={
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
}

export const MILESTONE_STORE = "milestoneStore"