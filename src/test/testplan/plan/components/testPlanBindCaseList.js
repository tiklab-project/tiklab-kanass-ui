import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import {Col, Empty, Input, Row, Select, Space, Table} from "antd";
import {showCaseTypeTable, showCaseTypeView} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanDetailStore from "../store/testPlanDetailStore";
import TestPlanBindCase from "./testPlanBindCaseModal";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import {useParams} from "react-router";
import {rowStyle, showCreateUser, ShowDeleteView} from "../../../testcase/components/testCaseTableFn";
import {debounce} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanStore from "../store/testPlanStore";
import functionInstanceStore from "../../../function/function/store/functionInstanceStore";
import {FunctionResultSelect} from "../../function/components/FunctionResultSelect";
import FunctionSetResultDrawer from "../../function/components/FunctionSetResultDrawer"
import {SearchOutlined} from "@ant-design/icons";
import FunctionContentDrawerView from "../../../function/function/components/drawerView/FunctionContentDrawerView";
import TestPlanCaseSetDirectorModal from "./TestPlanCaseSetDirectorModal";
import "./testPlanBindCaseList.scss"
import {PrivilegeProjectButton} from "tiklab-privilege-ui";


const TestPlanBindCaseList = (props) =>{
    const {findBindTestCasePage,deleteTestPlanDetail,findTestCasePage,getTestTypeNum, getUseList} = testPlanDetailStore;
    const {setFunctionResult} = functionInstanceStore
    const {TestPlanTestType,findTestPlan} = testPlanStore
    const pathname = useParams().pathname
    const [testCaseDetailVisible, setTestCaseDetailVisible] = useState(false);
    const [caseId, setCaseId] = useState();
    const goTestCaseDetail = (record) => {
        setCaseId(record.id)
        setTestCaseDetailVisible(true);
    }
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [userList, setUserList] = useState([]);

    const commonColumns = [
        {
            title:`名称`,
            dataIndex: "name",
            key: "name",
            width:"35%",
            ellipsis: true,
            render: (text,record) =>(
                <div className={"display-flex-gap"}>
                    <>{showCaseTypeView(record.caseType, "icon-22")}</>
                    {/*<PlanToFuncUnitPage testPlanId={testPlanId} record={record}/>*/}
                    <div className="case-key" style={{width:"85%"}}>
                        <div
                            className={"link-text"}
                            // onClick={()=>toDiffCaseFn(record,history)}
                            onClick={()=> goTestCaseDetail(record)}
                        >
                            <span>{record?.name}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title:`用例类型`,
            dataIndex:"caseType",
            key: "type",
            width:"15%",
            render: (text) =>(<div className={"case-table-case-type"}>{showCaseTypeTable(text)}</div>)
        },
        {
            title: `模块`,
            dataIndex: ["module","moduleName"],
            key: "module",
            width:"20%",
            ellipsis: true,
        },{
            title: `负责人`,
            dataIndex:  ["director"],
            key: "user",
            width:"12%",
            ellipsis: true,
            sorter: true,
            render: (text, record) => (showCreateUser(record.director))
        },
        {
            title: `实际结果`,
            dataIndex:  "result",
            key: "result",
            width:"15%",
            render:(text, record) =>(
                <FunctionSetResultDrawer
                    record={record}
                    recordResult={record.result}
                    testPlanId={testPlanId}
                    projectId={projectId}
                    findPage={findPage}
                />
            )
        },
        {
            title: `操作`,
            key: "action",
            width: 70,
            render: (text, record) => (
                <ShowDeleteView projectId={projectId} privilegeCode={"test_plan_update"} record={record} deleteFn={deleteFn} />
            ),
        }
    ]

    let {id} = useParams();
    const testPlanId = sessionStorage.getItem("testPlanId")

    const projectId = localStorage.getItem('projectId')

    const testPlanType = localStorage.getItem('testPlanType')
    const [selectCategory, setSelectCategory] = useState(null);
    const [tableLoading,setTableLoading] = useState(true);
    const [totalPage, setTotalPage] = useState();
    const [totalRecord, setTotalRecord] = useState();
    const [planBindCaseList, setPlanBindCaseList] = useState([]);
    const [pageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageParam, setPageParam] = useState({
        pageParam: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    })


    useEffect(async ()=>{
        if(sessionStorage.getItem("testPlanId") &&  sessionStorage.getItem("projectId")) return

        const planInfo = await findTestPlan(testPlanId)
        if(planInfo){
            sessionStorage.setItem("projectId",planInfo.projectId)
            sessionStorage.setItem("testPlanId",planInfo.id)
        }
    },[testPlanId])

    useEffect(()=>{
        if(testPlanId){
            findPage()
            getUseList(projectId).then(res => {
                setUserList(res)
            })
        }
    },[pageParam,testPlanId,pathname])

    const findPage = (params) =>{
        setTableLoading(true)
        const param = {
            testPlanType:TestPlanTestType,
            projectId:projectId,
            testPlanId:testPlanId,
            categoryId:selectCategory,
            orderParams: [{name:'create_time', orderType:'desc'}],
            ...pageParam,
            ...params
        }
        findBindTestCasePage(param).then((res)=>{
            setTotalPage(res.totalPage)
            setTableLoading(false)
            setTotalRecord(res.totalRecord)
            setPlanBindCaseList(res.dataList)
        })
    }

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

    const sortSearch = (sorter, extra) => {
        const setSortParams = (sorter) => {
            const order = sorter.order;
            let isAsc = "desc";
            let sortType = "director";
            if (order === "ascend") {
                isAsc = "asc"
            }
            if (order === "descend") {
                isAsc = "desc"
            }
            if (!order) {
                return
            }

            const params = {
                name: sortType,
                orderType: isAsc
            }

            return params;
        }

        if (extra.action === "sort") {
            let orderParams = [];
            let sortArray = []
            if (!(sorter instanceof Array)) {
                if (sorter.order) {
                    orderParams.push(setSortParams(sorter));
                    sortArray.push(sorter.columnKey);
                } else {
                    orderParams.push({
                        name: "create_time",
                        orderType: "desc"
                    });
                    sortArray.push("create_time");
                }

            } else {
                sorter.map(item => {
                    orderParams.push(setSortParams(item));
                    sortArray.push(item.columnKey);
                })
            }
            const param = {
                orderParams: orderParams,
                ...pageParam,
                pageParam: {
                    pageSize: pageSize,
                    currentPage: 1
                },
            }
            findPage(param)
        }
    }

    //删除
    const deleteFn=(record) => {
        deleteTestPlanDetail(record.planCaseId).then(async () => {
            findPage()
            let param = {
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                },
                projectId: projectId,
                testPlanId: testPlanId,
            }
            await findTestCasePage(param)
        })
    }

    //搜索
    const onSearch = (e) =>{
        setCurrentPage(1)
        let param = {name: e.target.value}

        findPage(param)
    }

    const onDirectorSearch = (id) => {
        setCurrentPage(1)
        findPage({director:id})
    }


    //点击用例结果筛选项查找
    const selectResultFun = (value)=>{
        let param = {
            result:value
        }

        findPage(param)
    }



    //表格中用例设置结果
    const setResult = async (value,record) =>{
        let data = {
            result: value,
            id:record.id,
            funcUnitCase:{id:record.id},
            testPlanInstanceId:testPlanId,
            projectId:projectId
        }

        await setFunctionResult(data)
    }



    return (

        <div style={{margin: "10px 0"}}>
            <div className='display-flex-between' style={{marginBottom: "16px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                    {
                        selectedRowKeys.length > 0 && (
                            <PrivilegeProjectButton code={'test_case_update'} domainId={projectId}  {...props}>
                                <TestPlanCaseSetDirectorModal
                                    selectChange={selectResultFun}
                                    selectedRowKeys={selectedRowKeys}
                                />
                            </PrivilegeProjectButton>
                        )
                    }
                    <Input
                        placeholder={`搜索用例`}
                        onPressEnter={onSearch}
                        className='search-input-common'
                        style={{width: '180px'}}
                        prefix={<SearchOutlined />}
                        onChange={debounce(onSearch, 500)}
                        allowClear
                    />
                    <Select
                        placeholder="负责人"
                        className="director-select"
                        maxTagCount={1}
                        // getPopupContainer={() => heightFilter.current}
                        showArrow = {true}
                        allowClear={true}
                        bordered={false}
                        dropdownMatchSelectWidth={false}
                        onChange={debounce(onDirectorSearch, 500)}
                        style={{marginLeft: "10px"}}
                    >
                        {
                            userList && userList.map((item) => {
                                return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                            })
                        }
                    </Select>
                </div>
                <Space>
                    {testPlanType === "function"&&(
                        <FunctionResultSelect
                            selectChange={selectResultFun}
                            placeholder={"状态"}
                            isFliter={true}
                        />
                    )}

                    <PrivilegeProjectButton code={'test_case_update'} domainId={projectId}  {...props}>
                        <TestPlanBindCase
                            testPlanId={testPlanId}
                            findBindCasePage={findPage}
                        />
                    </PrivilegeProjectButton>

                </Space>
            </div>
            <div className={"table-list-box"}>
                <Table
                    className="tablelist"
                    columns={commonColumns }
                    dataSource={planBindCaseList}
                    rowKey={record => record.id}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (selectedKeys) => {
                            console.log("选中的id", selectedKeys)
                            setSelectedRowKeys(selectedKeys);
                        },
                    }}
                    pagination={false}
                    showSorterTooltip={false}
                    onChange={(pagination, filters, sorter, extra) => {
                        sortSearch(sorter, extra)
                    }}
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
            <FunctionContentDrawerView
                isModalVisible={testCaseDetailVisible}
                setIsModalVisible={setTestCaseDetailVisible}
                caseId={caseId}
                inTestCase={true}
                testPlanId={testPlanId}
                {...props}
            />
        </div>

    )
}


export default observer(TestPlanBindCaseList);