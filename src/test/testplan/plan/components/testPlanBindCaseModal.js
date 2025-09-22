/**
 * @description：测试计划中关联用例
 * @date: 2021-08-20 17:00
 */
import React, {useState} from 'react';
import { observer, inject } from "mobx-react";
import {Modal, Table, Row, Col, Input, Empty} from 'antd';
import {showCaseTypeTable, showCaseTypeView, showStatus} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanDetailStore from "../store/testPlanDetailStore";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import IconBtn from "../../../../common/caseCommon/iconBtn/IconBtn";
import {debounce} from "../../../../common/caseCommon/CaseCommonFn";
import {SearchOutlined} from "@ant-design/icons";
import Button from "../../../../common/button/Button";

// 添加与编辑
const TestPlanBindCaseModal = (props) => {
    const {testPlanId,findBindCasePage} = props;
    const {planBindCase} = testPlanDetailStore;
    const {findTestCasePage,testCaseList} = testPlanDetailStore;

    const columns = [
        {
            title:`名称`,
            dataIndex: "name",
            key: "name",
            width:'40%',
            render: (text,record) =>(
                <div className={"display-flex-gap"}>
                    <>{showCaseTypeView(record.caseType, "icon-20")}</>
                    {/*{switchCaseTypeView(record)}*/}
                    <span className={"link-text"}>{record.name}</span>
                </div>
            )
        },
        {
            title: `用例类型`,
            dataIndex: "caseType",
            key: "caseType",
            width:"12%",
            render: (text) =>(<div className={"case-table-case-type"}>{showCaseTypeTable(text)}</div>)
        },
        // {
        //     title: `状态`,
        //     dataIndex: "status",
        //     key: "status",
        //     width:"12%",
        //     render: (text)=><div className={"case-table-status"}>{showStatus(text)}</div>
        // },
        {
            title: `模块`,
            dataIndex: ["module","moduleName"],
            key: "category",
            width:"15%",
            ellipsis: true,
        },
        {
            title: `创建时间`,
            dataIndex: 'createTime',
            key: "createTime",
            width:"15%",
            ellipsis: true,
        },
    ]

    const projectId = localStorage.getItem('projectId')
    const [totalPage, setTotalPage] = useState();
    const [pageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const showModal = () => {
        findPage()
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //提交
    const onFinish = (id) => {
        let bindCaseItems = [];

        const bindItems = (data) => {
            data.forEach((item) => {
                bindCaseItems.push({
                    testPlan: { id: testPlanId },
                    testCase: { id: item }
                });
            });
        }

        bindItems(selectedRowKeys);

        planBindCase(bindCaseItems).then(()=> {
            findBindCasePage()
            findPage()
        })

        setSelectedRowKeys([])
        setIsModalOpen(false);
    }

    //测试类型筛选
    // const selectKeyFun = (item)=>{
    //     let key = item.key
    //     setSelectItem(key)
    //
    //     let param
    //     if(key!=="all"){
    //         param={testType:key}
    //     }
    //
    //     findPage(param)
    // }

    const onSearch = (e) =>{
        let param = {name:e.target.value}
        findPage(param)
    }

    const findPage = (params) =>{
        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:1
            },
            projectId:projectId,
            testPlanId:testPlanId,
            ...params
        }
        findTestCasePage(param).then((res)=>{
            setTotalPage(res.totalPage);
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

        findPage(param)
    }



    return (
        <>
            <Button
                buttonText={"关联用例"}
                onClick={showModal}
            />
            <Modal
                title="未关联用例"
                visible={isModalOpen}
                onOk={onFinish}
                onCancel={handleCancel}
                width={800}
                okText={"确定"}
                cancelText={"取消"}
                bodyStyle={{
                    maxHeight: 'calc(100vh - 200px)',
                    overflow: 'auto',
                    padding: '16px'
                }}
                style={{
                    top: '50px'
                }}
            >
                <div style={{padding:"0 0 15px"}}>
                    <Row gutter={16} align={"middle"}>
                        <Col className="gutter-row" span={6}>
                            <Input
                                placeholder={`搜索名称`}
                                onPressEnter={onSearch}
                                className='demand_project_search'
                                prefix={<SearchOutlined />}
                                onChange={debounce(onSearch,500) }
                                allowClear
                            />
                        </Col>


                    </Row>
                </div>
                <div>
                    <div className={"table-list-box"} >
                        <Table
                            columns={columns}
                            dataSource={testCaseList}
                            rowKey = {record => record.id}
                            rowSelection={{
                                selectedRowKeys,
                                onChange: (newSelectedRowKeys) => {
                                    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
                                    setSelectedRowKeys(newSelectedRowKeys);
                                },
                                // getCheckboxProps: (record) => ({
                                //     disabled: record.caseType === CASE_TYPE.WEB_SCENE || record.caseType === CASE_TYPE.APP_SCENE
                                //         ?  !!getVersionInfo().expired
                                //         : false
                                // }),
                            }}
                            locale={{
                                emptyText: <Empty
                                    imageStyle={{height: 100}}
                                    description={<span>暂无数据</span>}
                                />
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
            </Modal>
        </>
    );
};

export default inject("testcaseStore")(observer(TestPlanBindCaseModal));
