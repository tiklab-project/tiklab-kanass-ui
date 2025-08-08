import React, {useEffect, useState} from "react";
import {Col, Empty, Input, message, Row, Space, Table} from "antd";
import {inject, observer} from "mobx-react";
import {showCaseTypeTable, showCaseTypeView, showTextStatus} from "../../../common/caseCommon/CaseCommonFn";
import "../../common/styles/caseContantStyle.scss"
import "../../common/styles/unitcase.scss"
import PaginationCommon from "../../../common/caseCommon/pagination/Page";
import {rowStyle, showCreateUser} from "./testCaseTableFn";
import IconCommon from "../../../common/caseCommon/IconCommon";
import {useHistory} from "react-router";
import {debounce} from "../../../common/caseCommon/CaseCommonFn";
import HideDelete from "../../../common/caseCommon/hideDelete/HideDelete";
import {toDiffCaseFn} from "../../common/caseCommonFn";
import FuncUnitEdit from "../../function/components/funcUnitEdit";
import {SearchOutlined} from "@ant-design/icons";


const TestCaseTable = (props) => {
    const {testcaseStore,categoryStore} = props;

    const {
        findTestCaseList,
        testcaseList,
        deleteTestCase,
        isCaseExist,
        currentPage,
        setCurrentPage,
    } = testcaseStore;
    const {categoryIds} = categoryStore;

    const history = useHistory()
    const [tableLoading,setTableLoading] = useState(true);
    const [totalPage, setTotalPage] = useState();
    const [totalRecord, setTotalRecord] = useState();
    const [pageSize] = useState(20);

    let projectId = localStorage.getItem("projectId")

    useEffect(()=>{
        findPage()
    },[projectId])


    const findPage = (params) =>{
        setTableLoading(true)
        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:currentPage
            },
            projectId:projectId,
            categoryIds:categoryIds,
            // categoryId:selectCategory,
            ...params
        }

        findTestCaseList(param).then((res)=>{
            setTotalPage(res.totalPage);
            setTotalRecord(res.totalRecord)
            setTableLoading(false)
        })
    }


    /**
     * 删除用例
     * @param record
     * @returns {Promise<void>}
     */
    const deleteFn =async (record) =>{
        let isBind;
        let bindMsg;

        switch (record.caseType) {
            default:
                isBind = await isCaseExist(record.id);
                bindMsg = "该用例已被测试计划绑定，无法删除！";
                break;
        }

        if (isBind) {
            message.warning(bindMsg);
        } else {
            await deleteTestCase(record.id, record.caseType);
            await findPage();
        }
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

    //搜索
    const onSearch = (e) =>{
        setCurrentPage(1)
        let param = {name: e.target.value}

        findPage(param)
    }


    const column = [
        {
            title: `名称`,
            dataIndex: "name",
            key: "name",
            width: "45%",
            render: (text,record) =>(
                <Space size="middle">
                    <div style={{
                        marginTop: "3px",
                        borderRadius: "5px",
                        width: "28px",
                        height: "28px",
                        overflow: "hidden"
                    }}>
                        {showCaseTypeView(record.caseType)}
                    </div>

                    <div className="case-info-container">
                        <div className="case-name">
                            <div
                                className={"link-text"}
                                onClick={()=>toDiffCaseFn(record,history)}
                            >
                                {record.name}
                            </div>
                        </div>
                        <div className="case-meta-info">
                            <span>{record?.caseKey}</span>
                            <span>{showCaseTypeTable(record?.caseType)}</span>
                        </div>
                    </div>

                </Space>

            )
        },

        {
            title: `状态`,
            dataIndex: "status",
            key: "status",
            width: "15%",
            render: (text) => <div className={"case-table-status"}>{showTextStatus(text, "12px")}</div>
        },
        {
            title: `负责人`,
            dataIndex:  ["director","name"],
            key: "user",
            width:"15%",
            ellipsis: true,
            render: (text, record) => (showCreateUser(record.director))
        },
        // {
        //     title: `最近执行`,
        //     dataIndex: "recentInstance",
        //     key: "recentInstance",
        //     width:"10%",
        //     render:(text,record)=>(<CaseInstanceSingleDrawer caseData={record} {...props}/>)
        // },
        {
            title: `创建时间`,
            dataIndex: "createTime",
            key: "createTime",
            width:"15%",
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 50,
            render: (text, record) => (
                <Space size="small">
                    {/*<ShowQuickExe record={record} {...props}/>*/}
                    {/*<ShowDeleteView record={record} deleteFn={deleteFn} />*/}
                    <HideDelete deleteFn={() =>deleteFn(record)}/>
                </Space>
            )
        },
    ]



    return (
        <Row style={{height:"100%"}}>
            <Col
                xl={{ span: 24 }}
                xll={{ span: 16 }}
            >
                <div className={"content-box-center"}>
                    <div className={"display-flex-between"}>
                        <Input
                            placeholder={`搜索用例名`}
                            onPressEnter={onSearch}
                            // className='search-input-common'
                            prefix={<SearchOutlined />}
                            onChange={debounce(onSearch, 500)}
                            style={{width: '180px'}}
                            allowClear
                        />

                        <Space>
                            <FuncUnitEdit
                                findPage={findPage}
                                categoryStore={categoryStore}
                                name={"添加功能"}
                                type={"add"}
                                {...props}
                            />
                        </Space>
                    </div>
                    <div className={"table-list-box"}>
                        <Table
                            columns={column}
                            dataSource={testcaseList}
                            rowKey={record => record.id}
                            pagination={false}
                            loading={tableLoading}
                            onRow={(record) => ({style: rowStyle(record.caseType)})}
                            locale={{
                                emptyText: !tableLoading
                                    ? <Empty
                                        imageStyle={{height: 100}}
                                        description={<span>暂无用例</span>}
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
                </div>
            </Col>
        </Row>

    )
}

export default inject("testcaseStore", "categoryStore")(observer(TestCaseTable))