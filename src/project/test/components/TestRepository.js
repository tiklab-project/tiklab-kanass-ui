/*
 * @Descripttion: 用例库列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:35:15
 */
import React, { useEffect, useRef, useState } from "react";
import {Table, Space, Row, Col, message, Alert, Empty, Input} from "antd";
import { Provider, observer } from "mobx-react";
import Button from "../../../common/button/Button";
import "./TestRepository.scss";
import { withRouter } from "react-router";
import { applyJump } from "tiklab-core-ui";
import TestRepositoryStore from "../store/TestRepositoryStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import PaginationCommon from "../../../common/page/Page";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import TestPlanAdd  from "./TestPlanAdd";
import {SettingOutlined} from "@ant-design/icons";
const TestRepository = (props) => {
    const store = {
        testRepositoryStore: TestRepositoryStore
    }
    const { findSystemUrl,
        testCaseList, testCaseCondition,
        testPlanList, testPlanCondition,
        findProjectTestRepositoryPlanPage, deleteProjectTestRepositoryPlan,
        findWorkTestCasePage, deleteWorkTestCase
    } = TestRepositoryStore;

    const projectId = props.match.params.id;
    const [testhuboUrl, setTesthuboUrl] = useState([]);
    const [planList, setPlanList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [totalPage, setTotalPage] = useState(1);
    const [total, setTotal] = useState(0);

    const changePage = (currentPage) => {
        const value = {
            pageParam: {

                ...testPlanCondition.pageParam,
                currentPage: currentPage
            }

        }
        findProjectTestRepositoryPlanPage(value).then(res => {
            if (res.code === 0) {
                console.log(res.data)
                setTotal(res.data.totalRecord)
                setTotalPage(res.data.totalPage)
                setPlanList(res.data.dataList)
            }

        })
        console.log(currentPage)
    }

    const inputChange = (value) => {
        setInputValue(value)
        const param = {
            pageParam: {
                pageSize: 10,
                currentPage: 1
            },
            name: value
        }
        findProjectTestRepositoryPlanPage(param).then(res => {
            if (res.code === 0) {
                setTotalPage(res.data.totalPage)
                setTotal(res.data.totalRecord)
                setPlanList(res.data.dataList)
            }

        })
    }

    const delectTestCase = (id) => {
        deleteWorkTestCase({ id: id }).then(res => {
            if (res.code === 0) {
                findWorkTestCasePage({ projectId: projectId })
            }
        })
    }

    const deleteTestPlan = (id) => {
        deleteProjectTestRepositoryPlan(id).then(res => {
            if (res.code === 0) {
                findProjectTestRepositoryPlanPage({ projectId: projectId }).then(res => {
                    if (res.code === 0){
                        setTotal(res.data.totalRecord)
                        setTotalPage(res.data.totalPage)
                        setPlanList(res.data.dataList)
                    }
                })
            }
        })
    }

    const goCaseDetail = (record) => {
        if (record.exist) {
            switch (record.caseType) {
                case "api-unit":
                    toCaseDetail("apiUnit", record)
                    break;
                case "api-scene":
                    toCaseDetail("apiScene", record)
                    break;
                case "api-perform":
                    toCaseDetail("apiPerform", record)
                    break;
                case "web-scene":
                    toCaseDetail("webScene", record)
                    break;
                case "web-perform":
                    toCaseDetail("webPerform", record)
                    break;
                case "app-scene":
                    toCaseDetail("appScene", record)
                    break;
                case "app-perform":
                    toCaseDetail("appPerform", record)
                    break;
                case "function":
                    toCaseDetail("function", record)
                    break;

            }
        } else {
            return;
        }

    }


    const toCaseDetail = (caseType, data) => {
        findSystemUrl({ name: "testhubo" }).then(res => {
            const testUrl = res.webUrl ? res.webUrl : res.systemUrl
            applyJump(`${testUrl}/#/project/${data.repository.id}/testcase/${caseType}/${data.id}`)
        })
    }

    const goPlanDetail = (data) => {
        findSystemUrl({ name: "testhubo" }).then(res => {
            const testUrl = res.data[0].systemUrl
            applyJump(`${testUrl}/#/plan/${data.planId}/case`)
        })
    }

    const testPlanColumns = [
        {
            title: "标题",
            dataIndex: ["testPlan", "name"],
            key: "name",
            width: "20%",
            render: (text, record) => (
                <div className="testcase-title">
                    <div>
                        <svg className="icon-32" aria-hidden="true">
                            <use xlinkHref="#icon-testcase"></use>
                        </svg>
                    </div>

                    {/*{text}*/}
                    <span onClick={() => goPlanDetail(record)} className={`${record.exist ? "span-botton" : ""}`} >
                        {text}
                    </span>
                </div>

            ),
        },
        {
            title: "开始时间",
            dataIndex: ["testPlan","startTime"],
            key: "startTime",
            width: 150,
            render:(text, record) => {
                return text === null ? "" : text.substring(0, 10)
            }
        },
        {
            title: "结束时间",
            dataIndex: ["testPlan","endTime"],
            key: "endTime",
            width: 150,
            render:(text, record) => {
                return text === null ? "" : text.substring(0, 10)
            }
        },
        {
            title: "状态",
            dataIndex: ["testPlan", "state"],
            key: "state",
            width: 150,
            render: (text, record) =>
                <div className={`plan-state ${setStatuStyle(record.testPlan.state)}`}>
                    {text === 0 ? "未开始" : text === 1 ? "进行中" : "结束"}
                </div>

        },
        {
            title: "项目",
            dataIndex: ["testRepository", "testRepositoryName"],
            key: "repository",
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <DeleteModal deleteFunction={deleteTestPlan} id={record.id} getPopupContainer={testRepository.current} />
            ),
        }
    ];

    const setStatuStyle = (id) => {
        let name;
        switch (id) {
            case 0:
                name = "state-todo";
                break;
            case 1:
                name = "state-process";
                break;
            case 2:
                name = "state-done";
                break;
            default:
                name = "state-process";
                break;
        }
        return name;
    }
    // 初始化
    useEffect(() => {

        // findWorkTestCasePage({ projectId: projectId })
        findProjectTestRepositoryPlanPage({
            projectId: projectId,
            name: "",
        }).then(res => {
            if (res.code === 0) {
                setTotal(res.data.totalRecord)
                setTotalPage(res.data.totalPage)
                setPlanList(res.data.dataList)
            }
        })
        findSystemUrl({ name: "testhubo" }).then(res => {
            if (res.code === 0) {
                setTesthuboUrl(res.data)
            }
        })
    }, []);

    const [planVisible, setPlanVisible] = useState(false);

    const addTestPlan = () => {
        setPlanVisible(true);
    }


    const testRepository = useRef(null)
    return (<Provider {...store}>
        <div className="test-repository" ref={testRepository}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="test-repository-list">
                        <div style={{marginBottom: "24px"}}>
                            <Breadcumb firstText="测试">

                            </Breadcumb>

                        </div>

                        {
                            testhuboUrl.length <= 0 && <Alert
                                message="没有项目地址，请去添加"
                                type="info"
                                action={
                                    <Space>
                                        <Button type="text" size="small"
                                                onClick={() => props.history.push("/setting/urlData")}>
                                            添加
                                        </Button>
                                    </Space>
                                }
                                closable
                            />
                        }

                        <div>
                            <div className="test-table-top">
                                <div className="search-input">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-search"></use>
                                    </svg>
                                    <Input bordered={false} allowClear
                                           className="work-relation-search-input"
                                           key={"search"}
                                           onChange={(value) => inputChange(value.target.value)}
                                           placeholder="搜索计划"
                                           value={inputValue}
                                    />
                                </div>

                                <div className="top-operate">
                                    <span
                                        className="link-text"
                                        onClick={addTestPlan}
                                        style={{cursor: 'pointer'}}
                                    >
                                    <SettingOutlined style={{marginRight: '5px'}}/>
                                        {/*关联用例库*/}
                                    </span>
                                    {/*<Button type={"primary"} onClick={addTestPlan}>关联测试计划</Button>*/}
                                </div>

                            </div>
                            <Table
                                columns={testPlanColumns}
                                // dataSource={testCaseList}
                                dataSource={planList}
                                rowKey={(record) => record.id}
                                pagination={false}
                                onChange={false}
                                scroll={{x: "100%"}}
                                locale={{
                                    emptyText: (
                                        <Empty description={"暂无数据"}/>
                                    )
                                }}
                                locale={{
                                    emptyText: <Empty
                                        imageStyle={{height: 100}}
                                        description={<span>暂无数据</span>}
                                    />
                                }}
                            />
                            <PaginationCommon
                                currentPage={testCaseCondition.pageParam.currentPage}
                                changePage={(currentPage) => changePage(currentPage)}
                                totalPage={testCaseCondition.pageParam.totalPage}
                                total={testCaseCondition.pageParam.total}
                                showRefer={false}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <TestPlanAdd
                planVisible={planVisible}
                setPlanVisible={setPlanVisible}
                projectId={projectId}
                setPlanList={setPlanList}
                testRepositoryStore={TestRepositoryStore}
            />
        </div>
        </Provider>


    );
};

export default withRouter(observer(TestRepository));
