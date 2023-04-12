import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Row, Col } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkChild.scss"
import WorkChildAddmodal from "./WorkChildAdd";
import Button from "../../common/button/Button";

const WorkChild = (props) => {
    const { treePath, workStore,workChild,workType, projectId,type } = props;

    const [selectIds, setSelectIds] = useState();
    const [selectChild, showSelectChild] = useState(false);
    const [addChild, showAddChild] = useState(false);
    const [workItemTitle, setWorkItemTitle] = useState()

    const { getWorkConditionPageTree, workShowType, viewType, getWorkBoardList,
        workId,setWorkId, setWorkIndex, addWork,getWorkConditionPage, createRecent,
        detailCrumbArray, setDetailCrumbArray } = workStore;

    const { getWorkChildList,deleWorkChild, childWorkItemTotal } = workChild;
    const [childWorkList, setChildWorkList] = useState([]);

    useEffect(() => {
        findWorkChildList()
        return;
    }, [workId])

    const findWorkChildList = () => {
        const params = {
            parentId: workId,
            workTypeId: workType.id,
            title: null,
            pageParam: {
                currentPage: 1,
                pageSize: 20
            }
        }
        getWorkChildList(params).then(res => {
            if (res.code === 0) {
                setChildWorkList(res.data.dataList)
            }

        })
    }

    const onChangePage = (page) => {
        const params = {
            pageParam: {
                currentPage: page.current,
                pageSize: 20
            }
        }
        getWorkChildList(params)
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

    // const goWorkItem = (id) => {
    //     props.history.push(`/index/projectScrumDetail/${id}/work/all`)
    // }

    const goWorkItem = (record) => {
        setWorkId(record.id)
        // setWorkIndex(index + 1)
        console.log(detailCrumbArray)
        const newDetailCrumbArray = detailCrumbArray
        newDetailCrumbArray.push({id: record.id, title: record.title, iconUrl: record.workTypeSys.iconUrl })
        setDetailCrumbArray(newDetailCrumbArray)
        console.log(detailCrumbArray)
        const params = {
            name: record.title,
            model: "workItem",
            modelId: record.id,
            projectId: projectId
        }
        createRecent(params)
        if (props.route.path === "/index/prodetail/workMessage/:id") {
            props.history.push("/index/prodetail/work")
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
                                src={'/images/' + record.workTypeSys.iconUrl}
                                alt=""
                                className="svg-icon"

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
            width: "20%"

        },
        {
            title: "事项状态",
            dataIndex: ["workStatusNode", "name"],
            key: "workStatus",
            width: "20%"
        },
        {
            title: "负责人",
            dataIndex: ["assigner", "name"],
            key: "assigner",
            width: "20%"
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "20%",
            render: (text, record) => (
                <span onClick={() => delectChild(record.id)} className="span-botton" >删除</span>
            ),
        }
    ];


    const createChildWorkItem = () => {
        const params = {
            title: workItemTitle, 
            parentWorkItem: workId, 
            project:projectId, 
            workType: workType.id
        };
        addWork(params).then(res => {
            if(res.code === 0){
                showAddChild(false)
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

    return (
        <div className="work-child">
            <div className="child-top">
                <div className="child-top-title">{type}({childWorkList.length})</div>
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
                    />
                }
                {
                    addChild &&  <div className="child-create-input">
                        <Input placeholder="输入事项名称" onChange={(value) => setWorkItemTitle(value.target.value)}></Input>
                        <div className="child-create-submit">
                            <div className="create-submit" onClick={() =>  createChildWorkItem(false)}>
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
    )
}
export default inject(
    "workStore",
    "workChild",
    "workRelation"
)(observer(WorkChild));