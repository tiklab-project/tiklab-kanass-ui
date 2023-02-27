import React, { Fragment, useEffect,useState } from "react";
import { Breadcrumb, Input, Table, Space, Button,message,Divider } from "antd";
import WorkStatusAddmodal from "./addWorkStatus";
import { observer, inject } from "mobx-react";

const { Search } = Input;


const WorkStatus = (props) => {
    // 初始化
    const {orgaStore} = props;
    const {workStatuslist,getWorkStatusList,
            addWorkStatusList,findWorkStatusListById,
            editWorkStatusList,deleteWorkStatusList,
            workStatusPage,setWorkStatusList,exchange
            } = orgaStore;

            
    useEffect(() => {
        getWorkStatusList()
        return;
    }, []);

    const deleWorkStatus = (id)=> {
        deleteWorkStatusList(id)
    }

    const onSearch=(value)=>{
        value.workType = "子"
        getWorkStatusList({current: 1},value)
    }

    // 改变页码
    const onChange = (pagination)=> {
        getWorkStatusList(pagination)
    }

    //上移
    const upWorkStatus = (id)=> {
        const newList = workStatuslist
        const index = workStatuslist.findIndex((item)=> {
            return item.id === id
        })
        if(index === 0){
            message.warning('已是最高了！');
        }else {
            exchange(id,workStatuslist[index-1].id).then(()=> {
                getWorkStatusList()
            })
        }
    }

    // 下移
    const downWorkStatus = (id)=> {
        const newList = workStatuslist
        const index = newList.findIndex((item)=> {
            return item.id === id
        })
        console.log(newList.length)
        if(index === newList.length-1){
            message.warning('已是最低了！');
        }else {
            exchange(id,workStatuslist[index+1].id).then(()=> {
                getWorkStatusList()
            })
        }
        
    }
    const [loading,setLoading] = useState(false)

    const columns = [
        {
            title: "状态名称",
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
            align: "left",
            render: (text, record) => (
                <Space size="middle">
                    <WorkStatusAddmodal
                        name="编辑"
                        type="edit"
                        typeName="状态"
                        id={record.id}
                        editWorkList={editWorkStatusList}
                        findWorkListById={findWorkStatusListById}
                    >
                        编辑
                    </WorkStatusAddmodal>
                    <Button
                        type="link"
                        onClick={() => deleWorkStatus(record.id)}
                    >
                        删除
                    </Button>
                    <Button
                        type="link"
                        onClick={() => upWorkStatus(record.id)}
                    >
                        上移
                    </Button>
                    <Button
                        type="link"
                        onClick={() => downWorkStatus(record.id)}
                    >
                        下移
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>事件状态管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">事件状态列表</a>
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
                        name="添加系统事件状态"
                        typeName="状态"
                        type="add"
                        group="system"
                        addWorkList={addWorkStatusList}
                    ></WorkStatusAddmodal>
                    <WorkStatusAddmodal
                        name="添加事件状态"
                        typeName="状态"
                        type="add"
                        group="custom"
                        addWorkList={addWorkStatusList}
                    ></WorkStatusAddmodal>
                </div>
                
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                dataSource= {workStatuslist}
                onChange = {onChange}
                // pagination = {{...workStatusPage}}
                pagination = {false}
            />
        </Fragment>
    );
};
export default inject("orgaStore")(observer(WorkStatus));