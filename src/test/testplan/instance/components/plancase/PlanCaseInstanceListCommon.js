import React, {useEffect, useState} from "react";
import {Empty, Table} from "antd";
import { observer} from "mobx-react";
import testPlanBindCaseInstanceStore from "../../store/testPlanBindCaseInstanceStore";
import PaginationCommon from "../../../../common/pagination/Page";
import {CASE_TYPE, TEST_TYPE} from "../../../../common/dictionary/dictionary";
import ApiUnitInstanceSinglePage from "../../../../test/api/http/unit/components/apiUnitInstanceSinglePage";
import ApiSceneInstanceSinglePage from "../../../../test/api/http/scene/components/apiSceneInstanceSinglePage";
import ApiPerfInstanceSinglePage from "../../../../test/api/http/perf/components/ApiPerfInstanceSinglePage";
import {CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined} from "@ant-design/icons";
import {rowStyle} from "../../../../test/testcase/components/testCaseTableFn";
import "./planCaseInstanceListStyle.scss"
import {formatElapsedTime} from "../../../../common/utils/commonFn";

const PlanCaseInstanceListCommon = (props) =>{
    const {
        type,
        WebSceneInstanceSinglePage,
        AppSceneInstanceSinglePage,
        caseId,
        testPlanId
    } = props;
    const {
        findTestPlanBindCaseInstancePage,
        testPlanBindCaseInstanceList,
        totalPage,
        tableLoading,
        totalRecord
    } = testPlanBindCaseInstanceStore;

    const columns = [
        {
            title: '名称',
            dataIndex: ["testCase",'name'],
            key: "name",
            width: "25%",
            ellipsis: true,
            render:(text,record,index)=>(showTitle(text,record))
        },{
            title: '测试类型',
            dataIndex: 'caseType',
            key: "type",
            width: "10%",
            render:(text,record)=>(showType(text, record))
        },
        // {
        //     title: '当前计划',
        //     dataIndex: ["testPlan","name"],
        //     key: "plan",
        //     width: "15%",
        //     ellipsis: true,
        // },
        {
            title: '信息',
            dataIndex: "detail",
            key: "detail",
            width: "30%",
            ellipsis: true,
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

    const [pageSize] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [instanceList, setInstanceList] = useState([]);


    useEffect(() => {
        findPage()
    }, [caseId]);

    const findPage = async (params) => {
        let param={
            pageParam: {
                pageSize: pageSize,
                currentPage: currentPage
            },
            type:type,
            caseId: caseId,
            testPlanId: testPlanId,
            ...params
        };

       let res =  await findTestPlanBindCaseInstancePage(param)
        setInstanceList(res.data.dataList)
    }


    // 分页
    const onTableChange = async (current) => {
        setCurrentPage(current)
        const newParams = {
            pageParam: {
                pageSize: pageSize,
                currentPage: current
            },
        }

        await findPage(newParams)
    }


    /**
     * 类型展示
     */
    const showType = (text, record) => {
        switch (record.caseType) {
            case CASE_TYPE.API_UNIT:
                return "接口单元"
            case CASE_TYPE.API_SCENE:
                return "接口场景"
            case CASE_TYPE.API_PERFORM:
                return "接口性能"
            case CASE_TYPE.WEB_SCENE:
                return "WEB场景"
            case CASE_TYPE.APP_SCENE:
                return "APP场景"
        }
    }

    /**
     * 根据类型展示不同的界面
     */
    const showTitle = (text,record,executeNumber)=>{
        switch (record.caseType) {
            case CASE_TYPE.API_UNIT:
                return <ApiUnitInstanceSinglePage apiUnitInstanceId={record.caseInstanceId} name={`${record?.testCase?.name}`}/>
            case CASE_TYPE.API_SCENE:
                return <ApiSceneInstanceSinglePage apiSceneInstanceId={record.caseInstanceId} name={`${record?.testCase?.name}`}/>
            case CASE_TYPE.API_PERFORM:
                return <ApiPerfInstanceSinglePage apiPerfInstanceId={record.caseInstanceId} name={`${record?.testCase?.name}`}/>
            case CASE_TYPE.WEB_SCENE:
                return  WebSceneInstanceSinglePage&&<WebSceneInstanceSinglePage webSceneInstanceId={record.caseInstanceId} name={`${record?.testCase?.name}`}/>
            case CASE_TYPE.APP_SCENE:
                return AppSceneInstanceSinglePage&&<AppSceneInstanceSinglePage appSceneInstanceId={record.caseInstanceId} name={`${record?.testCase?.name}`}/>

        }
    }

    const showColumnInfo = (record) =>{

        switch (record.caseType) {
            case CASE_TYPE.API_UNIT:
                return <div className={"plan-bind-case-info"}>
                    {showResultView(record.result)}
                    {/*<span>{record?.apiUnitInstance?.apiUnit?.methodType}</span>*/}
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

    const showResultView = (result) =>{
        switch (result) {
            case 0:
                return <span><CloseCircleTwoTone twoToneColor={"red"}/> 失败</span>
            case 1:
                return <span><CheckCircleTwoTone twoToneColor={"#52c41a"}/> 成功</span>
            default:
                return <CheckCircleTwoTone />

        }
    }



    const processTime = (ms) => {
        if (ms < 1000) {
            return `${ms} ms`;
        } else {
            const seconds = (ms / 1000).toFixed(2);
            return `${seconds} s`;
        }
    };
    const apiUnitContent = (content,record) => (
        <div className={"display-flex-gap"}>
            {showResult(record.status)}
            <div>
                <div className={"display-flex-gap"}>
                    <div>{content.statusCode|| "--"}</div>
                    <div style={{fontSize: "12px", color: "#aaa"}}> /</div>
                    <div>{processTime(content.elapsedTime||0)}</div>

                </div>
            </div>
        </div>
    )

    const apiSceneContent = (content,record) => (
        <div className={"display-flex-gap"}>
            {showResult(record.status)}
            <div className={"display-flex-gap"}>
                <div className={"instance-green"}>{content.passRate}</div>
                <div style={{fontSize: "12px", color: "#aaa"}}> /</div>
                <div>{processTime(content.elapsedTime||0)}</div>

            </div>

        </div>
    )

    const apiPerformContent = (content,record) =>(
        <div className={"display-flex-gap"}>
            {showResult(record.status)}
            <div className={"display-flex-gap"}>
                <div className={"instance-green"}>{content.passRate}</div>
                <div style={{fontSize: "12px", color: "#aaa"}}> /</div>
                <div>{processTime(content.elapsedTime||0)}</div>

            </div>
        </div>
    )

    const webSceneContent = (content,record)=>(
        <div className={"display-flex-gap"}>
            {showResult(record.status)}
            <div className={"display-flex-gap"}>
                <div className={"instance-green"}>{content.passRate}</div>
                <div style={{fontSize: "12px", color: "#aaa"}}> /</div>
                <div>{processTime(content.elapsedTime||0)}</div>

            </div>
        </div>
    )

    const appSceneContent = (content,record) =>(
        <div className={"display-flex-gap"}>
            {showResult(record.status)}
            <div className={"display-flex-gap"}>
                <div className={"instance-green"}>{content.passRate}</div>
                <div style={{fontSize: "12px", color: "#aaa"}}> /</div>
                <div>{processTime(content.elapsedTime||0)}</div>
            </div>
        </div>
    )

    const showResult = (status)=>{
        switch (status) {
            case 0:
            case "complete":
            case "success":
                return <CheckCircleTwoTone twoToneColor={"#52c41a"}/>
            case "fail": return <CloseCircleTwoTone twoToneColor={"red"}/>
            case "start": return <LoadingOutlined twoToneColor={"blue"} />

            default: return <LoadingOutlined twoToneColor={"blue"} />
        }
    }



    return(
        <>
            <div className={"table-list-box"}>
                <div className={"list-size-title"} style={{margin: "10px 6px"}}>共{instanceList.length||0}个</div>
                <Table
                    columns={columns}
                    dataSource={instanceList}
                    rowKey={record => record.id}
                    pagination={false}
                    loading={tableLoading}
                    onRow={(record) => ({style: rowStyle(record.type)})}
                    locale={{
                        emptyText: !tableLoading
                            ? <Empty
                                imageStyle={{height: 100}}
                                description={<span>暂无历史</span>}
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

    )
}

export default observer(PlanCaseInstanceListCommon);