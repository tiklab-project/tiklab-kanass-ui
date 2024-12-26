/*
 * @Author: 袁婕轩
 * @Date: 2024-12-26 16:53:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 17:12:06
 * @Description: 事项接口
 */
import { Service } from "../../common/utils/requset";
import axios from "axios";
import { getUser } from "tiklab-core-ui";
export class WorkStore {
    @observable workBoardList = [];
    @observable workUserGroupBoardList = [];
    @observable workList = [];
    @observable workListTime = [];
    // 加载中
    @observable tableLoading = false;
    @observable alertText = "保存中";
    @observable isShowAlert = false;

    // 添加事项页面获取项目列表，迭代列表，用户列表，模块列表，事项列表
    @observable projectList = [];
    @observable moduleList = [];
    @observable versionList = [];
    @observable selectVersionList = [];
    @observable sprintList = [];
    @observable selectSprintList = [];
    @observable stageList = [];
    @observable userList = [];
    @observable workAllList = [];

    @observable priorityList = [];
    @observable workTypeList = [];
    @observable workStatusList = [];
    @observable workInfo = [];
    // 快捷搜索选中值
    @observable quickFilterValue = null;
    // 默认页数，总页数
    @observable defaultCurrent = 1;
    @observable total = 1
    @observable totalPage = 1
    @observable currentPage = 1
    @observable editorContent = [];
    @observable demandTypeId = ""
    @observable searchCondition = {
        orderParams: [{
            name: "code",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            total: 1
        }
    };

    // 看板视图筛选条件
    @observable searchBorderChangepageCondition = {
        orderParams: [{
            name: "code",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
        }
    }
    @observable workId = "";
    @observable workIndex = "";
    
   
    // 当前事项的状态index 
    @observable indexParams = {
        statusIndex: "",
        workIndex: ""
    }

    // 附件
    @observable attachList = []

    // 事项的视图类型
    @observable workShowType = localStorage.getItem("view") ? localStorage.getItem("view") : "table";
    @observable archiveView = "week"

    // 事项的视图类型
    @observable viewType = "tree"
    @observable boardGroup = "nogroup"

    // 自定义表单列表
    @observable formList = []

    // 状态列表
    @observable statesList = []
    @observable workBoardListLength = 0;

    //事项状态
    @observable workType = ""
    @observable tabValue = {id: "all", type: "system"};
    @observable detailCrumbArray = [];
    @observable isWorkList = true;
    @observable eveWorkTypeNum = {};
    @observable workBoardCurrentPage = [];
    @observable permissionFieldList = [];

    // 设置总个数
    @action 
    setTotal = (value) => {
        this.total = value;
    }
    
    // 设置甘特图视图类型，月视图或者周视图
    @action
    setArchiveView = (value) => {
        this.archiveView = value
    }

 
    // 设置默认页数
    @action
    setDefaultCurrent = (value) => {
        this.defaultCurrent = value;
    }

    // 设置事项详情面包屑
    @action
    setDetailCrumbArray = (value) => {
        this.detailCrumbArray = value
    }

    // 设置保存中
    @action
    setAlertText = (value) => {
        this.alertText = value
    }

    // 设置是否显示保存中
    @action
    setIsShowAlert = (value) => {
        this.isShowAlert = value
    }


    // 设置事项列表
    @action
    setWorkList = (value) => {
        this.workList = value;
    }
    
    // 设置编辑器内容
    @action
    setEditorContent = (value) => {
        this.editorContent = value
    }

    // 设置事项id
    @action
    setWorkId = (value) => {
        this.workId = value
    }

    // 设置当前事项index
    @action
    setWorkIndex = (value) => {
        this.workIndex = value
    }

    // 设置事项视图类型，table，gantt，lineMap，list
    @action
    setWorkShowType = (value) => {
        localStorage.setItem("view", this.workShowType)
        this.workShowType = value
    }

    // 设置事项视图类型,tree，list
    @action
    setViewType = (value) => {
        this.viewType = value
    }

    // 设置看板视图分组，nogroup，userGroup
    @action
    setBoardGroup = (value) => {
        this.boardGroup = value
    }

    // 设置事项类型
    @action
    setWorkType = (value) => {
        this.workType = value
    }

    // 设置事项详情tab渲染的值，1，2，3，4
    @action
    setTabValue = (value) => {
        this.tabValue = value
    }

    // 设置快捷搜索选中值
    @action
    setQuickFilterValue = (value) => {
        this.quickFilterValue = value
    }

    // 设置看板视图当前事项的状态的index
    @action
    setIndexParams = (workIndex, statusIndex) => {
        this.indexParams.workIndex = workIndex
        this.indexParams.statusIndex = statusIndex
    }

    // 看板视图移动位置后，列表交换
    @action
    changeBorderList = (startBoxIndex, startWorkBoxIndex, index, targetStatusId) => {
        Object.assign(this.workBoardList[startBoxIndex].workItemList.dataList[startWorkBoxIndex], { workStatus: { id: targetStatusId } })
        this.workBoardList[index].workItemList.dataList.push(this.workBoardList[startBoxIndex].workItemList.dataList[startWorkBoxIndex])
        this.workBoardList[startBoxIndex].workItemList.dataList.splice(startWorkBoxIndex, 1)
    }

    // 若调用接口失败，则还原
    @action
    reductionWorkBoardList = (value) => {
        this.workBoardList = value
    }

    //查找所有项目  
    @action
    findProjectList = async () => {
        const data = await Service("/project/findAllProject")
        this.projectList = data.data;
    }

    // 根据项目id查找
    @action
    getModuleList = async(projectid, modulename) => {
        const params = {
            projectId: projectid,
            moduleName: modulename,
            orderParams: [{
                name: "moduleName",
                orderType: "asc"
            }]
        }
        const data = await Service("/module/findModuleList",params);
        if(data.code === 0){
            this.moduleList = data.data;
        }
        return data;
    }

    // 根据项目id查找版本
    @action
    findVersionList = async(projectId) => {
        const params = {
            projectId: projectId,
            orderParams: [{
                name: "startTime",
                orderType: "desc"
            }]
        }
        const data = await Service("/projectVersion/findVersionList",params);
        if(data.code === 0){
            this.versionList = data.data;
        }
        return data;
    }

    // 根据项目id查找已选择版本
    @action
    findSelectVersionList = async(projectId) => {
        const params = {
            projectId: projectId,
            orderParams: [{
                name: "startTime",
                orderType: "desc"
            }]
        }
        const data = await Service("/projectVersion/findSelectVersionList",params);
        if(data.code === 0){
            this.selectVersionList = data.data;
        }
        return data;
    }

    // 根据项目id查找迭代
    @action
    findSprintList = async(projectid) => {
        const params = {
            projectId: projectid,
            sprintName: "",
            orderParams: [{
                name: "startTime",
                orderType: "desc"
            }]
        }
        const data = await Service("/sprint/findSprintList",params);
        if (data.code === 0) {
            this.sprintList = data.data;
        }
        return data;
    }

    // 根据项目id查找已选择迭代
    @action
    findSelectSprintList = async(projectid) => {
        const params = {
            projectId: projectid,
            sprintName: "",
            orderParams: [{
                name: "startTime",
                orderType: "desc"
            }]
        }
        const data = await Service("/sprint/findSelectSprintList",params);
        if (data.code === 0) {
            this.selectSprintList = data.data;
        }
        return data;
    }

    // 根据项目id查找阶段
    @action
    findStageList = async(value) => {
        const stageParams = {
            projectId: value.projectId,
            stageName: value.stageName,
            orderParams: [{
                name: "startTime",
                orderType: "desc"
            }]
        }
        const data = await Service("/stage/findStageList", stageParams);
        if (data.code === 0) {
            this.stageList = data.data;
        }
        return data;
    }

    //获取已选择人员    
    @action
    getSelectUserList = async(projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserPage",params);
        if(data.code === 0){
            const list = data.data.dataList;
            const newList = [];
            const newIds = [];
            list.map(item => {
                if(newIds.indexOf(item.user?.id)> -1){
                    return null
                }else {
                    newIds.push(item.user?.id)
                    newList.push(item)
                }
            })
            this.userList = newList;
        }
        return data.data
    }

    //获取事项列表  
    @action
    getWorkAllList = async(value) => {
        const data = await Service("/workItem/findAllWorkItem",value);
        if(data.code === 0){
            this.workAllList = data.data;
        }
        return data;
    }

    // 获取看板视图事项列表
    getWorkBoardList = async (value) => {
        this.setSearchCondition(value)
        this.workBoardCurrentPage = []
        this.workBoardList = []
        const data = await Service("/workItem/findWorkBoardList",this.searchCondition);
        if (data.code === 0) {
            this.workBoardList = data.data;
            const listLength = this.workBoardList.length
            let length = this.workBoardList[0].workItemList.length;
            this.workBoardCurrentPage.push(this.workBoardList[0].workItemList.currentPage)
            for (let j = 1; j < listLength; j++) {
                this.workBoardCurrentPage.push(this.workBoardList[j].workItemList.currentPage)
                if (this.workBoardList[j].workItemList.length > length) {
                    length = this.workBoardList[j].workItemList.length;
                }
            }
            this.workBoardListLength = length;
            this.findWorkItemNumByWorkList()
        }
        return data;
    }

    // 获取看板视图事项列表 
    findChangePageWorkBoardList = async (value) => {
        // this.setSearchCondition(value)
        Object.assign(this.searchBorderChangepageCondition, value)
        this.getWorkItemNum();
        const data = await Service("/workItem/findChangePageWorkBoardList",this.searchBorderChangepageCondition);
        console.log(this.searchBorderChangepageCondition)
        if (data.code === 0) {
            const index = value.index;
            this.workBoardCurrentPage[index] = data.data.workItemList.currentPage;
            this.workBoardList[index].workItemList.dataList.push(...data.data.workItemList.dataList);
            
        }
        return data;
    }

    // 获取人员分组的看板视图事项列表   
    findWorkUserGroupBoardList = async (value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkUserGroupBoardList",this.searchCondition);
        if (data.code === 0) {
            this.workUserGroupBoardList = data.data.map((item, index) => {
                const listLength = item.workBoardList.length
                let length = 0;
                length = item.workBoardList[0].workItemList.length;
                for (let j = 1; j < listLength; j++) {
                    if (item.workBoardList[j].workItemList.length > length) {
                        length = item.workBoardList[j].workItemList.length;
                    }
                }
                item.length = length;
                return item;
            })
        }
        return data;
    }

    // 合并搜索条件
    @action
    setSearchCondition = (value) => {
        this.searchCondition = Object.assign(this.searchCondition,  { ...value })
    }

    // 设置搜索条件为空
    @action
    setSearchConditionNull = async () => {
        const that = this;
        function setValue() {
            that.searchCondition = {
                orderParams: [{
                    name: "code",
                    orderType: "desc"
                }],
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            }
        }
        await setValue();
    }

    // 获取事项树形列表
    @action
    getWorkConditionPageTree = async(value) => {

        this.tableLoading = true;
        this.setSearchCondition(value)
        let data = [];
        // 获取每个事项类型的个数
        this.getWorkItemNum();
        
        // 两个时间戳相差的毫秒数
        data = await Service("/workItem/findWorkItemPageTreeByQuery",this.searchCondition);
        if (data.code === 0) {
            this.tableLoading = false;
            
            if(this.workShowType === "lineMap" || this.workShowType === "gantt" ){
                if(this.searchCondition.pageParam.currentPage <= 1){
                    this.workList = data.data.dataList
                }else {
                    this.workList = this.workList.concat(data.data.dataList)
                    console.log( this.workList)
                }
            }else {
                this.workList = data.data.dataList
            }
            this.currentPage = this.searchCondition.pageParam.currentPage;
            this.totalPage = data.data.totalPage;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    // 获取树形结构下各个类型的事项个数
    @action
    findWorkItemNumByWorkType = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemNumByWorkType",this.searchCondition);
        if (data.code === 0) {
            this.eveWorkTypeNum = data.data;
        }
        return data.data;
    }

    // 获取平铺结构下各个类型的事项个数
    @action
    findWorkItemNumByWorkList = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemListNumByWorkType",this.searchCondition);
        if (data.code === 0) {
            this.eveWorkTypeNum = data.data;
        }
        return data.data;
    }
    
    // 获取快捷搜索各个类型的事项个数
    @action
    findWorkItemNumByQuickSearch = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemNumByQuickSearch",this.searchCondition);
        if (data.code === 0) {
            this.eveWorkTypeNum = data.data;
        }
        return data;
    }

    
    // 获取各个状态的事项个数
    @action
    findWorkItemNumByWorkStatus = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemNumByWorkStatus",this.searchCondition);
        if (data.code === 0) {
            this.eveWorkTypeNum = data.data;
        }
        return data.data;
    }


    // 获取事项个数
    @action
    getWorkItemNum = () => {
        if(this.viewType === "tile" || this.workShowType === "bodar"){
            this.findWorkItemNumByWorkList()
        }
        if (this.viewType === "tree" && this.workShowType !== "bodar") {
            this.findWorkItemNumByWorkType()
        }
    }

    // 获取平铺的事项列表
    @action
    getWorkConditionPage = async (value) => {
        this.setSearchCondition(value);
        
        this.tableLoading = true;
        this.getWorkItemNum();

        let data = await Service("/workItem/findConditionWorkItemPage",this.searchCondition);
        if (data.code === 0) {
            if(this.workShowType === "lineMap" || this.workShowType === "gantt" ){
                if(this.searchCondition.pageParam.currentPage <= 1){
                    this.workList = data.data.dataList;
                }else {
                    this.workList = this.workList.concat(data.data.dataList)
                    console.log( this.workList)
                }
            }else {
                this.workList = data.data.dataList;
            }
            this.tableLoading = false;
            this.currentPage = this.searchCondition.pageParam.currentPage;
            this.totalPage = data.data.totalPage;
            this.total = data.data.totalRecord;
        }
        return data;
    }


    //按照条件查找事项 甘特图
    @action
    getWorkGanttListTree = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemPageTreeByQuery",this.searchCondition);
        return data.data;
    }


    //添加事项
    @action
    addWork = async(value) => {
        const params = {
            title: value.title,
            planBeginTime: value.planBeginTime,
            planEndTime: value.planEndTime,
            planTakeupTime: value.planTakeupTime,
            project: {
                id: value.project
            },
            workType: {
                id: value.workType
            },
            parentWorkItem: {
                id: value.parentWorkItem ||  "nullstring"
            },
            workPriority: {
                id: value.workPriority
            },
            workStatus: {
                id: value.workStatus
            },
            projectVersion: {
                id: value.projectVersion
            },
            module: {
                id: value.module
            },
            sprint: {
                id: value.sprint || "nullstring"
            },
            stage: {
                id: value.stage
            },
            assigner: {
                id: value.assigner
            },
            reporter: {
                id: value.reporter
            },
            builder: {
                id: value.builder
            },
            eachType: value.eachType,
            desc: value.desc || undefined,
            preDependWorkItem: {
                id: value.predependworkitem || "nullstring"
            },
            extData: JSON.stringify(value.extData),
            fieldId: value.fieldId

        }
        const data = await Service("/workItem/createWorkItem",params);
        return data
    }

    // 根据id查找事项列表
    @action
    searchWorkById = async(id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/workItem/findWorkItemAndSprintVersion",param);
        if(data.code === 0){
            this.workInfo = data.data;
        }
        return data.data;
    }

    // 根据id查找事项，和已关联过的迭代和版本
    @action
    findWorkItemById = async(id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/workItem/findWorkItemAndSprintVersion",param);

        return data;
    }

    // 创建事项附件 
    @action
    createWorkAttach = async(params) => {
        const data = await Service("/workAttach/createWorkAttach",params);
        return data;
    }

    // 根据id查找事项附件
    @action
    findWorkAttachList = async(value) => {
        const values = {
            workItemId: value,
        }
        const data = await Service("/workAttach/findWorkAttachList",values);
        if(data.code === 0){
            this.attachList = data.data;
        }
        return data;        
    }

    // 删除事项附件
    @action
    deleteWorkAttach = async(value) => {
        const params = new FormData();
        params.append("id", value)
        const data = await Service("/workAttach/deleteWorkAttach",params);
        return data;        
    }

    //删除事项
    @action
    deleteWorkItem = async(value) => {
        const params = new FormData()
        params.append("id", value)
        const data = await Service("/workItem/deleteWorkItem",params);
        return data;
    }

    // 删除事项及其子事项
    @action
    deleteWorkItemAndChildren = async(value) => {
        const params = new FormData()
        params.append("id", value)
        const data = await Service("/workItem/deleteWorkItemAndChildren",params);
        return data;
    }

    //编辑事项
    @action
    editWork = async(value) => {
        if (value.workStatusNode) {
            value.updateField = "workStatusNode"
            value.workStatusNode = {
                id: value.workStatusNode
            }
            value.workStatusCode = value.workStatusCode;
        }

        
        if (value.eachType) {
            value.eachType = value.eachType
        }

        const data = await Service("/workItem/updateWorkItem",value);
        return data;
    }

    // 修改事项状态 
    @action
    changeWorkStatus = async(value) => {
        let params = {
            updateField : "workStatusNode",
            id: value.id,
            flowId: value.flowId,
            workStatusNode: {
                id: value.workStatus
            }
        }
        const data = await Service("/workItem/updateWorkItem",params);
        return data;
    }


    // 修改计划日期
    changePercent = async(value) => {
        const data = await Service("/workItem/updateWorkItem",value);
        return data.data;
    }

    //获取优先级类型
    @action
    findPriority = async() => {
        const data = await Service("/field/findFieldList", {code: "workPriority"});
        if(data.code === 0){
            this.priorityList = data.data[0].selectItemList;
        }
        return data;
    }


    //获取事项类型
    @action
    getWorkTypeList = async(value) => {
        const data = await Service("/workTypeDm/findWorkTypeDmList",value);
        if(data.code === 0){
            this.workTypeList = data.data;
            data.data.map(item => {
                if(item.workType.code === "demand"){
                    this.demandTypeId = item.id;
                }
            })
            
        }
        return data.data;
    }

    //获取自定义的数据类型
    @action
    findWorkTypeList = async(value) => {
       const data = await Service("/workTypeDm/findWorkTypeDmList",value);
       return data;
    }

    //获取事项状态
    @action
    getWorkStatus = async() => {
        const params = {
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }
        const data = await Service("/stateNode/findAllStateNode",params);
        if(data.code === 0){
            this.workStatusList = data.data;
        }
        return data.data;
    }

    // 获取当前事项流程的节点
    @action
    findFlowDef = async (value) => {
        const param = new FormData()
        param.append("id", value.id)
        const data = await Service("/flow/findFlowDef",param);
        if (data.code === 0) {
            // if (data.data) {
            //     this.statesList = data.data.stateNodeList
            // }
        }
        return data;
    }

    // 上传文件
    @action
    uploadFile = async() => {
        const data = await Service("/dfs/upload");
        return data.data;
    }

    // 根据事项类型，获取自定义表单字段
    findFormConfig = async(value) => {
        const param = new FormData()
        param.append("formId", value.id)
        const data = await Service("/workType/findFormConfig", param);
        if(data.code === 0){
            this.formList = data.data?.customFieldList;
        }
        return data;
    }

    // 获取状态列表
    findToNodeList = async(value) => {
        const params = new FormData()
        params.append("nodeId", value.nodeId);
        params.append("flowId", value.flowId);
        const data = await Service("/stateNode/findTransitionList", params);
        if(data.code === 0){
            if (data.data && data.data.length > 0) {
                this.statesList = data.data
            } else {
                this.statesList = null
            }
        }
        return data;
    }

    // 获取事项状态流转列表
    findTransitionList = async(value) => {
        const data = await Service("/transition/findTransitionListByBusiness", value);
        return data;
    }


    // 根据事项类型code获取事项类型
    @action
    findDmWorkTypeByCode = async(value) => {
        const params = new FormData()
        params.append("code", value.code)
        params.append("projectId", value.projectId)
        const data = await Service("/workTypeDm/findDmWorkTypeByCode", params);

        return data;
    }

    // 获取状态列表
    @action
    findStateNodeList = async(value) => {
        const data = await Service("/stateNode/findQuickFilterStateNodeList", value)
        return data;

    }


    // 获取逾期事项列表
    @action
    statWorkItemOverdue = async(value) => {
        let params = {
            projectId: value.projectId,
            sprintId: value.sprintId,
            orderParams: [{
                name: "code",
                orderType: "desc"
            }],
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }
        const data = await Service("/workItemStat/statWorkItemOverdue", params)
        if (data.code === 0) {
            this.workList = data.data.dataList;
            this.currentPage = this.searchCondition.pageParam.currentPage;
            this.totalPage = data.data.totalPage;
            this.total = data.data.totalRecord;
        }
        return data.data;
    }

    // 根据id查找事项
    @action
    findWorkItem = async(value) => {
        const params = new FormData()
        params.append("id", value.id)
        const data = await Service("/workItem/findWorkItem", params)
        if(data.code === 0){
            this.workList = [data.data];
            this.currentPage = this.searchCondition.pageParam.currentPage;
            this.totalPage = data.data.totalPage;
            this.total = data.data.totalRecord;
        }
        return data;

    }

    // 创建最近访问
    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;

    }

    // 获取字段列表
    @action
    findFieldList = async (value) => {
        const data = await Service("/field/findFieldList", value)
        return data;

    }

    //获取项目内事项类型
    @action
    findWorkTypeDmList = async (value) => {
        const data = await Service("/workTypeDm/findWorkTypeDmList", value);
        return data;

    }

    // 获取流程列表
    @action
    findDmFlowList = async (value) => {
        const data = await Service("/dmFlow/findDmFlowList", value);
        return data;

    }

    // 导出事项表格
    @action
    exportWorkItemXml = async () => {
        // const data = await Axios("/exportfile/exportWorkItemXml", this.searchCondition);
        const data = axios.request({
            baseURL: base_url,
            url: "/exportfile/exportWorkItemXml",
            method: "post",
            data: this.searchCondition,
            headers: {
                ticket: getUser().ticket,
                tenant: getUser().tenant
            },
            responseType: "blob"
        })
        return data;

    }

    // 查找能被设置为上级的事项列表
    @action
    findCanBeRelationParentWorkItemList = async (value) => {
        const data = await Service("/workItem/findCanBeRelationParentWorkItemList", value)
        return data;
    }
    
    //根据id 或者事项标题查找可被关联成的前置事项列表
    @action
    findCanBeRelationPerWorkItemList = async (value) => {
        const data = await Service("/workItem/findCanBeRelationPerWorkItemList", value)
        return data;
    }

    // 获取事项关联的各个相关模型的个数，子事项，关联事项，评论，文档、动态，用于事项详情页面的tab的展示
    @action
    findWorkItemRelationModelCount = async (value) => {
        const params = new FormData();
        params.append("workItemId", value.workItemId)
        params.append("workTypeCode", value.workTypeCode)
        const data = await Service("/workItem/findWorkItemRelationModelCount", params)
        return data;
    }

    // 获取事项关联的版本
    @action
    findWorkVersionList = async (value) => {
        const params = new FormData();
        params.append("workId", value)
        const data = await Service("/projectVersion/findWorkVersionList", params)
        return data;
    }

    // 获取事项关联的迭代
    @action
    findWorkSprintList = async (value) => {
        const params = new FormData();
        params.append("workId", value)
        const data = await Service("/sprint/findWorkSprintList", params)
        return data;
    }

    // 查看事项有几级下级事项
    @action
    findChildrenLevel = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findChildrenLevel", params)
        return data;
    }

    //获取事项及其子事项
    @action
    findWorkItemAndChidren = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/findWorkItemAndChidren", params)
        return data;
    }

    // 查看事项是否有子事项
    @action
    haveChildren = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workItem/haveChildren", params)
        return data;
    }

    // 创建事项与表单选项的关联
    @action
    createSelectItemRelation = async(value) => {
        const data = await Service("/selectItemRelation/createSelectItemRelation", value)
        return data;
    }

    // 创建时间与字段选项的关联关系
    @action
    createCheckboxSelectItemRelation = async(value) => {
        const data = await Service("/selectItemRelation/createCheckboxSelectItemRelation", value)
        return data;
    }

    // 获取用户权限
    @action
    findUserWorkFunction = async(value) => {
        const data = await Service("/workRoleFunction/findUserWorkFunction", value)
        return data;
    }


    // 获取流程
    @action
    findFlow = async(value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/flow/findFlow", params)
        return data;
    }

    // 获取事项的表单字段和功能的权限列表
    @action
    findWorkItemRoleFunctionDmCode = async(value) => {

        const data = await Service("/workItemRoleFunctionDm/findWorkItemRoleFunctionDmCode", value)
        if(data.code === 0){
            this.permissionFieldList = data.data;
        }
        return data;
    }
}
export default new WorkStore();