/*
 * @Description: 测试计划列表页
 * @LastEditTime: 2021-10-21 13:20:46
 */
import React, { useEffect, useState } from 'react';
import { observer, inject } from "mobx-react";
import {Input, Table, Space, Empty, Tag, Select} from 'antd';
import TestPlanEdit from './testPlanEdit';
import  { useTranslation } from 'react-i18next'
import "./testPlanStyle.scss"
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import HideDelete from "../../../../common/caseCommon/hideDelete/HideDelete";
import PageCenter from "../../../../common/caseCommon/PageCenter";
import {debounce} from "../../../../common/caseCommon/CaseCommonFn";
import ListIcon from "../../../../common/caseCommon/ListIcon/ListIcon";
import {showTextStatus} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanStore from "../store/testPlanStore";
import {LeftOutlined, SearchOutlined} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";

const TestPlan = (props) => {
    const {
        findTestPlanPage,
        deleteTestPlan,
        testPlanList,
        totalPage,
    } = testPlanStore;

    const { t } = useTranslation();

    //列表头
    const columns = [
        {
            title:`计划名称`,
            dataIndex: "name",
            key: "name",
            width: "35%",
            ellipsis: true,
            render: (text,record,index) =>(
                <div className={"display-flex-gap"}>
                    <ListIcon
                        text={text}
                        isMar={false}
                        colors={index+1 % 7}
                        className={`icon-xl`}
                    />
                    <span className={"link-text text-ellipsis"} onClick={()=>toPlanDetail(record)}>{text}</span>
                </div>
            )
        },
        {
            title:`计划时间`,
            dataIndex: "planTime",
            key: "planTime",
            width: "25%",
            ellipsis: true,
            render:(text,record)=>(
                <span className={"text-ellipsis"}>{record.startTime} ~ {record.endTime}</span>
            )
        },

        {
            title: `状态`,
            dataIndex: "state",
            key: "state",
            width: "15%",
            ellipsis: true,
            render: (text,record) =>(showTextStatus(record.state))
        },
        {
            title: `用例数`,
            dataIndex: "testCaseNum",
            key: "testCaseNum",
            width: "15%",
        },
        {
            title: ` 操作`,
            key: "action",
            width:70,
            render: (text, record) => (
                <Space size="middle">
                    <PrivilegeProjectButton code={'test_plan_update'} domainId={projectId}  {...props}>
                        <TestPlanEdit
                            // name={`${t('tcedit')}`}
                            name={`${t('编辑计划')}`}
                            testPlanId={record.id}
                            type={"edit"}
                            findPage={findPage}
                        />
                    </PrivilegeProjectButton>

                    {/*<PrivilegeProjectButton code={'test_plan_delete'} domainId={projectId}  {...props}>*/}
                        <HideDelete
                            privilegeCode={'test_plan_delete'}
                            projectId={projectId}
                            deleteFn={() =>deleteTestPlan(record.id).then(()=>findPage())}
                        />
                    {/*</PrivilegeProjectButton>*/}
                </Space>
            ),
        },
    ]

    const [pageSize] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState();
    const [pageParam, setPageParam] = useState({
        pageParam: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    })
    const [tableLoading,setTableLoading] = useState(true);
    const projectId = localStorage.getItem('projectId')

    useEffect(()=> {
        findPage()
    },[pageParam])

    // 去往详情页
    const toPlanDetail = (record) => {
        sessionStorage.setItem('testPlanId',record.id);
        props.history.push(`/project/${projectId}/testcase/planDetail/case`);
    };

    // 分页
    const onTableChange = (current) => {
        setCurrentPage(current)
        const newParams = {
            ...pageParam,
            pageParam: {
                pageSize: pageSize,
                currentPage: current
            },
        }

        setPageParam(newParams)
    }

    //搜索
    const onSearch = (e) => {
        setCurrentPage(1)
        let newParams = {
            pageParam: {
                pageSize: pageSize,
                currentPage: 1
            },
        }
        if (e.target.value) {
            newParams = {
                pageParam: {
                    pageSize: pageSize,
                    currentPage: 1
                },
                name:e.target.value,
            }
        }
        findPage(newParams)
    }

    const findPage = (params)=>{
        setTableLoading(true)
        let param={
            projectId:projectId,
            ...pageParam,
            ...params
        }
        findTestPlanPage(param).then((res)=>{
            setTableLoading(false)
            setTotalRecord(res.totalRecord)
        });
    }



    return(
        <PageCenter>
            <div className={"content-box-center"}>
                {/*<div className='header-box-space-between'>*/}
                {/*    <div className={'header-box-title'}>*/}
                {/*        测试计划*/}
                {/*    </div>*/}
                {/*    <TestPlanEdit*/}
                {/*        name={`添加计划`}*/}
                {/*        findPage={findPage}*/}
                {/*        type={"add"}*/}
                {/*    />*/}
                {/*</div>*/}

                <div className={"display-flex-between"} style={{margin:"0 0 10px 0"}}>
                    <Input
                        placeholder={`搜索计划名`}
                        onPressEnter={onSearch}
                        className='search-input-common'
                        style={{width: '180px'}}
                        prefix={<SearchOutlined />}
                        onChange={debounce(onSearch,500) }
                        allowClear
                    />
                    <PrivilegeProjectButton code={'test_plan_add'} domainId={projectId}  {...props}>
                        <TestPlanEdit
                            name={`添加计划`}
                            findPage={findPage}
                            type={"add"}
                        />
                    </PrivilegeProjectButton>
                </div>


                <div className={"table-list-box"}>
                    <Table
                        className="tablelist"
                        columns={columns}
                        dataSource={testPlanList}
                        rowKey={record => record.id}
                        pagination={false}
                        loading={tableLoading}
                        locale={{
                            emptyText: !tableLoading
                                ?<Empty
                                    imageStyle={{height: 100}}
                                    description={<span>暂无计划</span>}
                                />
                                :<div style={{height: 100}}/>,
                        }}
                    />
                    <PaginationCommon
                        currentPage={currentPage}
                        totalPage={totalPage}
                        changePage={onTableChange}
                        totalRecord={totalRecord}
                        findPage={findPage}
                    />
                </div>
            </div>
        </PageCenter>
    )
}

export default observer(TestPlan);