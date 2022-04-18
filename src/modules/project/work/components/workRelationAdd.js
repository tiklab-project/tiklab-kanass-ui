import React, {useEffect,useState} from "react";
import { Modal, Button,Table,Select,message,Input } from 'antd';
import {observer, inject} from "mobx-react";

const { Search } = Input;
const { Option } = Select;

const  WorkRelationAddmodal = (props) => {
    const {proStore,workStore,workRelation,selectIds,visible, setVisible} = props;
    const {projectName} = proStore;
    const {workTypeList,workId,getProlist,projectList} = workStore;
    const {addWorkRelation,getWorkRelationList,workRelationList} = workRelation;
    const projectId = localStorage.getItem("projectId");
    
    const [selectedRowKeys,setSelectedRowKeys] = useState([]);
    // const [setSelectedWorkRelationList] = React.useState([]);
    
    const showModal = () => {
        setVisible(true);
        getProlist()
        getWorkRelationList({projectId: projectId,idNotIn: selectIds[0]})
        
    };
    const columns=[
        {
            title: "标题",
            dataIndex: ["title"],
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
        }
    ];
    
    const onCancel = () => {
        setVisible(false);
    };
    
    // 选择用户
    const selectWorkRelation=(selected, selectedRows)=> {
        setSelectedRowKeys(selected)
        // setSelectedWorkRelationList(selectedRows)
    }
    //提交用户列表
    const submitWorkRelationList = ()=> {
        if(selectedRowKeys.length !== 0){
            for(let i=0; i<selectedRowKeys.length; i++) {
                let params = {id: selectedRowKeys[i],workItem: workId}
                addWorkRelation(params).then(()=>{
                    if(i === selectedRowKeys.length - 1){
                        // setSelectedWorkRelationList([])
                        setSelectedRowKeys([])
                        setVisible(false)
                    }
                })   
            }
        }else {
            message.info('请选择用户');
        }
    }

    // 搜索事项
    const searchUnselectWorkRelationByStatus = (value) => {
        getWorkRelationList({workTypeId: value})
    }

    // 搜索事项
    const searchUnselectWorkRelation = (value) => {
        getWorkRelationList({title: value})
    }

    return (
        <>
        <div className="addmodel">
            {props.type !== "edit"?<Button type="primary" onClick={showModal}>
                    +{props.name}
                </Button>: <span onClick={showModal} style={{color: "$blue-main"}}>{props.name}</span>

            }
            <Modal
                title="选择事项"
                visible={visible}
                onCancel={onCancel}
                width={800}
                onOk={submitWorkRelationList}
                className="work-relation-addmodel"
            >   
            
                <div className="work-relation-search">
                    {
                        props.location.pathname == "/index/work/worklist" ? 
                        <Select defaultValue={projectId} style={{ width: 200 }}>
                            {
                                projectList && projectList.map((item)=>{
                                    return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                })
                            }
                        </Select> :  
                        <Select defaultValue={projectId} style={{ width: 200 }} disabled>
                            <Select.Option value={projectId}>{projectName}</Select.Option>
                        </Select>
                    }

                    <Select style={{ width: 200 }} 
                        allowClear 
                        onChange={searchUnselectWorkRelationByStatus}
                        // onClear={searchUnselectWorkRelationByStatus}
                        // defaultValue={workTypeList[0].id}
                    >
                        {
                            workTypeList && workTypeList.map((item)=> {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>

                    <Search
                        placeholder="输入事项名字、手机号、邮箱"
                        allowClear
                        style={{ width: 200}}
                        onSearch={searchUnselectWorkRelation}
                    />
                </div>
                <Table 
                    columns={columns} 
                    dataSource={workRelationList} 
                    rowKey={record=> record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectWorkRelation
                    }}
                    okText="确定"
                    cancelText="取消"
                    
                />

            </Modal>
        </div>
        
        </>
    );
};

export default inject('proStore','workStore','workRelation')(observer(WorkRelationAddmodal));
