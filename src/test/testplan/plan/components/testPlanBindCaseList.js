import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import {Col, Empty, Input, Row,  Space, Table} from "antd";
import {showCaseTypeTable, showCaseTypeView} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanDetailStore from "../store/testPlanDetailStore";
import TestPlanBindCase from "./testPlanBindCaseModal";
import PaginationCommon from "../../../../common/caseCommon/pagination/Page";
import {useParams} from "react-router";
import {rowStyle, showCreateUser, ShowDeleteView} from "../../../testcase/components/testCaseTableFn";
import IconCommon from "../../../../common/caseCommon/IconCommon";
import {debounce} from "../../../../common/caseCommon/CaseCommonFn";
import testPlanStore from "../store/testPlanStore";
import functionInstanceStore from "../../../function/store/functionInstanceStore";
import {FunctionResultSelect} from "../../function/components/FunctionResultSelect";
import FunctionSetResultDrawer from "../../function/components/FunctionSetResultDrawer"
import PlanToFuncUnitPage from "../../common/planToCase/planToFuncUnitPage";
import {SearchOutlined} from "@ant-design/icons";


const TestPlanBindCaseList = (props) =>{
    const {findBindTestCasePage,deleteTestPlanDetail,findTestCasePage,getTestTypeNum} = testPlanDetailStore;
    const {setFunctionResult} = functionInstanceStore
    const {TestPlanTestType,findTestPlan} = testPlanStore
    const pathname = useParams().pathname

    const commonColumns = [
        {
            title:`名称`,
            dataIndex: "name",
            key: "name",
            width:"35%",
            ellipsis: true,
            render: (text,record) =>(
                <div className={"display-flex-gap"}>
                    <>{showCaseTypeView(record.caseType)}</>
                    <PlanToFuncUnitPage testPlanId={testPlanId} record={record}/>
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
            dataIndex: ["module","name"],
            key: "module",
            width:"20%",
            ellipsis: true,
        },{
            title: `创建人`,
            dataIndex:  ["createUser"],
            key: "user",
            width:"12%",
            ellipsis: true,
            render: (text, record) => (showCreateUser(record.createUser))
        },
        {
            title: `实际结果`,
            dataIndex:  "result",
            key: "result",
            width:"15%",
            render:(text, record) =>(
                <FunctionSetResultDrawer
                    record={record}
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
                <ShowDeleteView record={record} deleteFn={deleteFn} />
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
        }
    },[pageParam,testPlanId,pathname])

    const findPage = (params) =>{
        setTableLoading(true)
        const param = {
            testPlanType:TestPlanTestType,
            projectId:projectId,
            testPlanId:testPlanId,
            categoryId:selectCategory,
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
                <Input
                    placeholder={`搜索用例`}
                    onPressEnter={onSearch}
                    className='search-input-common'
                    style={{width: '180px'}}
                    prefix={<SearchOutlined />}
                    onChange={debounce(onSearch, 500)}
                    allowClear
                />
                <Space>
                    {testPlanType === "function"&&(
                        <FunctionResultSelect
                            selectChange={selectResultFun}
                            placeholder={"状态"}
                            isFliter={true}
                        />
                    )}


                    <TestPlanBindCase
                        testPlanId={testPlanId}
                        findBindCasePage={findPage}
                    />

                </Space>
            </div>
            <div className={"table-list-box"}>
                <Table
                    className="tablelist"
                    columns={commonColumns }
                    dataSource={planBindCaseList}
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

    )
}


export default observer(TestPlanBindCaseList);