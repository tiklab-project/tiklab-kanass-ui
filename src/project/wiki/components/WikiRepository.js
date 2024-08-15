/*
 * @Descripttion: 版本列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useRef, useState } from "react";
import { Radio, Table, Space, Row, Col, message, Tabs } from "antd";
import { observer, Provider } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import "./wikiRepository.scss";
import WikiRepositoryAdd from "./WikiRepositoryAdd";
import { withRouter } from "react-router";
import { applyJump } from "thoughtware-core-ui";
import WikiRepositoryStore from "../store/WikiRepositoryStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import PaginationCommon from "../../../common/page/Page";

const WikiRepository = (props) => {
    const store = {
        wikiRepositoryStore: WikiRepositoryStore
    }
    const { deleteProjectWikiRepositoryByCondition, findProjectWikiRepositoryList, findSystemUrl,
        findWorkItemDocumentPage, documentList, deleteWorkItemDocument, documentCondition } = WikiRepositoryStore;

    const projectId = props.match.params.id;
    const [wikiAddvisible, setWikiAddvisible] = useState()
    const [projectWikiList, setProjectWikiList] = useState()
    const [activeKey, setActiveKey] = useState("document");
    // 初始化
    useEffect(() => {
        findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                setProjectWikiList(res.data)
            }

        })

        findWorkItemDocumentPage({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                console.log(res.data)
            }

        })
        return;
    }, []);
    const deleteRepository = (id) => {
        deleteProjectWikiRepositoryByCondition({ repositoryId: id, projectId: projectId }).then(data => {
            if (data.code === 0) {
                message.info('删除成功');
                findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
                    if (res.code === 0) {
                        setProjectWikiList(res.data)
                    }
                })
            }
        })
    }

    const goWikiDetail = (data) => {

        findSystemUrl({ name: "kanass" }).then(res => {
            const kanassUrl = res.webUrl ? res.webUrl : res.systemUrl
            // window.open(`${kanassUrl}/#/repositorydetail/${data.id}/overview`)
            applyJump(`${kanassUrl}/#/repositorydetail/${data.id}/overview`)
        })
    }
    // 列表的列
    const columns = [
        {
            title: "知识库名称",
            dataIndex: "kanassRepositoryName",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title">
                <img
                    src={('images/repository1.png')}
                    alt=""
                    className="icon-30"
                />
                <span className="repository-name" onClick={() => goWikiDetail(record)} >{text}</span>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: "userName",
            key: "master",
            align: "left",
            width: "20%",
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            align: "left",
            width: "20%"
        },
        {
            title: '操作',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <Space size="small">
                    <DeleteModal deleteFunction={deleteRepository} id={record.id} />
                </Space>
            ),
        }
    ];

    const goWikiDocument = (data) => {
        if (data.exist) {
            findSystemUrl({ name: "sward" }).then(res => {
                const kanassUrl = res.webUrl ? res.webUrl : res.systemUrl;
                applyJump(`${kanassUrl}/#/repositorydetail/${data.kanassRepositoryId}/doc/${data.id}`);
            })
        } else {
            return
        }

    }

    const delectRepository = (id) => {
        deleteWorkItemDocument({ id: id }).then((data) => {
            if (data.code === 0) {
                findWorkItemDocumentPage()
            }
        })
    }

    const documentColumns = [
        {
            title: "标题",
            dataIndex: ["kanassDocument", "documentName"],
            key: "name",
            width: 200,
            render: (text, record) => (
                <div className="document-title">
                    <div>
                    {
                        record.kanassDocument.documentType !== "markdown" && <svg className="icon-32" aria-hidden="true">
                            <use xlinkHref="#icon-file"></use>
                        </svg>
                    }
                    {
                        record.kanassDocument.documentType === "markdown" && <svg className="icon-32" aria-hidden="true">
                            <use xlinkHref="#icon-minmap"></use>
                        </svg>
                    }
                    </div>
                    
                    <span onClick={() => goWikiDocument(record.kanassDocument)} className={`${record.exist ? "span-botton" : ""}`} >{text}</span>

                </div>

            ),
        },
        {
            title: "知识库",
            dataIndex: ["kanassDocument", "kanassRepositoryName"],
            key: "workStatus",
            width: 150
        },
        {
            title: "作者",
            dataIndex: ["kanassDocument", "userName"],
            key: "assigner",
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
            width: "15%",
            render: (text, record) => (
                // <span onClick={() => delectRepository(record.id)} className="span-botton" >删除</span>
                <DeleteModal deleteFunction={delectRepository} id={record.id} getPopupContainer={workDocument.current} />
            ),
        }
    ];






    const showWikiRepository = () => {
        setWikiAddvisible(true)
    }
    const changePage = (currentPage) => {
        const value = {
            pageParam: {

                ...documentCondition.pageParam,
                currentPage: currentPage
            }

        }
        findWorkItemDocumentPage(value).then(res => {
            if (res.code === 0) {
                console.log(res.data)
            }

        })
        console.log(currentPage)
    }

    const workDocument = useRef(null)

    return (<Provider {...store}>
        <div className="wiki-repository">
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="wiki-repository-list">
                        <div className="wiki-repository-list-top">
                            <div className="wiki-repository-tab">
                                <div
                                    className={`wiki-repository-tab-item ${activeKey === "document" ? "wiki-repository-tab-select" : ""}`}
                                    key={1}
                                    onClick={() => setActiveKey("document")}
                                >
                                    文档
                                </div>
                                <div
                                    className={`wiki-repository-tab-item ${activeKey === "repository" ? "wiki-repository-tab-select" : ""}`}
                                    key={2}
                                    onClick={() => setActiveKey("repository")}
                                >知识库</div>

                            </div>
                            {
                                activeKey === "repository" && <Button type="primary" onClick={() => showWikiRepository()}>
                                    添加知识库
                                </Button>
                            }

                        </div>
                        {
                            activeKey === "document" && <div ref={workDocument}>
                                <Table
                                    columns={documentColumns}
                                    dataSource={documentList}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    onChange={false}
                                />
                                <PaginationCommon
                                    currentPage={documentCondition.pageParam.currentPage}
                                    changePage={(currentPage) => changePage(currentPage)}
                                    totalPage={documentCondition.pageParam.totalPage}
                                />
                            </div>
                        }
                        {
                            activeKey === "repository" && <div>
                                <Table
                                    columns={columns}
                                    dataSource={projectWikiList}
                                    rowKey={(record) => record.id}
                                    pagination={false}
                                    onChange={false}
                                />
                                <WikiRepositoryAdd
                                    projectId={projectId}
                                    wikiAddvisible={wikiAddvisible}
                                    setWikiAddvisible={setWikiAddvisible}
                                    setProjectWikiList={setProjectWikiList}
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

export default withRouter(observer(WikiRepository));
