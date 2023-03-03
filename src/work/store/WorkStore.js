import { observable, action, extendObservable } from "mobx";
import { GetAllProList } from "../../project/project/api/ProjectApi";
import { getModuleList } from "../../project/setting/module/api/ModuleApi";
import {
    AddWork, SearchWorkById, DetWork,
    EditWork, FindPriority, WorkType, FindDmUserPage, WorkStatus, WorkList,
    UploadFile, WorkBoardList, FindWorkAttachList, CreateWorkAttach,
    FindFormConfig, FindToNodeList,WorkChildrenListByListTree, FindWorkItemPageTreeByQuery,
    FindFlowDef,FindWorkItemList, FindWorkUserGroupBoardList,FindWorkTypeIds,FindSprintList,
    FindTaskWorkType, FindStateNodeList, StatWorkItemOverdue, FindWorkItem,CreateRecent,
    FindWorkTypeList, FindFieldList, FindDmFlowList
} from "../api/WorkApi";

export class WorkStore {
    @observable workBoardList = [];
    @observable workUserGroupBoardList = [];
    @observable workList = [];
    @observable workListTime = [];
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
    @observable workTabs = "all";
    @observable detailCrumbArray = [];

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
        console.log(value)
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
    setWorkTabs = (value) => {
        this.workTabs = value
    }

    // 看板视图当前事项的状态的index
    setIndexParams = (workIndex, statusIndex) => {
        this.indexParams.workIndex = workIndex
        this.indexParams.statusIndex = statusIndex
    }

    // 看板视图移动位置后，列表交换
    changeBorderList = (startBoxIndex, startWorkBoxIndex, index, targetStatusId) => {
        console.log(this.workBoardList)
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
        const data = await GetAllProList()
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
        const data = await getModuleList(params);
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
        const data = await FindSprintList(params);
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
        const data = await FindDmUserPage(params)
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
    getWorkAllList = (value) => {

        return new Promise((resolve, reject) => {
            WorkList(value).then(response => {
                this.workAllList = response.data;

                resolve(response.data.dataList)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 获取看板视图事项列表
    getWorkBoardList = async (value) => {
        this.setSearchCondition(value)
        const data = await WorkBoardList(this.searchCondition);
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
        const data = await FindWorkUserGroupBoardList(this.searchCondition);

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
                console.log(length)
                item.length = length;
                return item;
            })
            console.log(this.workUserGroupBoardList)
        }
        return data;
    }

    @action
    setSearchCondition = (value) => {
        this.searchCondition = extendObservable(this.searchCondition,  { ...value })
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
    getWorkConditionPageTree = async (value) => {
        this.setSearchCondition(value)
        let data = [];
        data = await FindWorkItemPageTreeByQuery(this.searchCondition);
        if (data.code === 0) {
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
        let data = await FindWorkItemList(this.searchCondition);
        if (data.code === 0) {
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

        const data = await FindWorkItemPageTreeByQuery(this.searchCondition);
        return data.data;
    }

    //按照条件查找事项  子事项
    @action
    getWorkListTree = (value) => {
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

        return new Promise((resolve, reject) => {
            WorkChildrenListByListTree(params).then(response => {
                if (response.code === 0) {
                    this.workListTime = response.data;
                    resolve(response.data)
                }

            }).catch(error => {
                console.log(error)
                reject()
            })
        })
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
        const data = await AddWork(params);
        return data
    }

    // 根据id查找事项列表
    @action
    searchWorkById = (id, index) => {
        const param = new FormData()
        param.append("id", id)

        return new Promise((resolve, reject) => {
            SearchWorkById(param).then(response => {
                this.workInfo = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 创建事项附件
    @action
    createWorkAttach = (workId, fileName) => {
        const params = {
            workItem: {
                id: workId
            },
            attachment: {
                fileName: fileName
            }
        }
        return new Promise((resolve, reject) => {
            CreateWorkAttach(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 根据id查找事项附件
    @action
    findWorkAttachList = (value) => {
        const values = {
            workItemId: value,
        }
        return new Promise((resolve, reject) => {
            FindWorkAttachList(values).then(response => {
                this.attachList = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    //删除事项
    @action
    detWork = (value) => {
        const params = new FormData()
        params.append("id", value)
        return new Promise((resolve, reject) => {
            DetWork(params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    //编辑事项
    @action
    editWork = async(value) => {
        // if (value.workType || String(value.workType) === "0") {
        //     value.updateField = "workType"
        //     value.workType = {
        //         id: value.workType
        //     }
        // }
        if (value.workPriority || String(value.workPriority) === "0") {
            value.updateField = "workPriority"
            value.workPriority = {
                id: value.workPriority
            }
            value.flowId = value.flowId
        }
        if (value.workStatusNode) {
            value.updateField = "workStatusNode"
            value.workStatusNode = {
                id: value.workStatusNode
            }
            value.workStatusCode = value.workStatusCode;
        }

        if (value.module || String(value.module) === "0") {
            value.module = {
                id: value.module
            }
        }
        if (value.sprint || String(value.sprint) === "0") {
            value.sprint = {
                id: value.sprint
            }
        }
        if (value.assigner || String(value.assigner) === "0") {
            value.assigner = {
                id: value.assigner
            }
        }
        if (value.reporter || String(value.reporter) === "0") {
            value.reporter = {
                id: value.reporter
            }
        }
        if (value.builder || String(value.builder) === "0") {
            value.builder = {
                id: value.builder
            }
        }
        if (value.parentWorkItem) {
            value.parentWorkItem = {
                id: value.parentWorkItem
            }
        }
        if (value.attachment) {
            value.fileName = {
                id: value.attachment
            }
        }
        if (value.preDependWorkItem) {
            value.preDependWorkItem = {
                id: value.preDependWorkItem
            }
        }
        if (value.extData) {
            value.extData = JSON.stringify(value.extData)
        }
        if (value.eachType) {
            value.eachType = value.eachType
        }

        const data = await EditWork(value)
        if(data.code === 0){
            return data;
        }
    }

    // 修改事项状态
    @action
    changeWorkStatus = (value) => {
        let params = {
            updateField : "workStatus",
            id: value.id,
            workStatus: {
                id: value.workStatus
            }
        }
        return new Promise((resolve, reject) => {
            EditWork(params).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 修改字段
    updateWorkItem = (value) => {
        return new Promise((resolve, reject) => {
            EditWork(value).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })

    }

    // 修改计划日期
    changePercent = (value) => {
        return new Promise((resolve, reject) => {
            EditWork(value).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    //获取优先级类型
    @action
    findPriority = async() => {

        const data = await FindPriority();
        if(data.code === 0){
            this.priorityList = data.data;
        }
        return data;
    }

    //获取事项类型
    @action
    getWorkTypeList = (value) => {
        // const params = {
        //     projectId: value.projectId,
        //     scope: 1
        // }
        return new Promise((resolve, reject) => {
            FindWorkTypeList(value).then(response => {
                this.workTypeList = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    //获取自定义的数据类型
    @action
    findWorkTypeList = async(value) => {
       const data = await FindWorkTypeList(value);
       return data;
    }

    //获取事项状态
    @action
    getWorkStatus = () => {
        const params = {
            pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        }
        return new Promise((resolve, reject) => {
            WorkStatus(params).then(response => {
                this.workStatusList = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 获取当前事项流程的节点
    @action
    findFlowDef = async (value) => {
        const param = new FormData()
        param.append("id", value.id)
        const data = await FindFlowDef(param);
        if (data.code === 0) {
            if (data.data) {
                this.statesList = data.data.stateNodeList
            }
        }
        return data;
    }


    @action
    setMenuFold = (index) => {

        this.menuFold[index] = !this.menuFold[index]
    }

    // 上传文件
    @action
    uploadFile = () => {
        return new Promise((resolve, reject) => {
            UploadFile().then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 根据事项类型，获取自定义表单
    findFormConfig = async(value) => {
        const param = new FormData()
        param.append("formId", value.id)
         
        const data = await FindFormConfig(param);
        if(data.code === 0){
            this.formList = data.data?.customFieldList;
        }
        return data;
    }

    // 获取状态列表
    findToNodeList = async(value) => {
        const params = new FormData()
        params.append("nodeId", value.nodeId);

        const data = await FindToNodeList(params);
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
        const data = await FindWorkTypeIds(params)

        return data;

    }

    @action
    findTaskWorkType = async(value) => {
        const params = new FormData()
        params.append("code", value.code)
        params.append("projectId", value.projectId)
        const data = await FindTaskWorkType(params)

        return data;

    }

    @action
    findStateNodeList = async(value) => {
        const data = await FindStateNodeList(value)

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
        const data = await StatWorkItemOverdue(params);
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
        const data = await FindWorkItem(params);
        // debugger
        console.log(data)
        
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
        const data = await CreateRecent(value)
        return data;

    }

    @action
    findFieldList = async (value) => {
        const data = await FindFieldList(value)
        return data;

    }

    //获取项目内事项类型
    @action
    findWorkTypeDmList = async (value) => {
        
        const data = await FindWorkTypeList(value)
        console.log(data)
        return data;

    }

    @action
    findDmFlowList = async (value) => {
        const data = await FindDmFlowList(value)
        return data;

    }

    

}
export const AFFAIR_STORE = "workStore"