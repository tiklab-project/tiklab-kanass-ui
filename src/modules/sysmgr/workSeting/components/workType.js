import React, { Fragment, useEffect,useState } from "react";
import { Breadcrumb, Input, Table, Space, Button,message,Divider } from "antd";
import WorkTypeAddmodal from "./addWorkType";
import { observer, inject } from "mobx-react";
import {Link} from "react-router-dom"
import { getDomainTenant } from 'doublekit-core-ui';

const { Search } = Input;


const WorkType = (props) => {
    // 初始化
    const {orgaStore} = props;
    const {workTypelist,getWorkTypeList,
            addWorkTypeList,findWorkTypeListById,
            editWorkTypeList,deleteWorkTypeList,
            workTypePage,setWorkTypeList,fromList,
            getFormList,flowList,getFlowList,creatIcon,findIconList
            } = orgaStore;
    const tenant = getDomainTenant();
    useEffect(() => {
        getWorkTypeList()
        getFormList()
    }, []);

    const deleWorkType = (id)=> {
        deleteWorkTypeList(id)
    }

    const onSearch=(value)=>{
        getWorkTypeList({current: 1},value)
    }

    // 改变页码
    const onChange = (pagination)=> {
        getWorkTypeList(pagination)
    }

    //上移
    const upWorkType = (id)=> {
        const newList = workTypelist
        const index = workTypelist.findIndex((item)=> {
            return item.id === id
        })
        if(index === 0){
            message.warning('已是最高了！');
        }else {
            const newItem = newList[index]
            newList[index] = newList[index-1]
            newList[index-1] = newItem
            setWorkTypeList(newList)
        }
        
    }

    // 下移
    const downWorkType = (id)=> {
        const newList = workTypelist
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
            setWorkTypeList(newList)
        }
        
    }

    const [loading,setLoading] = useState(false)
    const goFlow = (id)=> {
        props.history.push("/index/organ/workTypeFlow/" + id )
    }

    const goForm = (id)=> {
        props.history.push("/index/organ/workTypeForm/" + id)
    }

    const columns = [
        {
            title: "类型名称",
            colSpan: 0,
            dataIndex: "iconUrl",
            key: "iconUrl",
            render: (text)=> {
                return <img src={`${img_url}/file/${text}?tenant=${tenant}`} width = "30px" height="30px" alt="" />
            }
        },
        {
            title: "类型名称",
            colSpan: 2,
            dataIndex: "name",
            key: "name",
            // render: (text)=> (<Fragment><img src="" alt="" />{text}</Fragment>
            // )
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
        // {
        //     title: "类别",
        //     dataIndex: "category",
        //     key: "category",
        //     render: (text)=>
        //         <span>{setType(text)}</span>
            
        // },
        {
            title: '表单配置',
            dataIndex: ['form','name'],
            key: 'form',
            render: (text,record) => <div onClick={()=> goForm(record.form.id)} className = "span-botton">{text}</div>,
        },
        {
            title: '流程配置',
            dataIndex: ['flow','name'],
            key: 'flow',
            render: (text,record) => <div onClick={()=> goFlow(record.flow.id)} className = "span-botton">{text}</div>
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <WorkTypeAddmodal
                        name="编辑"
                        type="edit"
                        id={record.id}
                        addWorkList={addWorkTypeList}
                        editWorkList={editWorkTypeList}
                        findWorkListById={findWorkTypeListById}
                        fromList={fromList}
                        getFormList={getFormList}
                        flowList={flowList}
                        getFlowList={getFlowList}
                        creatIcon= {creatIcon}
                        findIconList={findIconList}
                    >
                        编辑
                    </WorkTypeAddmodal>
                    <Button
                        type="link"
                        onClick={() => deleWorkType(record.id)}
                    >
                        删除
                    </Button>
                    <Button
                        type="link"
                        onClick={() => upWorkType(record.id)}
                    >
                        上移
                    </Button>
                    <Button
                        type="link"
                        onClick={() => downWorkType(record.id)}
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
                <Breadcrumb.Item>事件类型管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">事件类型列表</a>
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
                    <WorkTypeAddmodal
                        name="添加系统事件类型"
                        type="add"
                        group="system"
                        addWorkList={addWorkTypeList}
                        fromList={fromList}
                        getFormList={getFormList}
                        flowList={flowList}
                        getFlowList={getFlowList}
                        creatIcon= {creatIcon}
                        findIconList={findIconList}
                        style={{marginRight: "10px"}}
                    ></WorkTypeAddmodal>
                    <WorkTypeAddmodal
                        name="添加事件类型"
                        type="add"
                        group="custom"
                        addWorkList={addWorkTypeList}
                        fromList={fromList}
                        getFormList={getFormList}
                        flowList={flowList}
                        getFlowList={getFlowList}
                        creatIcon= {creatIcon}
                        findIconList={findIconList}
                    ></WorkTypeAddmodal>
                </div>
            </div>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
                dataSource= {workTypelist}
                onChange = {onChange}
                pagination = {{...workTypePage}}
            />
        </Fragment>
    );
};
export default inject("orgaStore")(observer(WorkType));