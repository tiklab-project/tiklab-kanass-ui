import React, {useEffect, useState} from "react";
import {Empty, Table, Tag} from "antd";
import {observer} from "mobx-react";
import {showCaseTypeTable, showTestTypeView} from "../../../common/caseCommon/CaseCommonFn";
import ApiUnitInstanceDrawer from "../../../test/api/http/unit/components/apiUnitInstanceSinglePage";
import ApiSceneInstanceDrawer from "../../../test/api/http/scene/components/apiSceneInstanceSinglePage";
import testPlanInstanceStore from "../store/testPlanInstanceStore";
import testPlanBindCaseInstanceStore from "../store/testPlanBindCaseInstanceStore";
import PaginationCommon from "../../../common/pagination/Page";
import {CASE_TYPE} from "../../../common/dictionary/dictionary";
import {rowStyle} from "../../../test/testcase/components/testCaseTableFn";
import './testPlanBindCaseInstance.scss';
import { formatElapsedTime } from '../../../common/utils/commonFn';
import {CheckCircleTwoTone, CloseCircleTwoTone} from "@ant-design/icons";
import {useParams} from "react-router";



const TestPlanBindCaseInstanceTable = (props) => {
    const {WebSceneInstanceSinglePage, AppSceneInstanceSinglePage} = props
    const {
        findTestPlanBindCaseInstancePage,
        testPlanBindCaseInstanceList,
    } = testPlanBindCaseInstanceStore;

    const {findTestPlanInstance} = testPlanInstanceStore;

    const column = [
        {
            title: `名称`,
            dataIndex: "name",
            key: "name",
            width: '40%',
            render: (text, record) => (showCaseInstance(record))
        },
        // {
        //     title: `测试类型`,
        //     dataIndex: "testType",
        //     key: "testType",
        //     width: '20%',
        //     render: (text, record) => (showTestTypeView(record.testType))
        // },
        {
            title: `用例类型`,
            dataIndex: "caseType",
            key: "caseType",
            width: '10%',
            render: (text, record) => (<div className={"case-table-case-type"}>{showCaseTypeTable(text)}</div>)
        },
        // {
        //     title: '是否通过',
        //     width: 150,
        //     dataIndex: 'result',
        //     render: (text, record) => (
        //         text === 1
        //             ? <Tag color="green">通过</Tag>
        //             : <Tag color="red">未通过</Tag>
        //     )
        // },
        {
            title: '信息',
            width: "40%",
            dataIndex: 'result',
            render: (text, record) => (showColumnInfo(record))
        },


        {
            title: "耗时",
            dataIndex: "elapsedTime",
            key: "caseType",
            width: "10%",
            render: (text, record) => (formatElapsedTime(text))
        },

    ]

    const {instanceId} = useParams()
    const testPlanInstanceId =instanceId?instanceId:sessionStorage.getItem("testPlanInstanceId")

    const [allData, setAllData] = useState();
    const [totalPage, setTotalPage] = useState();
    const [pageSize] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageParam, setPageParam] = useState({
        pageParam: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    })


    useEffect(async () => {
        let res = await findTestPlanInstance(testPlanInstanceId)

        setAllData(res)
    }, [testPlanInstanceId])

    useEffect(async () => {
        await findPage()
    }, [pageParam])

    const findPage = async () => {
        let param = {
            testPlanInstanceId: testPlanInstanceId,
            ...pageParam
        }
        let res = await findTestPlanBindCaseInstancePage(param)
        if (res.code === 0) {
            setTotalPage(res.data.totalPage)
        }
    }


    const showResultView = (result) =>{
        switch (result) {
            case 0:
                return <CloseCircleTwoTone twoToneColor={"red"}/>
            case 1:
                return <CheckCircleTwoTone twoToneColor={"#52c41a"}/>
            default:
                return <CheckCircleTwoTone />

        }
    }

    const showColumnInfo = (record) =>{

        switch (record.caseType) {
            case CASE_TYPE.API_UNIT:
                return <div className={"plan-bind-case-info"}>
                    {showResultView(record.result)}
                    <span>{record?.apiUnitInstance?.apiUnit?.methodType}</span>
                    <span>{record?.apiUnitInstance?.statusCode}</span>
                </div>

            case CASE_TYPE.API_SCENE:
                return <div className={"plan-bind-case-info"}>
                    {showResultView(record.result)}
                    <span>
                        <span>执行：</span>
                        <span>{record?.apiSceneInstance?.executeNumber}</span>
                    </span>
                    <span>
                        <span>通过：</span>
                        <span>{record?.apiSceneInstance?.passNumber}</span>
                    </span>
                    <span>
                        <span>失败：</span>
                        <span>{record?.apiSceneInstance?.failNumber}</span>
                    </span>
                </div>
            case CASE_TYPE.API_PERFORM:
                return <div className={"plan-bind-case-info"}>
                    {showResultView(record.result)}
                    <span>
                        <span>执行：</span>
                        <span>{record?.apiPerfInstance?.total}</span>
                    </span>
                    <span>
                        <span>通过：</span>
                        <span>{record?.apiPerfInstance?.passNum}</span>
                    </span>
                    <span>
                        <span>失败：</span>
                        <span>{record?.apiPerfInstance?.failNum}</span>
                    </span>
                </div>
            case CASE_TYPE.WEB_SCENE:
                return <div className={"plan-bind-case-info"}>
                    {showResultView(record.result)}
                    <span>
                        <span>执行：</span>
                        <span>{record?.webSceneInstance?.stepNum}</span>
                    </span>
                    <span>
                        <span>通过：</span>
                        <span>{record?.webSceneInstance?.passNum}</span>
                    </span>
                    <span>
                        <span>失败：</span>
                        <span>{record?.webSceneInstance?.failNum}</span>
                    </span>
                </div>
            case CASE_TYPE.APP_SCENE:
                return <div className={"plan-bind-case-info"}>
                    {showResultView(record.result)}
                    <span>
                        <span>执行：</span>
                        <span>{record?.appSceneInstance?.stepNum}</span>
                    </span>
                    <span>
                        <span>通过：</span>
                        <span>{record?.appSceneInstance?.passNum}</span>
                    </span>
                    <span>
                        <span>失败：</span>
                        <span>{record?.appSceneInstance?.failNum}</span>
                    </span>
                </div>
        }

    }




    const showCaseInstance = (record) => {
        switch (record.caseType) {
            case CASE_TYPE.API_UNIT:
                return <ApiUnitInstanceDrawer name={record.name} apiUnitInstanceId={record.caseInstanceId}/>
            case CASE_TYPE.API_SCENE:
                return <ApiSceneInstanceDrawer name={record.name} apiSceneInstanceId={record.caseInstanceId}/>
            case CASE_TYPE.WEB_SCENE:
                return WebSceneInstanceSinglePage
                    && <WebSceneInstanceSinglePage
                    name={record.name}
                    webSceneInstanceId={record.caseInstanceId}
                />
            case CASE_TYPE.APP_SCENE:
                return AppSceneInstanceSinglePage
                    && <AppSceneInstanceSinglePage
                    name={record.name}
                    appSceneInstanceId={record.caseInstanceId}
                />

            default:
                return record.name

            // case CASE_TYPE.WEB_SCENE:
            //     return <ExtensionCommon
            //         name={record.name}
            //         extension={WebSceneInstanceSinglePage && <WebSceneInstanceSinglePage name={record.name} webSceneInstanceId={record.caseInstanceId}/>}
            //     />
            // case CASE_TYPE.APP_SCENE:
            //     return <ExtensionCommon
            //         extension={AppSceneInstanceSinglePage && <AppSceneInstanceSinglePage name={record.name} appSceneInstanceId={record.caseInstanceId}/>}
            //         name={record.name}
            //     />
        }
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

    const getElapsedTime = (data) => {
        try {
            const content = JSON.parse(data?.instance?.content || '{}');
            return formatElapsedTime(content.elapsedTime);
        } catch (e) {
            return '0ms';
        }
    }

    return (
        <>
            <div className="history-detail-all">
                <div className="history-detail-grid">
                    <div className="history-detail-item">
                        <div className="item-label">测试结果</div>
                        <div className="item-value result-status">{allData?.result === 1 ? "成功" : "失败"}</div>
                    </div>
                    <div className="history-detail-item">
                        <div className="item-label">可执行用例</div>
                        <div className="item-value">{allData?.total}</div>
                    </div>
                    <div className="history-detail-item">
                        <div className="item-label">通过/失败</div>
                        <div className="item-value">
                            <span className="success-count">{allData?.passNum}</span>
                            <span className="separator">/</span>
                            <span className="fail-count">{allData?.failNum}</span>
                        </div>
                    </div>
                    <div className="history-detail-item">
                        <div className="item-label">通过率/失败率</div>
                        <div className="item-value">
                            <span className="success-rate">{allData?.passRate}</span>
                            <span className="separator">/</span>
                            <span className="fail-rate">{allData?.errorRate}</span>
                        </div>
                    </div>
                    <div className="history-detail-item">
                        <div className="item-label">耗时</div>
                        <div className="item-value">{getElapsedTime(allData)}</div>
                    </div>
                </div>
            </div>

            <div className="table-list-box">
                <Table
                    columns={column}
                    dataSource={testPlanBindCaseInstanceList}
                    rowKey={record => record.id}
                    pagination={false}
                    onRow={(record) => ({style: rowStyle(record.caseType)})}
                    locale={{
                        emptyText: <Empty
                            imageStyle={{height: 100}}
                            description={<span>暂无历史</span>}
                        />,
                    }}
                />
                <PaginationCommon
                    currentPage={currentPage}
                    totalPage={totalPage}
                    changePage={onTableChange}
                />
            </div>
        </>
    )
}

export default observer(TestPlanBindCaseInstanceTable);