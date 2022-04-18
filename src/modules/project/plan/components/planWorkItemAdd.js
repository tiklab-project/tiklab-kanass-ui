import React,{useEffect,useState} from "react";
import { Modal, Button,Table,message,Input,Select } from 'antd';
import {observer, inject} from "mobx-react";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import "./plan.scss";

const { Search } = Input;
const  PlanWorkItemAddmodal = (props) => {
    const {planId,planWorkItemStore,planStore} = props;
    const {getPlanList} = planStore;
    const [visible, setVisible] = useState(false);
    // 被选中的事项ids
    const [selectedRowKeys,setSelectedRowKeys] = useState([]);  

    const {findUnPlanWorkItemPage,selectPlanWorkItemList,createPlanWorkItem,searchSelectCondition,getWorkType,workTypeList} = planWorkItemStore;
    const projectId = localStorage.getItem("projectId")

    const showModal = () => {
        getWorkType()
        setVisible(true);
        findUnPlanWorkItemPage({projectId:projectId,planId:planId})
        
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
    

    const selectPlan=(selected)=> {
        setSelectedRowKeys(selected)
    }

    const pageTurn = (pagination) => {
        findUnPlanWorkItemPage({ currentPage: pagination.current })
    }

    
    const submitPlanList = ()=> {
        for(let i=0;i<selectedRowKeys.length;i++) {
            let params = {workItem: {id: selectedRowKeys[i]},planId: planId}
            createPlanWorkItem(params).then((res)=>{
                if(res.code === 0) {
                    if(i === selectedRowKeys.length - 1){
                        setSelectedRowKeys([])
                        setVisible(false)
                        getPlanList({projectId:projectId,planId:planId})
                    }else {
                        message.info('请选择事项');
                    }
                }
                
            })  
        }
    }

    // 搜索版本
    const searchUnselectPlan = (value) => {
        getPlanList({title: value})
    }

    /**
     * !后端接口要调整
     * @param {*} value 
     */
    const searchUnselectPlanByStatus = (value) => {
        findUnPlanWorkItemPage({workTypeId: value})
    }


    return (
        <>
        <div >
            {   
                props.type !== "children"?
                    <PrivilegeProjectButton code={'PlanWorkAdd'} disabled ={"hidden"} domainId={projectId}>
                        <Button type="primary" onClick={showModal}>
                            +{props.name}
                        </Button>
                    </PrivilegeProjectButton>
                    : <span onClick={showModal} style={{color: "$blue-main"}}>{props.name}</span>
            }
            <Modal
                title="选择事项"
                visible={visible}
                onCancel={onCancel}
                width={800}
                onOk={submitPlanList}
                className="plan-plan-addmodel"
            >   
                <div className="plan-plan-search">

                    <Select style={{ width: 200,marginRight:"20px" }} 
                        onChange={searchUnselectPlanByStatus}
                        onClear={searchUnselectPlanByStatus}
                    >
                        { 
                            workTypeList && workTypeList.map((item)=> {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            }) 
                        }
                    </Select>

                    <Search
                        placeholder="输入成员名字、手机号、邮箱"
                        allowClear
                        style={{ width: 200}}
                        onSearch={searchUnselectPlan}

                    />
                </div>
                
                <Table 
                    columns={columns} 
                    dataSource={selectPlanWorkItemList} 
                    rowKey={record=> record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectPlan
                    }}
                    okText="确定"
                    cancelText="取消"
                    onChange={pageTurn}
                    pagination={{ ...searchSelectCondition }}
                />

            </Modal>
        </div>
        
        </>
    );
};
export default inject('planStore','planWorkItemStore')(observer(PlanWorkItemAddmodal));