import { observable, action } from "mobx";
import { GetAllProList } from "../../project/api/project";
import { getModuleList } from "../../../projectSet/module/api/module";
import { GetsprintAll } from "../../sprint/api/sprint";
import {
    AddWork, SearchWorkById, DetWork,
    EditWork, Priority, WorkType, FindDmUserPage, WorkStatus, WorkList,
    WorkListByPageTree, UploadFile, WorkBoardList, FindWorkAttachList,
    CreateWorkAttach, WorkListByListTree, FindFormConfig, GetStateList,
    WorkChildrenListByListTree, FindWorkItemPageTreeByQuery, FindFlowDef,
    FindWorkItemList, FindWorkUserGroupBoardList,FindWorkTypeIds
} from "../api/work";
export class WorkStore {
    @observable workBoardList = [];
    @observable workUserGroupBoardList = [];
    @observable workList = [];
    @observable workListTime = []

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

    // 默认页数，总页数
    @observable defaultCurrent = 1;
    @observable total = []

    @observable editorContent = [];
    @observable searchCondition = {
        parentIdIsNull: true,
        orderParams: [{
            name: "title",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
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
    @observable workShowType = "list"

    // 事项的视图类型
    @observable viewType = "tree"
    @observable boardGroup = "nogroup"

    // 自定义表单列表
    @observable formList = []

    // 状态列表
    @observable statesList = []
    @observable workBoardListLenght = 0;

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
    getProlist = async () => {
        const data = await GetAllProList()
        this.projectList = data.data;
    }

    // 根据项目id查找
    @action
    getModuleList = (projectid, modulename) => {
        const params = {
            projectId: projectid,
            moduleName: modulename,
            orderParams: [{
                name: "moduleName",
                orderType: "asc"
            }]
        }
        return new Promise((resolve, reject) => {
            getModuleList(params).then(response => {
                if (response.code === 0) {
                    this.moduleList = response.data;
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })

    }

    // 根据项目id查找迭代
    @action
    getsprintlist = (projectid) => {
        const params = {
            projectId: projectid,
            sprintName: "",
            orderParams: [{
                name: "sprintName",
                orderType: "asc"
            }]
        }
        return new Promise((resolve, reject) => {
            GetsprintAll(params).then(response => {
                if (response.code === 0) {
                    this.sprintList = response.data;
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //获取已选择人员
    @action
    getSelectUserList = (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        FindDmUserPage(params).then(response => {
            this.userList = response.data.dataList;
        }).catch(error => {
            console.log(error)
        })
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
        Object.assign(this.searchCondition, { ...value })
    }

    @action
    setSearchConditionNull = async () => {
        const that = this;
        function setValue() {
            that.searchCondition = {
                parentIdIsNull: true,
                sortParams: [{
                    name: "title",
                    orderType: "asc"
                }],
                pageParam: {
                    pageSize: 10,
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
            this.workList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data.data;

    }

    @action
    getWorkConditionPage = async (value) => {
        this.setSearchCondition(value);
        this.searchCondition.parentIdIsNull = null
        let data = await FindWorkItemList(this.searchCondition);
        if (data.code === 0) {
            this.workList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data.data;

    }


    //按照条件查找事项 甘特图
    @action
    getWorkGanttListTree = (value) => {
        this.setSearchCondition(value)
        const params = {
            projectId: this.searchCondition.project,
            workTypeId: this.searchCondition.workType,
            sprintId: this.searchCondition.sprint,
            workStatusId: this.searchCondition.workStatus,
            title: this.searchCondition.title,
            sortParams: [{
                name: "title",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
                currentPage: this.searchCondition.currentPage
            }
        }

        return new Promise((resolve, reject) => {
            WorkListByListTree(params).then(response => {
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
            sortParams: [{
                name: "title",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 10,
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
    addWork = (value) => {
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
            desc: value.desc || undefined,
            preDependWorkItem: {
                id: value.predependworkitem || "nullstring"
            },
            extData: JSON.stringify(value.extData)

        }
        return new Promise((resolve, reject) => {
            AddWork(params).then(response => {
                this.getsprintlist()
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 根据id查找事项列表
    @action
    searchWorkById = (id, index) => {
        const param = new FormData()
        param.append("id", id)

        return new Promise((resolve, reject) => {
            SearchWorkById(param).then(response => {
                this.workInfo = response.data;
                if (!response.data.parentWorkItem) {
                    this.defaultCurrent = index
                }

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
    editWork = (value) => {
        if (value.workType) {
            value.updateField = "workType"
            value.workType = {
                id: value.workType
            }
        }
        if (value.workPriority) {
            value.updateField = "workPriority"
            value.workPriority = {
                id: value.workPriority
            }
        }
        if (value.workStatus) {
            value.updateField = "workStatus"
            value.workStatus = {
                id: value.workStatus
            }
        }
        if (value.module) {
            value.module = {
                id: value.module
            }
        }
        if (value.sprint) {
            value.sprint = {
                id: value.sprint
            }
        }
        if (value.assigner) {
            value.assigner = {
                id: value.assigner
            }
        }
        if (value.reporter) {
            value.reporter = {
                id: value.reporter
            }
        }
        if (value.builder) {
            value.builder = {
                id: value.builder
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
        if (value.preDependWorkItem) {
            value.extData = JSON.stringify(value.extData)
        }
        return new Promise((resolve, reject) => {
            EditWork(value).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 修改事项状态
    @action
    changeWorkStatus = (value) => {
        let params = {
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
    priority = () => {
        return new Promise((resolve, reject) => {
            Priority().then(response => {
                this.priorityList = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    //获取事项类型
    @action
    getWorkType = () => {
        return new Promise((resolve, reject) => {
            WorkType().then(response => {
                this.workTypeList = response.data;
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    //获取事项状态
    @action
    workStatus = () => {
        const params = {
            pageParam: {
                pageSize: 10,
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
    findFormConfig = (value) => {
        const param = new FormData()
        param.append("workTypeId", value.workTypeId)

        return new Promise((resolve, reject) => {
            FindFormConfig(param).then(response => {
                if (response.code === 0) {
                    if (response.data) {
                        this.formList = response.data.fieldList
                    } else {
                        this.formList = null
                    }

                }
                resolve(response.data)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    // 获取状态列表
    getStateList = (value) => {
        const params = new FormData()
        params.append("nodeId", value.nodeId)
        return new Promise((resolve, reject) => {
            GetStateList(params).then(response => {
                if (response.code === 0) {
                    if (response.data && response.data.length > 0) {
                        this.statesList = response.data
                    } else {
                        this.statesList = null
                    }
                }
                resolve(response)
            }).catch(error => {
                console.log(error)
                reject()
            })
        })
    }

    @action
    findWorkTypeIds = async(value) => {
        const params = new FormData()
        params.append("code", value.code)
        const data = await FindWorkTypeIds(params)

        return data;

    }
}
export const AFFAIR_STORE = "workStore"