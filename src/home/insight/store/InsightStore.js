import { observable, action } from "mobx";
import {Service} from "../../../common/utils/requset";

export class InsightStore {
    // 项目集id
    @observable 
    projectSetId = "";

    // 项目id
    @observable 
    projectId = "";

    // 仪表盘详情的报表列表
    @observable 
    reportList = { lg: []}

    @observable 
    focusInsightList = []

    @observable
    insightList = []
    
    
    /**
     * 设置仪表盘详情的报表列表
     * @param {仪表盘详情的报表列表} value 
     */
    @action
    setReportList = (value) => {
        this.reportList = value
    }

    /**
     * 给仪表盘添加报表
     * @param {报表的信息，位置，属性} value 
     */
    @action
    addReportList = (value) => {
        this.reportList.lg.push(value)
    }

    /**
     * 设置项目集id
     * @param {项目集id} value 
     */
    @action
    setProjectSetId = (value) => {
        this.projectSetId = value
    }

    /**
     * 设置项目id
     * @param {项目id} value 
     */
    @action
    setProjectId = (value) => {
        this.projectId = value
    }

    /**
     * 统计项目集的项目下事项进展
     * @param {项目集id} params 
     * @returns 
     */
    @action
	statisticsProjectOperateList = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
        const data = await Service("/projectInsightReport/statisticsProjectOperateList", value)
        return data;
    }

    /**
     * 统计新增事项
     * @param {统计条件参数} params 
     * @returns 
     */
    @action
	statisticsNewWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReport/statisticsNewWorkItemCount", params)
        return data;
    }

    /**
     * 统计完成事项
     * @param {统计条件参数} params 
     * @returns 
     */
    @action
	statisticsEndWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReport/statisticsEndWorkItemCount", params)
        return data;
    }

    /**
     * 统计进行中事项
     * @param {统计条件参数} params 
     * @returns 
     */
    @action
	statisticsPorcessWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReport/statisticsPorcessWorkItemCount", params)
        return data;
    }

    /**
     * 统计新增缺陷
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsNewBugCountList = async(params) => {
        const data = await Service("/projectInsightReport/statisticsNewBugCount", params)
        return data;
    }

    /**
     * 统计进行中缺陷
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsProcessBugCount = async(params) => {
        const data = await Service("/projectInsightReport/statisticsProcessBugCount", params)
        return data;
    }

    /**
     * 统计项目集的项目成员对比
     * @param {项目集id} params 
     * @returns 
     */
    @action
    statisticsProjectUserCount = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
        const data = await Service("/projectInsightReport/statisticsProjectUserCount", value)
        return data;
    }

    /**
     * 统计项目集的项目事项对比
     * @param {项目集id} params 
     * @returns 
     */
    @action
    statisticsProjectWorkItemCount = async(params) => {
        const value = new FormData();
        value.append("projectSetId", params.projectSetId)
        const data = await Service("/projectInsightReport/statisticsProjectWorkItemCount", value)
        return data;
    }

    /**
     * 统计项目的事项进展
     * @param {} params 
     * @returns 
     */
    @action
    statisticsProjectOperate = async(params) => {
        const data = await Service("/projectInsightReport/statisticsProjectOperate", params)
        return data;
    }

    /**
     * 统计某个项目下事项单位时间（天，周，月，季，年）的新增，完成，剩余趋势
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsDayWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReport/statisticsDayWorkItemCount", params)
        return data;
    }

    /**
     * 统计某个项目下，各个状态的事项数量
     * @param {*} params 
     * @returns 
     */
    @action
    statisticsWorkItemStatusCount = async(params) => {
        const data = await Service("/projectInsightReport/statisticsWorkItemStatusCount", params)
        return data;
    }

    /**
     * 统计某个项目下，统计成员的负责的事项对比
     * @param {项目id} params 
     * @returns 
     */
    @action
    statisticsUserWorkItemCount = async(params) => {
        const data = await Service("/projectInsightReport/statisticsUserWorkItemCount", params)
        return data;
    }   

    /**
     * 查找所有项目组
     */
    @action
    findAllProjectSet = async() => {
        const data = await Service("/projectSet/findAllProjectSet")
        return data;
    }

    /**
     * 查找所有项目
     * @returns 
     */
    @action
    findAllProject = async() => {
        const data = await Service("/project/findAllProject")
        return data;
    }

    /**
     * 创建仪表盘
     * @param {仪表盘详情} params 
     * @returns 
     */
    @action
    createInsight = async(params) => {
        const data = await Service("/insight/createInsight", params)
        return data;
    }

    /**
     * 按照条件查找仪表盘
     * @returns 
     */
    @observable insightSearch = {
        orderParams: [{
            name: "insightName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }
    @action
    findInsightList = async(value) => {
        Object.assign(this.insightSearch, { ...value })
        const data = await Service("/insight/findInsightList", this.insightSearch)
        if(data.code === 0){
            this.insightList = data.data;
        }
        return data;
    }

    /**
     * 更新仪表盘
     * @param {仪表盘信息} params 
     * @returns 
     */
    @action
    updateInsight = async(params) => {
        const data = await Service("/insight/updateInsight", params)
        return data;
    }

    /**
     * 根据id查找仪表盘
     * @param {*} params 
     * @returns 
     */
    @action
    findInsight = async(params) => {
        const data = await Service("/insight/findInsight", params)
        return data;
    }

    /**
     * 删除仪表盘
     * @param {*} params 
     * @returns 
     */
    @action
    deleteInsight = async(params) => {
        const data = await Service("/insight/deleteInsight", params)
        return data;
    }
    @action
    createRecent = async(params) => {
        const data = await Service("/recent/createRecent", params)
        return data;
    }

    @action
    findRecentInsightList = async(value) => {
        const params = {
            insightName : value?.insightName,
            orderParams: [{
                name: "insightName",
                orderType: "asc"
            }]
        }
        const data = await Service("/insight/findRecentInsightList", params)
        if(data.code === 0){
            this.insightList = data.data;
        }
        return data
    }

    @action
    findInsightFocusList = async(value) => {
        const data = await Service("/insightFocus/findInsightFocusList", value)
        if(data.code === 0){
            let list = []
            data.data.map(item => {
                list.push(item.insightId)
            })
            this.focusInsightList = list
        }
        return data
    }

    @action
    createInsightFocus = async(value) => {
        const data = await Service("/insightFocus/createInsightFocus", value);
        return data;
    }

    @action
    deleteInsightFocusByQuery = async(value) => {
        const data = await Service("/insightFocus/deleteInsightFocusByQuery", value);
        return data;
    }

    @action
    findFocusInsightList = async(value) => {
        const data = await Service("/insight/findFocusInsightList", value);
        if(data.code === 0){
            this.insightList = data.data;
        }
        return data;
    }
    
}

export default new InsightStore();