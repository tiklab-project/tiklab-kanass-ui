/*
 * @Descripttion: 版本规划关联事项
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-09 16:39:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 19:09:13
 */

import React, {useState} from "react";
import { Modal,Table,message,Input,Select } from 'antd';
import "./versionPlanAdd.scss"
import {observer, inject} from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-user-ui";
import Button from "../../../common/button/Button";
const { Search } = Input;

const  VersionPlanAddmodal = (props) => {
    const {actionPlanId,versionPlanStore,addVersionPlan} = props;
    const {getVersionPlanList,versionPlanList, workTypeList, getWorkTypeList} = versionPlanStore;
    // 弹窗的显示
    const [visible, setVisible] = useState(false);
    // 选择的事项id集合
    const [selectedRowKeys,setSelectedRowKeys] = useState([]);
    // 项目id
    const projectId = props.match.params.id;

    /**
     * 显示弹窗
     */
    const showModal = () => {
        setVisible(true);
        getVersionPlanList({projectId:projectId})
        getWorkTypeList({projectId:projectId})
        
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
    
    /**
     * 关闭弹窗
     */
    const onCancel = () => {
        setVisible(false);
    };
    
    /**
     * 勾线事项
     * @param {*} selected 
     * @param {*} selectedRows 
     */
    const selectVersionPlan=(selected, selectedRows)=> {
        setSelectedRowKeys(selected)
    }


    /**
     * 提交数据，添加版本关联的事项
     */
    const submitVersionPlanList = ()=> {
        if(selectedRowKeys.length > 0){
            for(let i=0; i<selectedRowKeys.length; i++) {
                let params = {id: selectedRowKeys[i], version: actionPlanId}
                addVersionPlan(params).then((res)=>{

                    if(i === selectedRowKeys.length - 1){
                        // setSelectedVersionPlanList([])
                        if(res.code === 0){
                            setSelectedRowKeys([])
                            setVisible(false)
                            message.info('添加成功');
                        }
                    }
                })  
            }
        }else {
            message.warning('请选择事项');
        }
       
    }


    // 搜索版本
    const searchUnselectVersionPlan = (value) => {
        getVersionPlanList({title: value})
    }

    const searchUnselectVersionPlanByStatus = (value) => {
        getVersionPlanList({workTypeId: value})
    }
    return (
        <>
        <div >
            {   
                props.type !== "edit"?
                    <PrivilegeProjectButton code={'VersionWorkAdd'} disabled ={"hidden"} domainId={projectId}  {...props}>
                        <Button type="primary" onClick={showModal}>
                            {props.name}
                        </Button>
                    </PrivilegeProjectButton>
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
                        placeholder="事项类型"
                        onChange={searchUnselectVersionPlanByStatus}
                        onClear={searchUnselectVersionPlanByStatus}
                        allowClear
                    >
                    { 
                        workTypeList && workTypeList.map((item)=> {
                            return <Select.Option value={item.workType.id} key={item.workType.id}>{item.workType.name}</Select.Option>
                        }) 
                    }
                    </Select>

                    <Search
                        placeholder="标题"
                        allowClear
                        style={{ width: 200}}
                        onSearch={searchUnselectVersionPlan}
                        onChange = {e => console.log(e)}
                    />
                </div>
                
                <Table 
                    columns={columns} 
                    dataSource={versionPlanList} 
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

export default inject("systemRoleStore",'projectStore','workStore','versionPlanStore')(observer(VersionPlanAddmodal));