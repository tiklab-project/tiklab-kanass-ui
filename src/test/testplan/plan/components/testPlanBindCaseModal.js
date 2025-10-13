/**
 * @description：测试计划中关联用例
 * @date: 2021-08-20 17:00
 */
import React, {useRef, useState} from 'react';
import { observer, inject } from "mobx-react";
import {Modal, Table, Row, Col, Input, Empty, Select, TreeSelect} from 'antd';
import {
    showCasePriorityLevel,
    showCaseTypeTable,
    showCaseTypeView,
    showStatus
} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanDetailStore from "../store/testPlanDetailStore";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import Button from "../../../../common/button/Button";
import CategoryStore from "../../../category/store/CategoryStore";
import InputSearch from "../../../../common/input/InputSearch";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";
import "./testPlanBindCaseModal.scss"

// 添加与编辑
const TestPlanBindCaseModal = (props) => {
    const {testPlanId,findBindCasePage} = props;
    const {planBindCase} = testPlanDetailStore;
    const {findTestCasePage,testCaseList} = testPlanDetailStore;
    const {findCategoryListTreeTable,categoryTableList} = CategoryStore;

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
        {
            title: `优先级`,
            dataIndex: "priorityLevel",
            key: "priorityLevel",
            width:"12%",
            render: (text)=><div>{showCasePriorityLevel(text)}</div>
        },
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
    const bindTopRef = useRef(null);

    const showModal = () => {
        findPage()
        findCategoryListTreeTable({projectId: projectId})
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

    const onModuleSearch = (id) =>{
        let param = {moduleId:id}
        findPage(param)
    }

    const onPrioritySearch = (id) =>{
        let param = {priorityLevel:id}
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
            >
                <div style={{padding:"0 15px 15px"}}>
                    <Row gutter={16} align={"middle"} ref={bindTopRef} style={{display:"flex", justifyContent:"space-between"}}>
                        <div className="gutter-row" >
                            {/*<Input*/}
                            {/*    placeholder={`搜索名称`}*/}
                            {/*    onPressEnter={onSearch}*/}
                            {/*    className='search-input-common'*/}
                            {/*    prefix={<SearchOutlined />}*/}
                            {/*    onChange={debounce(onSearch,500) }*/}
                            {/*    allowClear*/}
                            {/*/>*/}
                            <InputSearch
                                placeholder="搜索名称"
                                allowClear
                                style={{ width: 200 }}
                                onChange={onSearch}
                            />
                        </div>
                        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                            <TreeSelect
                                className={"plan-bind-case-select"}
                                allowClear
                                bordered={ false}
                                style={{minWidth:"130px"}}
                                getPopupContainer={() => bindTopRef.current}
                                dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto',
                                }}
                                placeholder="模块"
                                treeDefaultExpandAll
                                dropdownMatchSelectWidth={false}
                                onChange={(value) => {
                                    console.log("TreeSelect  change:   ", value)
                                    onModuleSearch(value)
                                }}
                                treeData={categoryTableList.map(item => ({
                                    title: item.moduleName,
                                    key: item.id,
                                    value: item.id,
                                    children: item.children?.map(child => ({
                                        title: child.moduleName,
                                        key: child.id,
                                        value: child.id,
                                        children: child.children?.map(grandChild => ({
                                            title: grandChild.moduleName,
                                            key: grandChild.id,
                                            value: grandChild.id
                                        }))
                                    }))
                                }))}
                            />

                            <Select
                                className={"plan-bind-case-select"}
                                placeholder={"优先级"}
                                style={{flex: 1}}
                                bordered={ false}
                                allowClear
                                onChange={(value) => {
                                    console.log("Select  change: ", value)
                                    onPrioritySearch(value)
                                }}
                                getPopupContainer={() => bindTopRef.current}
                            >
                                <Option value={0}>
                                    <div className={"display-flex-gap"}>
                                        <ImgComponent
                                            src={"proivilege1.png"}
                                            alt=""
                                            className="icon-s"
                                        />
                                        <div>低</div>
                                    </div>
                                </Option>
                                <Option value={1}>
                                    <div className={"display-flex-gap"}>
                                        <ImgComponent
                                            src={"proivilege3.png"}
                                            alt=""
                                            className="icon-s"
                                        />
                                        <div>中</div>
                                    </div>
                                </Option>
                                <Option value={2}>
                                    <div className={"display-flex-gap"}>
                                        <ImgComponent
                                            src={"proivilege5.png"}
                                            alt=""
                                            className="icon-s"
                                        />
                                        <div>高</div>
                                    </div>
                                </Option>
                            </Select>
                        </div>


                    </Row>
                </div>
                <div>
                    <div className={"plan-bind-case-table"} >
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
