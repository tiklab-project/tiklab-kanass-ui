import React, {useEffect} from "react";
import { Modal,Table,message,Input,Select } from 'antd';
import "./versionPlanAdd.scss"
import {observer, inject} from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import Button from "../../../common/button/Button";
const { Search } = Input;

const  VersionPlanAddmodal = (props) => {
    const {projectStore,workStore,actionPlanId,versionPlanStore,
            addVersionPlan} = props;
    const {projectName} = projectStore;
    const {workType,workTypeList} = workStore;
    const [visible, setVisible] = React.useState(false);
    const [selectedRowKeys,setSelectedRowKeys] = React.useState([]);
    const {getVersionPlanList,versionPlanList} = versionPlanStore;
    const projectId = props.match.params.id;

    const showModal = () => {
        setVisible(true);
        getVersionPlanList({projectId:projectId})
        
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
            dataIndex: ["workType","name"],
            key: "type",
            width: 150
            
        },
        {
            title: "状态",
            dataIndex: ["workStatus","name"],
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
            let params = {id: selectedRowKeys[i], version: actionPlanId}
            addVersionPlan(params).then(()=>{
                if(i === selectedRowKeys.length - 1){
                    // setSelectedVersionPlanList([])
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
    const searchUnselectVersionPlan = (value) => {
        getVersionPlanList({title: value})
    }

    const searchUnselectVersionPlanByStatus = (value) => {
        searchUnselectVersionPlanByStatus({workTypeId: value})
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
                    >
                    { 
                        workTypeList && workTypeList.map((item)=> {
                            return <Select.Option value={item.workType.id} key={item.workType.id}>{item.workType.name}</Select.Option>
                        }) 
                    }
                    </Select>

                    <Search
                        placeholder="成员名字、手机号、邮箱"
                        allowClear
                        style={{ width: 200}}
                        onSearch={searchUnselectVersionPlan}

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