/*
 * @Author: 袁婕轩
 * @Date: 2024-12-26 16:53:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 17:47:17
 * @Description: 事项接口
 */

import {Axios} from "tiklab-core-ui";
import { observable, action } from "mobx";
import {value} from "lodash/seq";
export class WorkStore {
    @observable workBoardList = [];
    @observable workItemStatusList = [];
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

    // 路线图中使用的搜索条件
    @observable workItemStatusSearchCondition = {
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
    @observable workItemTimeSearchCondition = {
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
    @observable workItemStatusListLength = 0;

    //事项状态
    @observable workType = ""
    @observable tabValue = {id: "all", type: "system"};
    @observable detailCrumbArray = [];
    @observable isWorkList = true;
    @observable eveWorkTypeNum = {};
    @observable workBoardCurrentPage = [];
    @observable workItemStatusCurrentPage = [];
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


    @action
    findWorkItemCreateMetaData = async (value) => {
        const params = {
            projectId:value.projectId,
            fieldCode:["bugType","workPriority"]
        }

        const data = await Axios.post("/workItemMetaData/findCreateMetaData", params);
        if(data.code === 0){
            this.formList.length = 0;
            this.formList.push(data.data?.form?.customFieldList);

            this.stageList = data.data.stageList;

            this.selectSprintList = data.data.sprintList;

            this.selectVersionList = data.data.versionList;

            this.moduleList = data.data.moduleList;

            this.priorityList=data.data.fieldList[1][0].selectItemList

            const list = data.data.dmUserPage.dataList;
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
        return data;
    }

    @action
    findWorkItemDetailMetaData = async (workItemId) => {
        const param = {
            workItemId:workItemId,
        }

        const data = await Axios.post("/workItemMetaData/findDetailMetaData", param);
        if(data.code === 0){

            this.attachList = data.data.workAttachList;

            this.workTypeList = data.data.workTypeDmList;
            data.data.workTypeDmList.map(item => {
                if(item.workType.code === "demand"){
                    this.demandTypeId = item.id;
                }
            })

            this.selectVersionList = data.data.versionList;

            this.selectSprintList = data.data.sprintList;

            this.formList = data.data?.form?.customFieldList

            this.stageList = data.data.stageList;

            this.sprintList = data.data.sprintList;

            this.versionList = data.data.versionList;

            this.moduleList = data.data.moduleList;

            this.priorityList=data.data.fieldList[1][0].selectItemList

            const list = data.data.dmUserPage.dataList;
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
        return data;
    }

    @action
    addWork = async (value) => {
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
            // builder: {
            //     id: value.builder
            // },
            eachType: value.eachType,
            desc: value.desc || undefined,
            preDependWorkItem: {
                id: value.predependworkitem || "nullstring"
            },
            extData: JSON.stringify(value.extData),
            fieldId: value.fieldId,
            caseId:value.caseId

        }
        const data = await Axios.post("/workItem/createWorkItem", params);
        return  data;
    }

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

        const data = await Axios.post("/workItem/updateWorkItem",value);
        return data;
    }

    @action
    deleteWork = async (id) => {
        let formData = new FormData();
        formData.append("id", id)
        const data = await Axios.post("/workItem/deleteWorkItem", formData);
        return data;
    }

    @action
    findWorkItemRoleFunctionDmCode = async (param) => {

        const data = await Axios.post("/workItemRoleFunctionDm/findWorkItemRoleFunctionDmCode", param);
        if(data.code === 0){
            this.permissionFieldList=data.data;
        }
        return data;
    }

    @action
    haveChildren  = async (id) => {
        let formData = new FormData();
        formData.append("id",id);
        const data = await Axios.post("/workItem/haveChildren",formData);
        return data;
    }

    @action
    createWorkAttach = async(params) => {
        const data = await Axios.post("/workItemAttach/createWorkAttach",params);
        return data;
    }

    @action
    findWorkAttachList = async(value) => {
        const values = {
            workItemId: value,
        }
        const data = await Axios.post("/workItemAttach/findWorkAttachList",values);
        if(data.code === 0){
            this.attachList = data.data;
        }
        return data;
    }

    // 删除事项附件
    @action
    deleteWorkAttach = async(id) => {
        const params = new FormData();
        params.append("id", id)
        const data = await Axios.post("/workItemAttach/deleteWorkAttach",params);
        return data;
    }

    /**
     * 查询事项状态流转列表
     * @param params
     * @returns {Promise<unknown>}
     */
    @action
    findTransitionList = async(params) => {
        const data = await Axios.post("/teamWire/findTransitionList",params);
        return data;
    }
}

const workItemStore = new WorkStore();
export default workItemStore;