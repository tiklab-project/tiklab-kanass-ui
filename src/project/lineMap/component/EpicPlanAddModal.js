/*
 * @Descripttion: 史诗添加事项弹窗，弃用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 13:35:15
 */
import React from "react";
import { Modal,Table,message,Input,Select } from 'antd';
import "./EpicPlanAddModal.scss"
import {observer, inject} from "mobx-react";
import Button from "../../../common/button/Button";
import { useState } from "react";
const { Search } = Input;

const EpicPlanAddmodal = (props) => {
    const {epicId, epicStore, setEpicWorkIds, epicWorkIds, setEpicChild } = props;
    const { findWorkItemPageTreeByQuery, createEpicWorkItem, findEpicChildWorkItemAndEpic, workTypeList} = epicStore;
    const [visible, setVisible] = React.useState(false);
    const [selectedRowKeys,setSelectedRowKeys] = React.useState([]);
    const projectId = props.match.params.id;
    const [workItemList, setWorkItemList] = useState([])
    const showModal = () => {
        setVisible(true);
        findWorkItemPageTreeByQuery({projectId:projectId, workTypeCode: "demand",idNotIn: epicWorkIds}).then(res => {
            if(res.code === 0){
                setWorkItemList(res.data)
            }
        })
        
    };

    const columns=[
        {
            title: "事项名称",
            dataIndex: "title",
            key: "title",
            width: 150
        },
        {
            title: "类型",
            dataIndex: ["workTypeSys","name"],
            key: "type",
            width: 150
            
        },
        {
            title: "状态",
            dataIndex: ["workStatusNode","name"],
            key: "status",
            width: 150
        }
    ];
    

    const onCancel = () => {
        setVisible(false);
    };
    

    // 选择用户
    const selectVersionPlan=(selected, selectedRows)=> {
        setSelectedRowKeys(selected)
        // setSelectedVersionPlanList(selectedRows)
    }


    /**
     * 添加计划
     */
    const submitVersionPlanList = ()=> {
        for(let i=0;i<selectedRowKeys.length;i++) {
            let params = {workItem: {id: selectedRowKeys[i]}, epicId: epicId}
            createEpicWorkItem(params).then(()=>{
                epicWorkIds.push(selectedRowKeys[i])
                if(i === selectedRowKeys.length - 1){
                    findEpicChildWorkItemAndEpic({ epicId: epicId }).then(res => {
                        if(res.code === 0){
                            // setselectWorkItemList(res.data)
                            setEpicChild(res.data)
                        }
                    })
                    setSelectedRowKeys([])
                    setVisible(false)
                }else {
                    info()
                }
            })  
        }
        setEpicWorkIds(epicWorkIds)
    }


    //没有选择用户提升
    const info = () => {
        message.info('请选择事项');
    };


    // 搜索版本
    const searchUnselectWorkItem = (value) => {
        findWorkItemPageTreeByQuery({title: value})
    }

    const searchUnselectVersionPlanByStatus = (value) => {
        searchUnselectVersionPlanByStatus({workTypeId: value})
    }
    return (
        <>
        <div >
            {   
                props.type !== "edit"?
                    <Button type="primary" onClick={showModal}>
                        +{props.name}
                    </Button>
                    : <span onClick={showModal} style={{color: "var(--tiklab-gray-400)"}}>{props.name}</span>
            }
            <Modal
                title="选择事项"
                visible={visible}
                onCancel={onCancel}
                width={800}
                onOk={submitVersionPlanList}
                className="version-plan-addmodel"
                closable = {false}
            >   
                <div className="version-plan-search">
                    {/* <Select defaultValue={projectId} style={{ width: 200 }} disabled>
                        <Select.Option value={projectId}>{projectName}</Select.Option>
                    </Select> */}

                    <Select style={{ width: 200, marginRight: "20px" }} 
                        onChange={searchUnselectVersionPlanByStatus}
                        onClear={searchUnselectVersionPlanByStatus}
                    >
                    { 
                        workTypeList && workTypeList.map((item)=> {
                            return <Select.Option value={item.workType.id} key={item.workType.id}>{item.workType.name}</Select.Option>
                        }) 
                    }
                    </Select>

                    <Search
                        placeholder="输入成员名字、手机号、邮箱"
                        allowClear
                        style={{ width: 200}}
                        onSearch={searchUnselectWorkItem}

                    />
                </div>
                
                <Table 
                    columns={columns} 
                    dataSource={workItemList} 
                    rowKey={record=> record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectVersionPlan
                    }}
                    okText="确定"
                    cancelText="取消"
                    pagination ={false}
                    scroll={{x: "100%"}}
                />

            </Modal>
        </div>
        
        </>
    );
};

export default inject('epicStore')(observer(EpicPlanAddmodal));