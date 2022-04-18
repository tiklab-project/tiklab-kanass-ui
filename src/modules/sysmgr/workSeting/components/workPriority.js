import React, { Fragment, useEffect,useState } from "react";
import { Breadcrumb, Input, Table, Space, Button,message,Divider  } from "antd";
import WorkStatusAddmodal from "./addWorkStatus";
import { observer, inject } from "mobx-react";
const { Search } = Input;
const WorkPriority = (props) => {
    // 初始化
    const {orgaStore} = props;
    const {workPrioritylist,getWorkPriorityList,
            addWorkPriorityList,findWorkPriorityListById,
            editWorkPriorityList,deleteWorkPriorityList,
            workPriorityPage,setWorkPriorityList
            } = orgaStore;

    useEffect(() => {
        getWorkPriorityList()
    }, []);

    const deleWorkPriority = (id)=> {
        deleteWorkPriorityList(id)
    }

    const onSearch=(value)=>{
        getWorkPriorityList({current: 1},value)
    }

    // 改变页码
    const onChange = (pagination)=> {
        console.log(pagination)
        getWorkPriorityList(pagination)
    }

    //上移
    const upWorkPriority = (id)=> {
        const newList = workPrioritylist
        const index = workPrioritylist.findIndex((item)=> {
            return item.id === id
        })
        if(index === 0){
            message.warning('已是最高了！');
        }else {
            const newItem = newList[index]
            newList[index] = newList[index-1]
            newList[index-1] = newItem
            setWorkPriorityList(newList)
        }
        
    }

    // 下移
    const downWorkPriority = (id)=> {
        const newList = workPrioritylist
        const index = newList.findIndex((item)=> {
            return item.id === id
        })
        console.log(newList.length)
        if(index === newList.length-1){
            message.warning('已是最低了！');
        }else {
            const newItem = newList[index]
            newList[index] = newList[index+1]
            newList[index+1] = newItem
            setWorkPriorityList(newList)
        }
        
    }

    const [loading,setLoading] = useState(false)
    const columns = [
        {
            title: "优先级名称",
            dataIndex: "name",
            key: "name"
        },
        
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: "分组",
            dataIndex: "group",
            key: "group",
            render: (text)=> (
                text === "system" ?  <Fragment>系统</Fragment>:
                (text === "custom" ? <Fragment>自定义</Fragment> : "") 
            )
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <WorkStatusAddmodal
                        name="编辑"
                        typeName="优先级"
                        type="edit"
                        id={record.id}
                        editWorkList={editWorkPriorityList}
                        findWorkListById={findWorkPriorityListById}

                    >
                        编辑
                    </WorkStatusAddmodal>
                    <Button
                        type="link"
                        onClick={() => deleWorkPriority(record.id)}
                    >
                        删除
                    </Button>
                    <Button
                        type="link"
                        onClick={() => upWorkPriority(record.id)}
                    >
                        上移
                    </Button>
                    <Button
                        type="link"
                        onClick={() => downWorkPriority(record.id)}
                    >
                        下移
                    </Button>
                </Space>
            ),
        },
    ];
    
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>事件优先级管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">事件优先级列表</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <div className="search-add">
                <Search
                    placeholder="input search text"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 200, margin: "0 10px" }}
                />
                <div style={{display: "flex"}}>
                    <WorkStatusAddmodal
                        name="添加事件优先级"
                        typeName="优先级"
                        type="add"
                        group="system"
                        addWorkList={addWorkPriorityList}
                    ></WorkStatusAddmodal>
                    <WorkStatusAddmodal
                        name="添加事件优先级"
                        typeName="优先级"
                        type="add"
                        group="custom"
                        addWorkList={addWorkPriorityList}
                    ></WorkStatusAddmodal>
                </div>
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                dataSource= {workPrioritylist}
                onChange = {onChange}
                pagination = {{...workPriorityPage}}
            />
        </Fragment>
    );
};
export default inject("orgaStore")(observer(WorkPriority));