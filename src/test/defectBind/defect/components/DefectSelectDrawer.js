import React, { useState} from "react";
import {Table, Input, Col, Row, Modal, Drawer, message} from "antd";
import {inject, observer} from "mobx-react";
import IconBtn from "../../../../common/caseCommon/iconBtn/IconBtn";
import workItemBindStore from "../store/WorkItemBindStore";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import IconCommon from "../../../../common/caseCommon/IconCommon";
import {debounce} from "../../../../common/caseCommon/CaseCommonFn";
import workItemStore from "../../workItem/store/WorkItemStore";

const {createWorkItemBind,findWorkItemBindPage} = workItemBindStore;


const DefectSelectDrawer = (props) =>{
    const {caseId,funcUnitStore,testPlanId} = props;
    const {findFuncUnit} = funcUnitStore
    const {findWorkItemList} = workItemStore;
    const columns = [
        {
            title:`缺陷名`,
            dataIndex: "title",
            key: "name",
            width:"40%",
        },
        {
            title: `项目`,
            dataIndex:["project","projectName"],
            key: "projectName",
            width:"20%",
        },
        {
            title: `状态`,
            dataIndex:  ["workStatusNode","name"],
            key: "status",
            width:"15%",
        },
        {
            title: `优先级`,
            dataIndex: ["workPriority","name"],
            key: "priority",
            width:"15%",
        },
        // {
        //     title:`操作`,
        //     dataIndex: "operation",
        //     key: "operation",
        //     width:150,
        //     render: (text, record) =>(
        //         <a onClick={()=>onFinish(record.id)}>关联</a>
        //     )
        // }
    ]

    const [workItemList, setWorkItemList] = useState([]);
    const projectId = localStorage.getItem("projectId")
    const [totalPage, setTotalPage] = useState();
    const [pageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = async () => {
        await findDemandList({projectId: projectId})
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);

        setCurrentPage(1)
    };

    const onFinish = (id) => {
        let param = {
            projectId:projectId,
            testCase:{id:caseId},
            workItem:{id:id},
            testPlanId:testPlanId,
        }
        createWorkItemBind(param).then(()=> {
            findWorkItemBindPage({
                caseId: caseId,
                testPlanId:testPlanId
            })
            findDemandList({projectId:projectId})
            findFuncUnit(caseId)
        })
    };


    const onSearch =(e)=>{
        let param = {
            name:e.target.value
        }
        findDemandList(param)
    }

    /**
     * 查询需求
     */
    const findDemandList = (param)=>{
        let params = {
            projectId:projectId,
            caseId:caseId,
            workTypeCode:"defect",
            pageParam: {
                pageSize: pageSize,
                currentPage:1
            },
            ...param
        }
        findWorkItemList(params).then(res=>{
            if(res.code===0){
                setWorkItemList(res.data.dataList);
                setTotalPage(res.data.totalPage)
            }else {
                message.error("获取数据无法获取,Kanass服务可能连接失败")
            }
        })
    }


    // 分页
    const onTableChange = (current) => {
        setCurrentPage(current)

        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:current
            },
        }

        findDemandList(param)
    }


    return(
        <>
            <IconBtn
                className="pi-icon-btn-grey"
                name={"关联缺陷"}
                onClick={showModal}
            />
            <Drawer
                title="关联缺陷"
                placement="right"
                onClose={handleCancel}
                visible={isModalOpen}
                width={800}
                destroyOnClose={true}
                className={"drawer-content-main"}
            >
                <div  className={"drawer-content-padding"}>
                    <div  style={{padding:"15px 0 15px"}}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <Input
                                    placeholder={`搜索缺陷名称`}
                                    onPressEnter={onSearch}
                                    className='demand_project_search'
                                    prefix={<IconCommon
                                        icon={"sousuo"}
                                        className={"icon-s"}
                                    />}
                                    onChange={debounce(onSearch,500) }
                                    allowClear
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className={"table-list-box"} >
                    <Table
                        columns={columns}
                        dataSource={workItemList}
                        rowKey = {record => record.id}
                        onRow={(record) => {
                            return {
                                onClick: () => {onFinish(record.id)},
                                style: {cursor: 'pointer'}
                            };
                        }}
                        pagination={false}
                    />
                    <PaginationCommon
                        currentPage={currentPage}
                        totalPage={totalPage}
                        changePage={onTableChange}
                    />
                </div>
                </div>
            </Drawer>
        </>
    )
}

export default inject("funcUnitStore")(observer(DefectSelectDrawer));
