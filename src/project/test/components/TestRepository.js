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
import { withRouter } from "react-router";
import { applyJump } from "tiklab-core-ui";
import TestRepositoryStore from "../store/TestRepositoryStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import PaginationCommon from "../../../common/page/Page";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import {SettingOutlined} from "@ant-design/icons";
const TestRepository = (props) => {
    const store = {
        testRepositoryStore: TestRepositoryStore
    }
    const { findSystemUrl,
        testCaseList, testCaseCondition,
        findWorkTestCasePage, deleteWorkTestCase
    } = TestRepositoryStore;

    const projectId = props.match.params.id;
    const [testhuboUrl, setTesthuboUrl] = useState([]);


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

        findWorkTestCasePage({ projectId: projectId })
        findSystemUrl({ name: "testhubo" }).then(res => {
            if (res.code === 0) {
                setTesthuboUrl(res.data)
            }
        })
    }, []);


    const testRepository = useRef(null)
    return (<Provider {...store}>
        <div className="test-repository" ref={testRepository}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="test-repository-list">
                        <div style={{marginBottom: "24px"}}>
                            <Breadcumb firstText="测试">
                                <span
                                    className="link-text"
                                    onClick={() => props.history.push(`/project/${projectId}/set/integration`)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <SettingOutlined style={{marginRight: '5px'}}/>
                                    关联用例库
                                </span>
                            </Breadcumb>

                        </div>

                        {
                            testhuboUrl.length <= 0 && <Alert
                                message="没有用例库地址，请去添加"
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
                                total={testCaseCondition.pageParam.total}
                                showRefer={false}
                            />
                        </div>



                    </div>
                </Col>
            </Row>
        </div>
        </Provider>


    );
};

export default withRouter(observer(TestRepository));
