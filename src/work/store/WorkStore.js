import { observable, action, extendObservable } from "mobx";
import { Service } from "../../common/utils/requset";
import axios from "axios";
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
    @observable sprintList = [];
    @observable userList = [];
    @observable workAllList = [];

    @observable priorityList = [];
    @observable workTypeList = [];
    @observable workStatusList = [];
    @observable workInfo = [];
    @observable workBreadCrumbText = "全部事项";
    // 快捷搜索选中值
    @observable quickFilterValue = {label: '所有', value: 'all'}
    // 默认页数，总页数
    @observable defaultCurrent = 1;
    @observable total = 1
    @observable totalPage = 1
    @observable currentPage = 1
    @observable editorContent = [];
    @observable searchCondition = {
        orderParams: [{
            title: "标题",
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1,
        }
    };
    @observable workId = "";
    @observable workIndex = "";

    
    // 当前事项的状态index 
    @observable indexParams = {
        statusIndex: "",
        workIndex: ""
    }

    // 附件列表
    @observable attachList = []

    // 事项的视图类型
    @observable workShowType = "table"

    // 事项的视图类型
    @observable viewType = "tree"
    @observable boardGroup = "nogroup"

    // 自定义表单列表
    @observable formList = []

    // 状态列表
    @observable statesList = []
    @observable workBoardListLenght = 0;

    //事项状态
    @observable workType = ""
    @observable tabValue = {id: "all", type: "system"};
    @observable detailCrumbArray = [];
    @observable isWorkList = true;
    
    @action
    setIsWorkList = (value) => {
        this.isWorkList = value
    }
    @action
    setDefaultCurrent = (value) => {
        this.defaultCurrent = value;
    }
    @action
    setDetailCrumbArray = (value) => {
        this.detailCrumbArray = value
    }

    @action
    setAlertText = (value) => {
        this.alertText = value
    }

    @action
    setIsShowAlert = (value) => {
        this.isShowAlert = value
    }


    @action
    setWorkList = (value) => {
        this.workList = value
    }
    
    @action
    setWorkBreadCrumbText = (value) => {
        this.workBreadCrumbText = value
    }

    @action
    setEditorContent = (value) => {
        this.editorContent = value
    }

    @action
    setWorkId = (value) => {
        this.workId = value
    }

    // 获取当前事项index
    @action
    setWorkIndex = (value) => {
        this.workIndex = value
    }

    @action
    setWorkShowType = (value) => {
        this.workShowType = value
    }

    @action
    setViewType = (value) => {
        this.viewType = value
    }

    @action
    setBoardGroup = (value) => {
        this.boardGroup = value
    }

    @action
    setWorkType = (value) => {
        this.workType = value
    }

    @action
    setTabValue = (value) => {
        this.tabValue = value
    }

    @action
    setQuickFilterValue = (value) => {
        this.quickFilterValue = value
    }

    // 看板视图当前事项的状态的index
    setIndexParams = (workIndex, statusIndex) => {
        this.indexParams.workIndex = workIndex
        this.indexParams.statusIndex = statusIndex
    }

    // 看板视图移动位置后，列表交换
    changeBorderList = (startBoxIndex, startWorkBoxIndex, index, targetStatusId) => {
        Object.assign(this.workBoardList[startBoxIndex].workItemList[startWorkBoxIndex], { workStatus: { id: targetStatusId } })
        this.workBoardList[index].workItemList.push(this.workBoardList[startBoxIndex].workItemList[startWorkBoxIndex])
        this.workBoardList[startBoxIndex].workItemList.splice(startWorkBoxIndex, 1)
    }

    // 若调用接口失败，则还原
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

    // 根据项目id查找迭代
    @action
    getsprintlist = async(projectid) => {
        const params = {
            projectId: projectid,
            sprintName: "",
            orderParams: [{
                name: "sprintName",
                orderType: "asc"
            }]
        }
        const data = await Service("/sprint/findSprintList",params);
        if (data.code === 0) {
            this.sprintList = data.data;
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
                if(newIds.indexOf(item.user.id)> -1){
                    return null
                }else {
                    newIds.push(item.user.id)
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
        const data = await Service("/workItem/findWorkBoardList",this.searchCondition);
        if (data.code === 0) {
            this.workBoardList = data.data;
            const listLength = this.workBoardList.length
            let length = this.workBoardList[0].workItemList.length;
            for (let j = 1; j < listLength; j++) {
                if (this.workBoardList[j].workItemList.length > length) {
                    length = this.workBoardList[j].workItemList.length;
                }
            }
            this.workBoardListLenght = length;
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

    @action
    setSearchCondition = (value) => {
        this.searchCondition = Object.assign(this.searchCondition,  { ...value })
    }

    @action
    setSearchConditionNull = async () => {
        const that = this;
        function setValue() {
            that.searchCondition = {
                orderParams: [{
                    name: "title",
                    orderType: "asc"
                }],
                pageParam: {
                    pageSize: 20,
                    currentPage: 1,
                }
            }
        }
        await setValue();
    }

    /**
     * 
     * @param {*} value 
     * @returns 
     */
    @action
    getWorkConditionPageTree = async(value) => {
        
        this.tableLoading = true;

        this.setSearchCondition(value)
        let data = [];
        data = await Service("/workItem/findWorkItemPageTreeByQuery",this.searchCondition);
        if (data.code === 0) {
            this.tableLoading = false;
            if(this.searchCondition.pageParam.currentPage === 1 || this.workShowType !== "list" ){
                this.workList = data.data.dataList
            }
            if(this.searchCondition.pageParam.currentPage > 1 && this.workShowType === "list" ) {
                this.workList.push(...data.data.dataList);
            }
            
            this.currentPage = this.searchCondition.pageParam.currentPage;
            this.totalPage = data.data.totalPage;
            this.total = data.data.totalRecord;
            
        }
        return data.data;

    }

    @action
    getWorkConditionPage = async (value) => {
        this.setSearchCondition(value);
        this.tableLoading = true;
        let data = await Service("/workItem/findConditionWorkItemPage",this.searchCondition);
        if (data.code === 0) {
            this.tableLoading = false;
            this.workList = data.data.dataList;
            this.currentPage = this.searchCondition.pageParam.currentPage;
            this.totalPage = data.data.totalPage;
            this.total = data.data.totalRecord;
        }
        return data.data;
    }


    //按照条件查找事项 甘特图
    @action
    getWorkGanttListTree = async(value) => {
        this.setSearchCondition(value)
        const data = await Service("/workItem/findWorkItemPageTreeByQuery",this.searchCondition);
        return data.data;
    }

    //按照条件查找事项  子事项
    @action
    getWorkListTree = async(value) => {
        this.setSearchCondition(value)
        const params = {
            projectId: this.searchCondition.project,
            workTypeId: this.searchCondition.workType,
            sprintId: this.searchCondition.sprint,
            workStatusId: this.searchCondition.workStatus,
            title: this.searchCondition.title,
            parentId: this.searchCondition.parentId,
            orderParams: [{
                name: "title",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 20,
                currentPage: this.searchCondition.currentPage
            }
        }
        const data = await Service("/workItem/findWorkItemListTree",params);
        if (data.code === 0) {
            this.workListTime = data.data;
        }
        return data;
    }

    //添加事项列表
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
                id: value.parentWorkItem
            },
            workPriority: {
                id: value.workPriority
            },
            workStatus: {
                id: value.workStatus
            },
            module: {
                id: value.module
            },
            sprint: {
                id: value.sprint || "nullstring"
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
            extData: JSON.stringify(value.extData)

        }
        const data = await Service("/workItem/createWorkItem",params);
        return data
    }

    // 根据id查找事项列表
    @action
    searchWorkById = async(id) => {
        const param = new FormData()
        param.append("id", id)
        const data = await Service("/workItem/findWorkItem",param);
        if(data.code === 0){
            this.workInfo = data.data;
        }
        return data.data;
    }

    // 创建事项附件
    @action
    createWorkAttach = async(workId, fileName) => {
        const params = {
            workItem: {
                id: workId
            },
            attachment: {
                fileName: fileName
            }
        }
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

    //删除事项
    @action
    detWork = async(value) => {
        const params = new FormData()
        params.append("id", value)
        const data = await Service("/workItem/deleteWorkItem",params);
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
        if(data.code === 0){
            return data;
        }
    }

    // 修改事项状态
    @action
    changeWorkStatus = async(value) => {
        let params = {
            updateField : "workStatus",
            id: value.id,
            flowId: value.flowId,
            workStatusNode: {
                id: value.workStatus
            }
        }
        const data = await Service("/workItem/updateWorkItem",params);
        return data;
    }

    // 修改字段
    // updateWorkItem = async(value) => {
    //     const data = await Service("/workItem/updateWorkItem",params);
    //     return data;

    // }

    // 修改计划日期
    changePercent = async(value) => {
        const data = await Service("/workItem/updateWorkItem",value);
        return data.data;
    }

    //获取优先级类型
    @action
    findPriority = async() => {
        const data = await Service("/workPriority/findAllWorkPriority");
        if(data.code === 0){
            this.priorityList = data.data;
        }
        return data;
    }

    //获取事项类型
    @action
    getWorkTypeList = async(value) => {
        const data = await Service("/workTypeDm/findWorkTypeDmList",value);
        if(data.code === 0){
            this.workTypeList = data.data;
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


    @action
    setMenuFold = (index) => {

        this.menuFold[index] = !this.menuFold[index]
    }

    // 上传文件
    @action
    uploadFile = async() => {
        const data = await Service("/dfs/upload");
        return data.data;
    }

    // 根据事项类型，获取自定义表单
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
        const data = await Service("/stateNode/findToNodeList", params);
        if(data.code === 0){
            if (data.data && data.data.length > 0) {
                this.statesList = data.data
            } else {
                this.statesList = null
            }
        }
        return data;
    }

    @action
    findWorkTypeIds = async(value) => {
        const params = new FormData()
        params.append("code", value.code)
        const data = await Service("/workType/findWorkTypeIds", params);
        return data;

    }

    @action
    findTaskWorkType = async(value) => {
        const params = new FormData()
        params.append("code", value.code)
        params.append("projectId", value.projectId)
        const data = await Service("/workTypeDm/findTaskWorkType", params);

        return data;

    }

    @action
    findStateNodeList = async(value) => {
        const data = await Service("/stateNodeFlow/findStateNodeFlowList", value)
        return data;

    }

    @action
    statWorkItemOverdue = async(value) => {
        let params = {
            projectId: value.projectId,
            sprintId: value.sprintId,
            orderParams: [{
                name: "title",
                orderType: "asc"
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
            totalPage
        }
        return data.data;
    }

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

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;

    }

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

    @action
    findDmFlowList = async (value) => {
        const data = await Service("/dmFlow/findDmFlowList", value);
        return data;

    }

    @action
    exportWorkItemXml = async () => {
        // const data = await Axios("/exportfile/exportWorkItemXml", this.searchCondition);
        const data = axios.request({
            baseURL: base_url,
            url: "/exportfile/exportWorkItemXml",
            method: "post",
            data: this.searchCondition,
            headers: {
                ticket: "6badca4a463a4723bfa20476d6862f5c21"
            },
            responseType: "blob"
        })
        return data;

    }
    

}
export const AFFAIR_STORE = "workStore"