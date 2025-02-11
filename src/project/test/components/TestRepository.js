/*
 * @Descripttion: 用例库列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:35:15
 */
import React, { useEffect, useRef, useState } from "react";
import { Table, Space, Row, Col, message, Alert } from "antd";
import { Provider, observer } from "mobx-react";
import Button from "../../../common/button/Button";
import "./TestRepository.scss";
import TestRepositoryAdd from "./TestRepositoryAdd";
import { withRouter } from "react-router";
import { applyJump } from "tiklab-core-ui";
import TestRepositoryStore from "../store/TestRepositoryStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import PaginationCommon from "../../../common/page/Page";
const TestRepository = (props) => {
    const store = {
        testRepositoryStore: TestRepositoryStore
    }
    const { deleteProjectTestRepositoryByCondition, findProjectTestRepositoryList, findSystemUrl,
        testCaseList, testCaseCondition, findWorkTestCasePage, deleteWorkTestCase } = TestRepositoryStore;

    const projectId = props.match.params.id;
    const [testAddvisible, setTestAddvisible] = useState()
    const [projectTestList, setProjectTestList] = useState()
    const [activeKey, setActiveKey] = useState("testCase");
    const [testhuboUrl, setTesthuboUrl] = useState([]);

    const delteRepository = (id) => {
        deleteProjectTestRepositoryByCondition({ repositoryId: id, projectId: projectId }).then(data => {
            if (data.code === 0) {
                message.info('删除成功');
                findProjectTestRepositoryList({ projectId: projectId }).then(res => {
                    if (res.code === 0) {
                        setProjectTestList(res.data)
                    }
                })
            }
        })
    }

    const goRepository = (data) => {
        findSystemUrl({ name: "testhubo" }).then(res => {
            const testUrl = res.webUrl ? res.webUrl : res.systemUrl
            applyJump(`${testUrl}/#/project/${data.id}/testcase`)
        })
        
    }
    // 列表的列
    const columns = [
        {
            title: "仓库名称",
            dataIndex: "testRepositoryName",
            key: "name",
            align: "left",

            render: (text, record) => <div className="repository-title" onClick={() => goRepository(record)}>
                {
                    record.iconUrl ?
                        <img
                            src={(record.iconUrl)}
                            alt=""
                            className="icon-30"
                        />
                        :
                        <img
                            src={('images/repository1.png')}
                            alt=""
                            className="icon-30"
                        />
                }
                <span className="repository-name">{text}</span>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: "user",
            key: "user",
            align: "left",
            width: "20%",
        },
        {
            title: '操作',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <Space size="small">
                    {/* <span className="repository-delete" onClick={() => delteRepository(record.id)}>删除</span> */}
                    <DeleteModal deleteFunction={delteRepository} id={record.id} getPopupContainer={testRepository.current} />
                </Space>
            ),
        },
    ];

    const changePage = (currentPage) => {
        const value = {
            pageParam: {

                ...testCaseCondition.pageParam,
                currentPage: currentPage
            }

        }
        findWorkTestCasePage(value).then(res => {
            if (res.code === 0) {
                console.log(res.data)
            }

        })
        console.log(currentPage)
    }

    const delectTestCase = (id) => {
        deleteWorkTestCase({ id: id }).then(res => {
            if (res.code === 0) {
                findWorkTestCasePage({ projectId: projectId })
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

    const testCaseColumns = [
        {
            title: "标题",
            dataIndex: ["projectTestCase", "testCaseName"],
            key: "name",
            width: "20%",
            render: (text, record) => (
                <div className="testcase-title">
                    <div>
                        <svg className="icon-32" aria-hidden="true">
                            <use xlinkHref="#icon-testcase"></use>
                        </svg>
                    </div>


                    <span onClick={() => goCaseDetail(record.projectTestCase)} className={`${record.exist ? "span-botton" : ""}`} >{text}</span>
                </div>

            ),
        },
        {
            title: "目录",
            dataIndex: ["projectTestCase", "testCategoryName"],
            key: "testCaseName",
            width: 150
        },
        {
            title: "仓库",
            dataIndex: ["projectTestCase", "repository", "name"],
            key: "repository",
            width: 150
        },
        {
            title: "作者",
            dataIndex: ["projectTestCase", "createUser"],
            key: "createUser",
            width: 150
        },
        {
            title: "关联事项",
            dataIndex: ["workItem", "title"],
            key: "workItem",
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <DeleteModal deleteFunction={delectTestCase} id={record.id} getPopupContainer={testRepository.current} />
            ),
        }
    ];
    // 初始化
    useEffect(() => {
        const activeKey = props.location.state ? props.location.state.activeKey : 'testCase';
        setActiveKey(activeKey)
        findProjectTestRepositoryList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                setProjectTestList(res.data)
            }

        })
        findWorkTestCasePage({ projectId: projectId })
        findSystemUrl({ name: "testhubo" }).then(res => {
            if (res.code === 0) {
                setTesthuboUrl(res.data)
            }
        })
        return;
    }, []);


    const showTestRepository = () => {
        setTestAddvisible(true)
    }
    const testRepository = useRef(null)
    return (<Provider {...store}>
        <div className="test-repository" ref={testRepository}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="test-repository-list">
                        <div className="test-repository-list-top">
                            <div className="test-repository-tab">
                                <div
                                    className={`test-repository-tab-item ${activeKey === "testCase" ? "test-repository-tab-select" : ""}`}
                                    key={1}
                                    onClick={() => setActiveKey("testCase")}
                                >
                                    用例
                                </div>
                                <div
                                    className={`test-repository-tab-item ${activeKey === "repository" ? "test-repository-tab-select" : ""}`}
                                    key={2}
                                    onClick={() => setActiveKey("repository")}
                                >用例库</div>

                            </div>
                            {
                               testhuboUrl.length > 0 && activeKey === "repository" && <Button type="primary" onClick={() => showTestRepository()}>
                                    添加用例库
                                </Button>
                            }

                        </div>
                        {
                            testhuboUrl.length <= 0 && <Alert
                                message="没有用例库地址，请去添加"
                                type="info"
                                action={
                                    <Space>
                                        <Button type="text" size="small" onClick={() => props.history.push("/setting/urlData")}>
                                            添加
                                        </Button>
                                    </Space>
                                }
                                closable
                            />
                        }
                        {
                            activeKey === "repository" && <>
                                <Table
                                    columns={columns}
                                    dataSource={projectTestList}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    onChange={false}
                                    scroll={{x: "100%"}}
                                />
                                <TestRepositoryAdd
                                    projectId={projectId}
                                    testAddvisible={testAddvisible}
                                    setTestAddvisible={setTestAddvisible}
                                    setProjectTestList={setProjectTestList}
                                />
                            </>
                        }
                        {
                            activeKey === "testCase" && <div>
                                <Table
                                    columns={testCaseColumns}
                                    dataSource={testCaseList}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    onChange={false}
                                    scroll={{x: "100%"}}
                                />
                                <PaginationCommon
                                    currentPage={testCaseCondition.pageParam.currentPage}
                                    changePage={(currentPage) => changePage(currentPage)}
                                    totalPage={testCaseCondition.pageParam.totalPage}
                                    total = {testCaseCondition.pageParam.total}
                                    showRefer = {false}
                                />
                            </div>
                        }

                    </div>
                </Col>
            </Row>
        </div>
    </Provider>


    );
};

export default withRouter(observer(TestRepository));
