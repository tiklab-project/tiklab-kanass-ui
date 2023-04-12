/*
 * @Descripttion: 阶段的事项关联弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, {useState} from "react";
import { Modal,Table,message,Input,Select } from 'antd';
import "./StagePlanAdd.scss"
import {observer, inject} from "mobx-react";
import Button from "../../../common/button/Button";
const { Search } = Input;

const StagePlanAddModal = (props) => {
    const {workStore,stageId, stageStore, stageWorkIds, setStageWorkIds, setStageChild } = props;
    const { findWorkItemPageTreeByQuery, createStageWorkItem, findWorkItemListByStage } = stageStore;
    // 事项类型列表
    const {workTypeList} = workStore;
    // 是否打开弹窗
    const [visible, setVisible] = useState(false);
    // 选择的事项id集合
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // 项目id
    const projectId = props.match.params.id;
    // 事项列表
    const [workItemList, setWorkItemList] = useState([])

    /**
     * 显示弹窗，获取未被选择的事项
     */
    const showModal = () => {
        setVisible(true);
        findWorkItemPageTreeByQuery({projectId:projectId, workTypeCode: "demand",idNotIn: stageWorkIds}).then(res => {
            if(res.code === 0){
                setWorkItemList(res.data)
            }
        })
        
    };

    // 列数据
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
    
    /**
     * 关联弹窗
     */
    const onCancel = () => {
        setVisible(false);
    };
    

    /**
     * 获取选择的事项id
     * @param {选取的事项id} selected 
     */
    const selectVersionPlan=(selected)=> {
        setSelectedRowKeys(selected)
        // setSelectedVersionPlanList(selectedRows)
    }


    /**
     * 提交添加所选的事项
     */
    const submitVersionPlanList = ()=> {
        // 多选，循环添加
        for(let i=0;i<selectedRowKeys.length;i++) {
            let params = {workItem: {id: selectedRowKeys[i]}, stageId: stageId}
            createStageWorkItem(params).then(()=>{
                stageWorkIds.push(selectedRowKeys[i])
                if(i === selectedRowKeys.length - 1){
                    findWorkItemListByStage({ stageId: stageId }).then(res => {
                        if(res.code === 0){
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
        setSelectedRowKeys(stageWorkIds)
    }


    /**
     * 没有选择事项提示
     */
    const info = () => {
        message.info('请选择事项');
    };

    /**
     * 根据标题查找未被添加的事项
     * @param {标题} value 
     */
    const searchUnselectWorkItem = (value) => {
        findWorkItemPageTreeByQuery({title: value})
    }

     /**
     * 根据事项类型查找未被添加的事项
     * @param {标题} value 
     */
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