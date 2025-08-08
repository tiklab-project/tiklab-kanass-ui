import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Input, Table, Empty, Modal } from 'antd';
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import IconCommon from "../../../../common/caseCommon/IconCommon";
import { debounce } from "../../../../common/caseCommon/CaseCommonFn";
import ListIcon from "../../../../common/caseCommon/ListIcon/ListIcon";
import testReportStore from "../store/testReportStore";
import {SearchOutlined} from "@ant-design/icons";
import HideDelete from "../../../../common/caseCommon/hideDelete/HideDelete";


const TestReportPage = (props) => {
    const {
        TestReportEdit,
        toDetailFn,
        testPlanId
    } = props;
    const {
        findTestReportPage,
        deleteTestReport,
        testReportList,
        totalPage,
    } = testReportStore;

    // 列表头
    const columns = [
        {
            title: '报告名称',
            dataIndex: "name",
            key: "name",
            width: "25%",
            ellipsis: true,
            render: (text, record, index) => (
                <div className={"display-flex-gap"}>
                    <ListIcon
                        text={text}
                        isMar={false}
                        colors={index + 1 % 7}
                        className={`icon-l`}
                    />
                    <span className={"link-text text-ellipsis"} onClick={() => toDetailFn(record)}>{text}</span>
                </div>
            )
        },
        {
            title: '报告时间',
            dataIndex: "reportTime",
            key: "reportTime",
            width: "28%",
            ellipsis: true,
            render: (text, record) => (
                <span className={"text-ellipsis"}>{record.startTime} ~ {record.endTime}</span>
            )
        },
        {
            title: '创建人',
            dataIndex: "createUser",
            key: "createUser",
            width: "15%",
            ellipsis: true,
            render: (text) => text?.name || '-'
        },
        {
            title: '创建时间',
            dataIndex: "createTime",
            key: "createTime",
            width: "15%",
            ellipsis: true
        },
        {
            title: '描述',
            dataIndex: "desc",
            key: "desc",
            width: "17%",
            ellipsis: true
        },
        {
            title: '操作',
            dataIndex: "action",
            key: "action",
            width: "10%",
            render: (text, record) => (
                <div className={"display-flex-gap"}>
                    {
                        TestReportEdit&&<TestReportEdit
                            name={`编辑`}
                            reportId={record.id}
                            type={"edit"}
                            findPage={findPage}
                        />
                    }

                    <HideDelete
                        deleteFn={() =>showDeleteConfirm(record)}
                    />
                </div>
            )
        }
    ];

    const [pageSize] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState();
    const [pageParam, setPageParam] = useState({
        pageParam: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    });
    const [tableLoading, setTableLoading] = useState(true);
    const projectId = localStorage.getItem('projectId');


    useEffect(() => {
        findPage();
    }, [pageParam]);

    // 分页
    const onTableChange = (current) => {
        setCurrentPage(current);
        const newParams = {
            ...pageParam,
            pageParam: {
                pageSize: pageSize,
                currentPage: current
            },
        };
        setPageParam(newParams);
    };

    // 搜索
    const onSearch = (e) => {
        setCurrentPage(1);
        let newParams = {
            pageParam: {
                pageSize: pageSize,
                currentPage: 1
            },
        };
        if (e.target.value) {
            newParams = {
                pageParam: {
                    pageSize: pageSize,
                    currentPage: 1
                },
                name: e.target.value,
            };
        }
        findPage(newParams);
    };

    const findPage = (params) => {
        setTableLoading(true);
        let param = {
            testPlanId: testPlanId&&testPlanId,
            projectId: projectId,
            ...pageParam,
            ...params
        };
        findTestReportPage(param).then((res) => {
            setTableLoading(false);
            setTotalRecord(res.totalRecord);
        });
    };

    // 删除确认
    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除该报告吗？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteTestReport(record.id).then(() => {
                    findPage();
                });
            },
        });
    };

    return (
        <>

            {/*<div className='header-box-space-between'>*/}
            {/*    <div className={'header-box-title'}>测试报告</div>*/}
            {/*    {*/}
            {/*        TestReportEdit  &&<TestReportEdit*/}
            {/*            name={`添加报告`}*/}
            {/*            findPage={findPage}*/}
            {/*            type={"add"}*/}

            {/*        />*/}
            {/*    }*/}

            {/*</div>*/}
            <div className={"display-flex-between"} style={{margin: "0 0 10px 0"}}>
                <Input
                    placeholder={`搜索报告名`}
                    onPressEnter={onSearch}
                    className='search-input-common'
                    style={{width: '180px'}}
                    prefix={<SearchOutlined />}
                    onChange={debounce(onSearch, 500)}
                    allowClear
                />

                {
                    TestReportEdit  &&<TestReportEdit
                        name={`添加报告`}
                        findPage={findPage}
                        type={"add"}

                    />
                }
            </div>

            <div className={"table-list-box"}>
                <Table
                    className="tablelist"
                    columns={columns}
                    dataSource={testReportList}
                    rowKey={record => record.id}
                    pagination={false}
                    loading={tableLoading}
                    locale={{
                        emptyText: !tableLoading
                            ? <Empty
                                imageStyle={{height: 100}}
                                description={<span>暂无报告</span>}
                            />
                            : <div style={{height: 100}}/>,
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

        </>
    );
};

export default observer(TestReportPage);