import React, { useState, useRef } from "react";
import { Button, Input, Table  } from 'antd';
import { observer, inject } from "mobx-react";
import "./workChild.scss"
import WorkChildAddmodal from "./workChildAdd";
import WorkAddModel from "../components/workAddModel";

const { Search  } = Input;

const WorkChild = (props) => {
    const {workChild,workStore,workId,workType,type} = props;
    const {getWorkConditionPageTree,workShowType} = workStore;
    const { childWorkItem,getWorkChildList,addWorkChild,searchAllWorkChild,deleWorkChild,setChildWorkItem,childWorkItemTotal } = workChild;
    const projectId = localStorage.getItem("projectId");
    const workAddModel = useRef();
    const [workItemState,setWorkItemState] = useState();

    const onChangePage = (page) => {
        const params = {
            pageParam: {
                currentPage: page.current,
                pageSize: 10
            }
        }
        getWorkChildList(params).then(res=> {
            if(res.code === 0){
                setChildWorkItem(res.data.dataList)
            }
        })
    }
    const delectChild = (id)=> {
        const params = {
            id: id,
            projectId: projectId
        }
        deleWorkChild(params).then((res)=> {
            if(res === 0){
                if(workShowType === "bodar"){
                    getWorkBoardList()
                }else if((workShowType === "list" || workShowType === "table") && viewType === "tree" ){
                    getWorkConditionPageTree()
                }else if((workShowType === "list" || workShowType === "table") && viewType === "tile"){
                    getWorkConditionPage()
                }
            }
        })
    }
    const columns=[
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: 150
        },
        {
            title: "事件类型",
            dataIndex: ["workType","name"],
            key: "workType",
            width: 150
            
        },
        {
            title: "事项状态",
            dataIndex: ["workStatus","name"],
            key: "workStatus",
            width: 150
        },
        {
            title: "负责人",
            dataIndex: ["assigner","name"],
            key: "assigner",
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                    <span onClick={()=>delectChild(record.id)} className = "span-botton" >删除</span>
            ),
        }
    ];

    const searchSelectWorkChild = (value) => {
        const params = {
            title: value
        }
        getWorkChildList(params).then(res=> {
            if(res.code === 0){
                setChildWorkItem(res.data.dataList)
            }
        })
    }


    const addChildWorkItem = () => {
        const params={ type: workType,id: workId,title: `添加子${type}`,typework: 2}
        setWorkItemState(params)
        workAddModel.current.setShowAddModel(true)
    }
    return (
        <div className="work-child">
            <div className="child-top"> 
                <Search 
                    allowClear
                    placeholder={`输入子${type}名称`}
                    onSearch={searchSelectWorkChild} 
                    enterButton 
                    style={{ width: 200 }}
                />
                <div className="" style={{display: "flex"}}>
                    <Button type="primary" onClick={()=> addChildWorkItem(workId)} style={{marginRight: "20px"}}>{`新建子${type}`}</Button>
                    <WorkAddModel workAddModel={workAddModel} state={workItemState} {...props}/>
                    <WorkChildAddmodal 
                        {...props}
                        name={`添加子${type}`}
                        addWorkChild = {addWorkChild}
                        searchAllWorkChild= {searchAllWorkChild}
                        workType={workType}
                        workId={workId}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={childWorkItem}
                rowKey={record=> record.id}
                onChange={onChangePage}
                pagination = {{defaultCurrent:1,pageSize:10, total:childWorkItemTotal}}
            />
        </div>
    )
}
export default inject("workStore","workChild")(observer(WorkChild));