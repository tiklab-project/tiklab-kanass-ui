import React, {useEffect} from "react";
import { Modal,Table,message,Input,Select } from 'antd';
import "./StagePlanAdd.scss"
import {observer, inject} from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import Button from "../../../common/button/Button";
import { useState } from "react";
const { Search } = Input;

const StagePlanAddModal = (props) => {
    const {workStore,stageId, stageStore, setselectWorkItemList, stageWorkIds, setStageChild } = props;
    const { findWorkItemPageTreeByQuery, createStageWorkItem, findWorkItemListByStage } = stageStore;
    const {workType,workTypeList} = workStore;
    const [visible, setVisible] = React.useState(false);
    const [selectedRowKeys,setSelectedRowKeys] = React.useState([]);
    const projectId = props.match.params.id;
    const [workItemList, setWorkItemList] = useState([])
    const showModal = () => {
        setVisible(true);
        findWorkItemPageTreeByQuery({projectId:projectId, workTypeCode: "demand",idNotIn: stageWorkIds}).then(res => {
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


    //提交用户列表
    const submitVersionPlanList = ()=> {
        for(let i=0;i<selectedRowKeys.length;i++) {
            let params = {workItem: {id: selectedRowKeys[i]}, stageId: stageId}
            createStageWorkItem(params).then(()=>{
                if(i === selectedRowKeys.length - 1){
                    findWorkItemListByStage({ stageId: stageId }).then(res => {
                        if(res.code === 0){
                            setselectWorkItemList(res.data)
                            setStageChild(res.data)
                        }
                    })
                    setSelectedRowKeys([])
                    setVisible(false)
                }else {
                    info()
                }
            })  
        }
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
                    
                />

            </Modal>
        </div>
        
        </>
    );
};

export default inject("systemRoleStore",'workStore','versionPlanStore', 'stageStore')(observer(StagePlanAddModal));