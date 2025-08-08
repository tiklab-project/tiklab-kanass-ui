import React, {useEffect, useRef, useState} from "react";
import {Drawer, Empty, Spin, Table, Tag} from "antd";
import {inject, observer} from "mobx-react";
import {messageFn} from "../../../common/messageCommon/MessageCommon";
import {showCaseTypeTable,  showTestTypeView} from "../../../common/caseCommon/CaseCommonFn";
import {Axios} from "tiklab-core-ui";
import CaseBread from "../../../common/CaseBread";
import {LoadingOutlined} from "@ant-design/icons";
import '../../instance/components/testPlanBindCaseInstance.scss';  
import { formatElapsedTime } from '../../../common/utils/commonFn';

const TestPlanExecuteTestDrawer = (props) =>{
    const {apiEnvStore,appEnvStore,testPlanStore} = props;
    const {apiEnvId} = apiEnvStore
    const {appEnv} = appEnvStore
    const {setTestDrawerVisible,testDrawerVisible} = testPlanStore

    const [spinning, setSpinning] = useState(true);
    const [caseList, setCaseList] = useState();
    const [hasCleanedUp, setHasCleanedUp] = useState(false);

    let columns= [
        {
            title: '名称',
            width: '25%',
            dataIndex: 'name',
        },
        {
            title: '测试类型',
            width: '25%',
            dataIndex: 'testType',
            render: (text) =>(showTestTypeView(text))
        },
        {
            title: '用例类型',
            dataIndex: 'caseType',
            width: '25%',
            render: (text) =>(<div className={"case-table-case-type"}>{showCaseTypeTable(text)}</div>)
        },
        {
            title: "耗时",
            dataIndex: "elapsedTime",
            key: "caseType",
            width: "10%",
            render: (text, record) => (formatElapsedTime(text))
        },
        {
            title: '是否通过',
            width: 150,
            dataIndex: 'result',
            render: (text, record) => (showCaseResult(record))
        },
    ]


    const testPlanId = sessionStorage.getItem('testPlanId')
    let projectId = localStorage.getItem('projectId')
    const [result, setResult] = useState();
    const [start, setStart] = useState(false);
    const [testPlanInstanceInfo, setTestPlanInstanceInfo] = useState();
    let ref = useRef(null)

    useEffect( ()=>{
        if(testDrawerVisible){
             showModal()
        }
    },[testDrawerVisible])

    useEffect(()=>{
        if (start) {
            ref.current =  setInterval(()=>{
                let param = new FormData()
                param.append("testPlanId", testPlanId)
                Axios.post("/testPlanTestDispatch/exeResult",param).then(res=>{
                    if(res.code===0){
                        let data = res.data
                        if (data.status === 0) {
                            clearInterval(ref.current)
                            setStart(false)
                            messageFn("success","执行完毕")

                            //最后一次执行清楚后端缓存数据
                            if (!hasCleanedUp) {
                                Axios.post("/testPlanTestDispatch/cleanUpExecutionData", param);
                                setHasCleanedUp(true);
                            }
                        }

                        setSpinning(false)
                        setTestPlanInstanceInfo(data.testPlanInstance)
                        setResult(data)
                        setCaseList(data.testPlanCaseInstanceList)
                    }else {
                        setStart(false)
                        setTestDrawerVisible(false)
                        clearInterval(ref.current)
                        messageFn("error", "执行失败");

                        //最后一次执行清楚后端缓存数据
                        Axios.post("/testPlanTestDispatch/cleanUpExecutionData",param)
                    }
                })
            },2000);

            setSpinning(true)
        }
        return () => {
            if (ref.current) {
                clearInterval(ref.current); // 清理定时器
            }
        };
    },[start])

    const showModal =  ()=>{
        let params = {
            apiEnvId: apiEnvId,
            testPlanId:testPlanId,
            projectId:projectId,
            appEnv:appEnv,
        }

        Axios.post("/testPlanTestDispatch/execute",params)

        setTimeout(()=>{
            setStart(true);
        }, 2000);
    }

    const onClose = () => {
        setTestDrawerVisible(false);
        setCaseList([])
        setSpinning(true)
        setResult(null)
        setTestPlanInstanceInfo(null)
        setHasCleanedUp(false);
    };


    const showCaseResult = (record)=>{
        //状态为 1 说明正在执行
        switch (record.status) {
            case 0:
                return showResult(record.result)
            case 1:
                return <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>} />
            case 2:
                return <Tag>未执行</Tag>
            default:
                return <Tag color="error">状态异常</Tag>
        }
    }

    const showResult = (type)=>{
        if(type){
            return <Tag color="success">通过</Tag>
        }else{
            return <Tag color="error">未通过</Tag>
        }
    }


    return(
        <>
            <Drawer
                placement="right"
                onClose={onClose}
                visible={testDrawerVisible}
                width={900}
                destroyOnClose={true}
                // maskStyle={{background:"transparent"}}
                //contentWrapperStyle={{top:48,height:"calc(100% - 50px)"}}
                closable={false}
            >
                <Spin spinning={spinning}>
                    <CaseBread breadItem={["计划测试"]} icon={"jihua"}/>
                    <div style={{height: "calc(100% - 44px)"}}>
                        <div className="history-detail-all">
                            <div className="history-detail-grid">
                                <div className="history-detail-item">
                                    <div className="item-label">测试结果</div>
                                    <div className="item-value result-status">
                                        {
                                            result?.status === 1
                                                ? <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>} />
                                                : (testPlanInstanceInfo?.result === 1 ? "成功" : "失败")
                                        }
                                    </div>
                                </div>
                                <div className="history-detail-item">
                                    <div className="item-label">可执行用例</div>
                                    <div className="item-value">{testPlanInstanceInfo?.total}</div>
                                </div>
                                <div className="history-detail-item">
                                    <div className="item-label">通过/失败</div>
                                    <div className="item-value">
                                        <span className="success-count">{testPlanInstanceInfo?.passNum}</span>
                                        <span className="separator">/</span>
                                        <span className="fail-count">{testPlanInstanceInfo?.failNum}</span>
                                    </div>
                                </div>
                                <div className="history-detail-item">
                                    <div className="item-label">通过率/失败率</div>
                                    <div className="item-value">
                                        <span className="success-rate">{testPlanInstanceInfo?.passRate}</span>
                                        <span className="separator">/</span>
                                        <span className="fail-rate">{testPlanInstanceInfo?.errorRate}</span>
                                    </div>
                                </div>
                                <div className="history-detail-item">
                                    <div className="item-label">耗时</div>
                                    <div className="item-value">{formatElapsedTime(testPlanInstanceInfo?.elapsedTime)}</div>
                                </div>
                            </div>
                        </div>
                        {/* <div className={"history-detail-all-box"}>
                            <div className={"history-detail-all-item"}>
                                <div>测试结果</div>
                                <div className={"history-detail-all-item-value"}>
                                    {
                                        result?.status===1
                                            ? <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>} />
                                            : <>{testPlanInstanceInfo?.result===1&&"成功"}{testPlanInstanceInfo?.result===0&&"失败"}</>
                                    }
                                </div>
                            </div>
                            <div className={"history-detail-all-item"}>
                                <div>可执行用例</div>
                                <div className={"history-detail-all-item-value"}>{testPlanInstanceInfo?.total}</div>
                            </div>
                            <div className={"history-detail-all-item"}>
                                <div>测试通过率</div>
                                <div className={"history-detail-all-item-value"}>{testPlanInstanceInfo?.passRate}</div>
                            </div>

                            <div className={"history-detail-all-item"}>
                                <div>通过步骤数</div>
                                <div className={"history-detail-all-item-value"}>{testPlanInstanceInfo?.passNum}</div>
                            </div>
                            <div className={"history-detail-all-item"}>
                                <div>未通过步骤数</div>
                                <div className={"history-detail-all-item-value"}>{testPlanInstanceInfo?.failNum}</div>
                            </div>
                        </div> */}
                        <div className={"header-item"}>用例列表</div>
                        <div className='table-list-box test-step-box'>
                            <Table
                                columns={columns}
                                dataSource={caseList}
                                rowKey={record => record.id}
                                pagination={false}
                                locale={{
                                    emptyText: <Empty
                                        imageStyle={{ height: 100}}
                                        description={<span>暂无测试用例</span>}
                                    />,
                                }}
                            />
                        </div>
                    </div>
                </Spin>
            </Drawer>
        </>
    )
}

export default inject("apiEnvStore","appEnvStore","testPlanStore")(observer(TestPlanExecuteTestDrawer));