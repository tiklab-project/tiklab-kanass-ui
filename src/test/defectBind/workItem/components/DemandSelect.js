import React, {useEffect, useState} from "react";
import {Table, Input, Col,Row} from "antd";
import {inject, observer} from "mobx-react";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import IconCommon from "../../../../common/caseCommon/IconCommon";
import {debounce} from "../../../../common/caseCommon/CaseCommonFn";
import WorkItemStore from "../store/WorkItemStore";
import {createWorkTestCaseFn} from "../../../testcase/components/testCaseTableFn";
// import projectBindStore from "../../../../repository/setting/projectIntegration/ProjectBindStore";
// const {findProjectBind} = projectBindStore


const DemandSelect = (props) =>{
    const {caseInfo,updateFn,setDemandInfo,onCancel} = props;
    const {
        findWorkItemList,
        findWorkItem,
    } = WorkItemStore;
    const projectId = localStorage.getItem("projectId")
    const [selectProjectId, setSelectProjectId] = useState();
    const [workItemList, setWorkItemList] = useState([]);
    const repositoryId = sessionStorage.getItem("repositoryId")
    const [totalPage, setTotalPage] = useState();
    const [pageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);

    const columns = [
        {
            title:`需求名`,
            dataIndex: "title",
            key: "name",
            width:"40%",
            ellipsis: true,
        },
        {
            title:`负责人`,
            dataIndex: ["assigner","nickname"],
            key: "director",
            width:"20%",
            ellipsis: true,
        },
        {
            title:`状态`,
            dataIndex: ["workStatusNode","name"],
            key: "status",
            width:"20%"
        }, {
            title:`优先级`,
            dataIndex: ["workPriority","name"],
            key: "priority",
            width:"20%"
        }
    ]

    useEffect(async ()=>{
        setSelectProjectId(projectId)
        findDemandList({projectId: projectId})
    },[])

    const onFinish = (id) => {
        let param = {
            ...caseInfo.testCase,
            id:caseInfo.id,
            demand:{id: id}
        }
        updateFn(param)
        // 事项下--新增一条关联关系
        createWorkTestCaseFn(caseInfo.id, id, projectId)
        onCancel()
    };

    const onSearch =(e)=>{
        let param = {
            projectId:selectProjectId,
            name:e.target.value,

        }
        findDemandList(param)
    }

    /**
     * 查询需求
     */
    const findDemandList = (param)=>{
        let params = {
            projectId:projectId,
            workTypeCode:"demand",
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
                // messageFn("error","TeamWire连接失败!")
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
            projectId:projectId,
        }

        findDemandList(param)
    }

    return(
        <>
            <div style={{padding:"0 0 15px"}}>
                <Row gutter={16}>
                    <Col className="gutter-row" span={18}>
                        <Input
                            placeholder={`搜索需求名称`}
                            onPressEnter={onSearch}
                            onChange={onSearch}
                            className='search-input-common'
                            style={{width: '250px'}}
                            prefix={
                                <IconCommon
                                    icon={"search"}
                                    className={"img-icon-right"}
                                />
                            }
                            onChange={debounce(onSearch,500) }
                            allowClear
                        />
                    </Col>
                    <Col className="gutter-row" span={6}>
                        {/*<ProjectSelect*/}
                        {/*    clickProject={clickProject}*/}
                        {/*    {...props}*/}
                        {/*/>*/}
                    </Col>

                </Row>
            </div>
            <div>
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

        </>
    )
}

export default observer(DemandSelect);
