import React, {useEffect, useRef, useState} from "react";
import {Col, Dropdown, Empty, Input, Menu, message, Row, Space, Table} from "antd";
import {inject, observer} from "mobx-react";
import {
    showCasePriorityLevel,
    showCaseTypeTable,
    showCaseTypeView,
    showTextStatus
} from "../../../common/caseCommon/CaseCommonFn";
import "../../common/styles/caseContantStyle.scss"
import "../../common/styles/unitcase.scss"
import PaginationCommon from "../../../common/caseCommon/pagination/Page";
import {
    findTestCasePriorityLevelCountFn,
    findTestCaseTableListFn,
    rowStyle,
    showCreateUser
} from "./testCaseTableFn";
import IconCommon from "../../../common/caseCommon/IconCommon";
import {useHistory} from "react-router";
import {debounce} from "../../../common/caseCommon/CaseCommonFn";
import HideDelete from "../../../common/caseCommon/hideDelete/HideDelete";
import {toDiffCaseFn} from "../../common/caseCommonFn";
import FuncUnitEdit from "../../function/function/components/funcUnitEdit";
import {DownOutlined, SearchOutlined} from "@ant-design/icons";
import CaseCategoryTree from "../../category/components/CaseCategoryTree";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import FunctionContentDrawerView from "../../function/function/components/drawerView/FunctionContentDrawerView";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";


const TestCaseTable = (props) => {
    const {testcaseStore,categoryStore} = props;

    const {
        findTestCaseList,
        testcaseList,
        deleteTestCase,
        isCaseExist,
        currentPage,
        setCurrentPage,
        setTestType,
        testType,
        caseTypeList,
        setCaseTypeList,
        searchCondition,
        detailWidth,
        testCasePriorityLevelCount
    } = testcaseStore;
    const {categoryIds, setCategoryIds, tableTitle, treeCollapsed} = categoryStore;

    const history = useHistory()
    const [tableLoading,setTableLoading] = useState(true);
    const [totalPage, setTotalPage] = useState();
    const [totalRecord, setTotalRecord] = useState();
    const [pageSize] = useState(20);
    const [creatorAndDirectorNum, setCreatorAndDirectorNum] = useState();
    const [testCaseDetailVisible, setTestCaseDetailVisible] = useState(false);
    const [selectTab, setSelectTab] = useState( "all");
    const [caseId, setCaseId] = useState();
    let projectId = localStorage.getItem("projectId")
    const [statusCount, setStatusCount] = useState()
    const scrollRef = useRef(null);

    const goTestCaseDetail = (record) => {
        // const pathname = props.match.url;
        // props.history.push(`${pathname}/${record.id}`)
        setCaseId(record.id)
        setTestCaseDetailVisible(true);
    }

    useEffect(()=>{
        findPage()
    },[projectId, categoryIds, searchCondition])

    const levelFilterList = [
        {
            value: "all",
            label: "所有"
        },
        {
            value: 0,
            label: "低"
        },
        {
            value: 1,
            label: "中"
        },
        {
            value: 2,
            label: "高"
        }
    ]

    // const quickFilterDropDownList = [
    //     {
    //         value: "creat",
    //         label: "我创建的"
    //     }
    // ]

    const getQuickFilterRangeTestCase = (value,label) => {
        let params;
        if (value === "all"){
            params = {
                priorityLevel: null,
            }
        }else{
            params = {
                priorityLevel: value,
            }
        }
        setSelectTab(value)
        findPage(params)
    }

    // Show scrollbar only while scrolling
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        let hideTimer = null;

        const onScroll = () => {
            container.classList.add("scrolling");
            if (hideTimer) {
                clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
                container.classList.remove("scrolling");
            }, 800);
        };

        container.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            container.removeEventListener("scroll", onScroll);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, []);

    const findPage = (params) =>{
        setTableLoading(true)
        let param = {
            pageParam: {
                pageSize: pageSize,
                currentPage:currentPage
            },
            projectId:projectId,
            moduleIds:categoryIds,
            // categoryId:selectCategory,
            ...params
        }

        const res = findTestCaseTableListFn(param);
        const countRes = findTestCasePriorityLevelCountFn(param)
        setTableLoading(false)
        // findTestCaseList(param).then((res)=>{
        //     setTotalPage(res.totalPage);
        //     setTotalRecord(res.totalRecord)
        //     setTableLoading(false)
        // })
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
            title: `ID`,
            dataIndex: "caseKey",
            key: "caseKey",
            width: "15%",
            render: (text,record) =>(
                <Space size="small">
                    <div style={{
                        marginTop: "3px",
                        borderRadius: "5px",
                        width: "20px",
                        height: "20px",
                        overflow: "hidden"
                    }}>
                        {showCaseTypeView(record.caseType, "icon-20")}
                    </div>

                    <div className="case-info-container">
                        <div className="case-key">
                            <div
                                className={"link-text"}
                                // onClick={()=>toDiffCaseFn(record,history)}
                                onClick={()=> goTestCaseDetail(record)}
                            >
                                <span>{record?.caseKey}</span>
                            </div>
                        </div>
                    </div>
                </Space>

            )
        },
        {
            title: `名称`,
            dataIndex: "name",
            key: "name",
            width: "30%",
            ellipsis: true,
            render: (text,record) =>(
                <div className="case-name">
                    <div
                        className={"link-text"}
                        // onClick={()=>toDiffCaseFn(record,history)}
                        onClick={()=>goTestCaseDetail(record)}
                    >
                        {record.name}
                    </div>
                </div>

            )
        },
        {
            title: `优先级`,
            dataIndex: "priorityLevel",
            key: "priorityLevel",
            width: "15%",
            // render: (text) => <div className={"case-table-status"}>{showTextStatus(text, "12px")}</div>
            render: (text) => <div className={""}>{showCasePriorityLevel(text)}</div>
        },
        {
            title: `负责人`,
            dataIndex:  ["director","name"],
            key: "user",
            width:"15%",
            ellipsis: true,
            render: (text, record) => (showCreateUser(record.director))
        },
        {
            title: `创建时间`,
            dataIndex: "createTime",
            key: "createTime",
            width:"15%",
            render: (text, record) => (
                <div>
                    {text.slice(0, 10)}
                </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 50,
            render: (text, record) => (
                <Space size="small">
                    {/*<PrivilegeProjectButton code={'test_case_delete'} domainId={projectId}  {...props}>*/}
                        <HideDelete privilegeCode={'test_case_delete'} projectId={projectId} deleteFn={() =>deleteFn(record)}/>
                    {/*</PrivilegeProjectButton>*/}
                </Space>
            )
        },
    ]


    const setTestCaseNum = (label) => {
        let num ;
        if (label === "all"){
            num = testCasePriorityLevelCount?.total_count;
        }else if (label === 0){
            num = testCasePriorityLevelCount?.low_count;
        }else if (label === 1){
            num = testCasePriorityLevelCount?.mid_count;
        }else if (label === 2){
            num = testCasePriorityLevelCount?.high_count;
        }

        let showNum;
        const isMax = Math.floor(num / 1000);
        if(isMax >= 1){
            showNum = `${isMax}k+`
        }else {
            showNum = num;
        }
        return showNum;
    }
    return (
        <Row className="testcase-scroll" style={{height:"100%", position: "relative", overflow: "auto"}} ref={scrollRef}>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3"}}>
                <div className={"content-box-center"}>
                    <div className={"display-flex-between"}>
                        <Breadcumb firstText={tableTitle}/>
                        <Space>
                            <PrivilegeProjectButton code={'test_case_add'} domainId={projectId}  {...props}>
                                <FuncUnitEdit
                                    findPage={findPage}
                                    categoryStore={categoryStore}
                                    name={"添加用例"}
                                    type={"add"}
                                    {...props}
                                />
                            </PrivilegeProjectButton>
                        </Space>
                    </div>
                    <div style={{marginTop: "10px"}} className={"display-flex-between"}>
                        <div className={"work-filter-tabs"}>
                            {
                                levelFilterList.map(item => {
                                    return <div
                                        className={`filter-tab ${selectTab === item.value ? "active-tabs" : ""}`}
                                        key={item.value}
                                        onClick={() => {
                                            getQuickFilterRangeTestCase(item.value)
                                        }}
                                    >
                                        {item.label}
                                        <span className="select-number">
                                            {setTestCaseNum(item.value)}
                                        </span>
                                    </div>
                                })
                            }
                        </div>
                        <Input
                            placeholder={`搜索用例名`}
                            onPressEnter={onSearch}
                            className='search-input-common'
                            prefix={<SearchOutlined />}
                            onChange={debounce(onSearch, 500)}
                            style={{width: '180px'}}
                            allowClear
                        />
                    </div>
                    <div className={"table-list-box"} style={{marginTop: "10px"}}>
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
                                        description={<span>暂无数据</span>}
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
            <FunctionContentDrawerView
                isModalVisible={testCaseDetailVisible}
                setIsModalVisible={setTestCaseDetailVisible}
                caseId={caseId}
                inTestCase={true}
                {...props}
            />
        </Row>
    )
}

export default inject("testcaseStore", "categoryStore")(observer(TestCaseTable))