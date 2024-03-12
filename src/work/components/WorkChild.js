import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Row, Col } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkChild.scss"
import WorkChildAddmodal from "./WorkChildAdd";
import Button from "../../common/button/Button";
import WorkChildStore from "../store/WorkChildStore";
import { getUser } from "thoughtware-core-ui";
import { setSessionStorage, getSessionStorage } from "../../common/utils/setSessionStorage";
import setImageUrl from "../../common/utils/setImageUrl";

const WorkChild = (props) => {
    const store = {
        workChild: WorkChildStore
    }
    const { treePath, workStore,workType, projectId,type, workTypeCode, getTransitionList, workStatusNodeId } = props;
    
    const [selectIds, setSelectIds] = useState();
    const [selectChild, showSelectChild] = useState(false);
    const [addChild, showAddChild] = useState(false);
    const [workItemTitle, setWorkItemTitle] = useState()

    const { getWorkConditionPageTree, workShowType, viewType, getWorkBoardList,
        workId,setWorkId, addWork,getWorkConditionPage, createRecent, demandTypeId } = workStore;

    const { getWorkChildList,deleWorkChild, findWorkTypeListByCode } = WorkChildStore;
    const [childWorkList, setChildWorkList] = useState([]);
    const [demandId, setDemand] = useState();
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const project = JSON.parse(localStorage.getItem("project"));
    
    useEffect(() => {
        if(workTypeCode === "epic"){
            findWorkTypeListByCode().then(res => {
                setDemand(res.data)
                findWorkChildList()
            })
        }else {
            findWorkChildList()
        }
        return;
    }, [workId])

    const findWorkChildList = () => {
        const params = {
            parentId: workId,
            workTypeId: workType.id,
            workTypeSysId: null,
            title: null,
            pageParam: {
                currentPage: 1,
                pageSize: 20
            }
        }
        if(workTypeCode === "epic"){
            params.workTypeId = null;
            params.workTypeSysId = demandId;
        }
        getWorkChildList(params).then(res => {
            if (res.code === 0) {
                setChildWorkList(res.data)
            }

        })
    }
    const delectChild = (id) => {
        const params = {
            id: id
        }
        deleWorkChild(params).then((res) => {
            if (res.code === 0) {
                findWorkChildList()
                if (workShowType === "bodar") {
                    getWorkBoardList()
                } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                    getWorkConditionPageTree()
                } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                    getWorkConditionPage()
                }
            }
        })
    }


    const goWorkItem = (record) => {
        setWorkId(record.id)
        const newDetailCrumbArray = getSessionStorage("detailCrumbArray")
        newDetailCrumbArray.push({id: record.id, title: record.title, iconUrl: record.workTypeSys.iconUrl })
        setSessionStorage("detailCrumbArray", newDetailCrumbArray)
        const params = {
            name: record.title,
            model: "workItem",
            modelId: record.id,
            project: {id: project.id},
            projectType: {id: project.projectType.id},
            iconUrl: record.workTypeSys.iconUrl
        }
        createRecent(params)
        if(props.match.path === "/projectDetail/:id/workDetail/:workId"){
            props.history.push(`/projectDetail/${project.id}/workDetail/${record.id}`)
        }
        
    }


    const createChildWorkItem = () => {
        const params = {
            title: workItemTitle, 
            parentWorkItem: workId,
            project: projectId,
            builder: getUser().userId,
            sprint: sprintId,
            workType: workType.id,
            assigner: project?.master.id,
            desc: "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]"
        }
        if(workTypeCode === "epic"){
            params.workType = demandTypeId
        }
        addWork(params).then(res => {
            if(res.code === 0){
                showAddChild(false)
                findWorkChildList()
                getTransitionList(workStatusNodeId, workType?.flow?.id)
                if (workShowType === "bodar") {
                    getWorkBoardList()
                } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                    getWorkConditionPageTree()
                } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
                    getWorkConditionPage()
                }
            }
        })
    }

    const updateNameByKey = (event) => {

        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            createChildWorkItem()
        }

    }

    const columns = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            render: (text, record) => <div className="work-name" >
                <div className="work-title" onClick={() => goWorkItem(record)}>
                    {
                        record.workTypeSys?.iconUrl ?
                            <img
                                alt=""
                                className="svg-icon"
                                src = {setImageUrl(record.workTypeSys?.iconUrl)}

                            />
                            :
                            <img
                                src={'/images/workType2.png'}
                                alt=""
                                className="svg-icon"
                            />
                    }
                    {text}
                </div>
            </div>
        },
        {
            title: "事件类型",
            dataIndex: ["workTypeSys", "name"],
            key: "workType",
            width: "10%"

        },
        {
            title: "事项状态",
            dataIndex: ["workStatusNode", "name"],
            key: "workStatus",
            width: "10%"
        },
        {
            title: "负责人",
            dataIndex: ["assigner", "name"],
            key: "assigner",
            width: "10%"
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "5%",
            render: (text, record) => (
                <span onClick={() => delectChild(record.id)} className="span-botton">移除</span>
            ),
        }
    ];


    return (<Provider {...store}>
        <div className="work-child">
            <div className="child-top">
                <div className="child-top-title">{type}({childWorkList?.length})</div>
                {
                    !selectChild &&
                    <div className="child-top-botton">
                        <Button onClick={() => {showAddChild(true);showSelectChild(false)} }>
                            添加{type}
                        </Button>
                        <Button onClick={() => {showAddChild(false);showSelectChild(true)}}>
                            关联{type}
                        </Button>
                    </div>

                }
            </div>
            <div className="child-content">
                {
                    selectChild && <WorkChildAddmodal
                        {...props}
                        name="添加事项"
                        selectIds={selectIds}
                        selectChild={selectChild}
                        showSelectChild={showSelectChild}
                        getWorkChildList = {getWorkChildList}
                        setChildWorkList = {setChildWorkList}
                        treePath = {treePath}
                        demandId = {demandId}
                    />
                }
                {
                    addChild &&  <div className="child-create-input">
                        <Input 
                            placeholder="输入事项名称" 
                            onChange={(value) => setWorkItemTitle(value.target.value)} 
                            onKeyDown={(event) => updateNameByKey(event)}
                        />
                        <div className="child-create-submit">
                            <div className="create-submit" onClick={() =>  createChildWorkItem()}>
                                确定
                            </div>
                            <div className="create-cancel" onClick={() => showAddChild(false)}>
                                取消
                            </div>
                        </div>
                    </div>
                }
                <Table
                    columns={columns}
                    dataSource={childWorkList}
                    rowKey={record => record.id}
                    pagination={false}
                    showHeader={false}
                />
            </div>
        </div>
    </Provider>
        
    )
}
export default inject("workStore")(observer(WorkChild));