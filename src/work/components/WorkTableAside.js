import React,{ useState, useRef, useEffect } from "react";
import { observer, inject, useStaticRendering } from "mobx-react";
import "./WorkTable.scss";
import "./WorkTableAside.scss"
const WorkTableAside=(props) => {
    const {workStore, form } =props
    const {setWorkBreadCrumbText,getWorkConditionPageTree,getWorkConditionPage, viewType, setSearchCondition,
        setWorkId, setWorkIndex, findStateNodeList, setSearchConditionNull,statWorkItemOverdue} = workStore;
   
    const workType = props.match.params.type ? props.match.params.type : null;
    const [workTypeText, setWorkTypeText] = useState("");
    const projectId = props.match.params.id ? props.match.params.id : null;

    useEffect(() => {
        switch (workType) {
            case "task":
                setWorkTypeText("任务");
                break;
            case "demand":
                setWorkTypeText("需求");
                break;
            case "defect":
                setWorkTypeText("缺陷");
                break;
            case "epic":
                setWorkTypeText("史诗");
                break;
            default:
                setWorkTypeText("事项");
                break;
        }
    },[workType])

    
    const [menuType, setMenuType] = useState("all");
    const selectMenu = (type, text) => {
        setMenuType(type)
        setWorkBreadCrumbText(text)
        switch(type){
            case "all":
               getAllWorkItem();
               break;
            case "pending":
                getPendingWorkItem();
                break;
            case "ending":
                getEndingWorkItem();
                break;
            case "creat":
                getCreatWorkItem();
                break;
            case "overdue":
                getOverdueWorkItem();
                break;
            default:
                break;

        }
    }
    const getWorkList = () =>{
        if (viewType === "tile") {
            getPageList();
        } else if (viewType === "tree") {
            getPageTree();
        }
    }

    const getAllWorkItem = () => {
        setSearchConditionNull()
        const initValues = {
            projectId: projectId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        getWorkList();

    }

    const getPendingWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }

        getStateNodeList({ quickName: "pending" }).then(data => {
            initValues = {workStatusIds: data, ...initValues}
            setSearchCondition(initValues)
            initFrom(initValues)
            getWorkList();
        })
    }

    const getEndingWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        getStateNodeList({ quickName: "done" }).then(data => {
            initValues = {workStatusIds: data, ...initValues}
            setSearchCondition(initValues)
            initFrom(initValues)
            getWorkList();
        })
    }

    const getCreatWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            projectId: projectId,
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        initFrom(initValues)
        getWorkList();
    }

    const getOverdueWorkItem = () => {
        setSearchConditionNull()
        let initValues = {
            pageParam: {
                pageSize: 20,
                currentPage: 1,
            }
        }
        setSearchCondition(initValues)
        initFrom(initValues)
        statWorkItemOverdue({projectId: projectId}).then(res => {
            setWorkId(res.dataList[0].id)
            setWorkIndex(1)
        })
    }

    const getStateNodeList = async(value) => {
        const stateNodeList = []
        await findStateNodeList(value).then(res => {
            if(res.code === 0){
                if(res.data.length > 0){
                    res.data.map(item => {
                        stateNodeList.push(item.id)
                    })
                }
            }
        })
        return stateNodeList;
    }

    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id" 
                ) {
                    setWorkIndex(1)
                    setWorkId(props.match.params.id)
                } else {
                    setWorkIndex(1)
                    setWorkId(res.dataList[0].id)
                }
            }else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    const getPageList = (value) => {
        getWorkConditionPage(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.match.path === "/index/projectDetail/:id/workMessage/:id") {
                    setWorkIndex(1)
                    setWorkId(props.match.params.id)
                } else {
                    setWorkIndex(1)
                    setWorkId(res.dataList[0].id)
                }
            }else {
                setWorkIndex(0)
                setWorkId(0)
            }
        })
    }

    const initFrom = (fromValue) => {
        form.setFieldsValue({
            projectIds: fromValue.projectIds ? fromValue.projectIds : [],
            workTypeIds: fromValue.workTypeIds ? fromValue.workTypeIds : [],
            workStatusIds: fromValue.workStatusIds ? fromValue.workStatusIds : [],
            title: fromValue.title ? fromValue.title : "",
            assignerIds: fromValue.assignerIds ? fromValue.assignerIds : []
        })
    }

    return (
        <div className="work-table-aside">
            <div className="table-aside-title">
                <span>{workTypeText}</span>
            </div>
            <div className={`table-aside-item ${menuType === "all" ? "table-aside-focus" : ""}`} onClick={() => selectMenu("all","所有事项")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-process"></use>
                </svg>
                所有事项
            </div>
            <div className={`table-aside-item ${menuType === "pending" ? "table-aside-focus" : ""}`} onClick={() => selectMenu("pending","我的待办")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-process"></use>
                </svg>
                我的待办
            </div>
            <div className={`table-aside-item ${menuType === "ending" ? "table-aside-focus" : ""}`} onClick={() => selectMenu("ending","我的已办")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-end"></use>
                </svg>
                我的已办
            </div>
            <div className={`table-aside-item ${menuType === "creat" ? "table-aside-focus" : ""}`} onClick={() => selectMenu("creat","我创建的")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programbuild"></use>
                </svg>
                我创建的
            </div>
            <div className={`table-aside-item ${menuType === "overdue" ? "table-aside-focus" : ""}`} onClick={() => selectMenu("overdue", "已逾期事项")}>
                <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-programrencent"></use>
                </svg>
                已逾期事项
            </div>
        </div>
        
    );
}

export default inject("workStore")(observer(WorkTableAside))