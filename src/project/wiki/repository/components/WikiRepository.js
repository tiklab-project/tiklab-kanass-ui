/*
 * @Descripttion: 知识库列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:36:48
 */
import React, { useEffect, useRef, useState } from "react";
import {Table, Space, Row, Col, Alert, Empty, Input, Modal} from "antd";
import { observer, Provider } from "mobx-react";
import Button from "../../../../common/button/Button";
import "./WikiRepository.scss";
import { withRouter } from "react-router";
import { applyJump } from "tiklab-core-ui";
import WikiRepositoryStore from "../store/WikiRepositoryStore";
import DeleteModal from "../../../../common/deleteModal/deleteModal";
import PaginationCommon from "../../../../common/page/Page";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import {SettingOutlined} from "@ant-design/icons";
import ProjectDocumentAddModel from "../../document/components/ProjectDocumentAddModel";

const WikiRepository = (props) => {
    const store = {
        wikiRepositoryStore: WikiRepositoryStore
    }
    const {
        findSystemUrl, findProjectWikiRepositoryList,
        // findWorkItemDocumentPage, documentList,
        // deleteWorkItemDocument, documentCondition
        findProjectDocumentPage, documentList,
        deleteProjectDocument, documentCondition
    } = WikiRepositoryStore;

    const projectId = props.match.params.id;
    const [swardUrl, setSwardUrl] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [totalPage, setTotalPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const wikiRepository = useRef();
    // 初始化
    useEffect(() => {
        findProjectDocumentPage({
            projectId: projectId,
            name: ""
        }).then(res => {
            if (res.code === 0) {
                setTotalPage(res.data.totalPage)
                setTotal(res.data.totalRecord)
            }

        })

        findSystemUrl({ name: "sward" }).then(res => {
            if (res.code === 0) {
                setSwardUrl(res.data)
            }
        })
    }, []);

    const goWikiDocument = (data) => {
        if (data.exist) {
            findSystemUrl({ name: "sward" }).then(res => {
                let kanassUrl;
                if (res.code === 0 && res.data.length > 0) {
                    kanassUrl = res.data[0]?.systemUrl
                }
                if (data.documentType === "document") {
                    applyJump(`${kanassUrl}/#/repository/${data.kanassRepositoryId}/doc/rich/${data.id}`);
                } else {
                    applyJump(`${kanassUrl}/#/repository/${data.kanassRepositoryId}/doc/markdown/${data.id}`);
                }
            })
        } else {
            return
        }

    }

    const delectRepository = (id) => {
        deleteProjectDocument({ id: id }).then((data) => {
            if (data.code === 0) {
                findProjectDocumentPage().then(res => {
                    setTotalPage(res.data.totalPage)
                    setTotal(res.data.totalRecord)
                })
            }
        })
    }

    const findPage = async () => {
        findProjectDocumentPage().then(res => {
            setTotalPage(res.data.totalPage)
            setTotal(res.data.totalRecord)
        })
    }

    const documentColumns = [
        {
            title: "标题",
            dataIndex: ["kanassDocument", "documentName"],
            key: "name",
            width: 250,
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
            width: 200
        },
        {
            title: "作者",
            dataIndex: ["kanassDocument", "userName"],
            key: "assigner",
            width: 150
        },
        // {
        //     title: "关联事项",
        //     dataIndex: ["workItem", "title"],
        //     key: "workItem",
        //     width: 150
        // },
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

    const changePage = (currentPage) => {
        const value = {
            pageParam: {

                ...documentCondition.pageParam,
                currentPage: currentPage
            }

        }
        findProjectDocumentPage(value).then(res => {
            if (res.code === 0) {
                setTotalPage(res.data.totalPage)
                setTotal(res.data.totalRecord)
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
        findProjectDocumentPage(param).then(res => {
            if (res.code === 0) {
                setTotalPage(res.data.totalPage)
                setTotal(res.data.totalRecord)
            }

        })
    }

    const workDocument = useRef(null)

    const handleAddDocument = () => {
        findProjectWikiRepositoryList({projectId: projectId}).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0){
                    setShowAddModal(true)
                }else {
                    Modal.confirm({
                        title: '提示?',
                        content: "该项目没有关联知识库，是否先去添加知识库",
                        centered: true,
                        okText: "去添加",
                        cancelText: "取消",
                        getContainer: wikiRepository ? () => wikiRepository.current : null,
                        onOk() { props.history.push({
                            pathname: `/project/${projectId}/wiki`,
                            state: { activeKey: "repository" }
                        }) }
                    });
                }
            }
        })

    }
    return (<Provider {...store}>
        <div className="wiki-repository" ref={wikiRepository}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="wiki-repository-list">
                        <div style={{marginBottom:"24px"}}>
                            <Breadcumb firstText="文档">

                            </Breadcumb>
                        </div>

                        {
                            swardUrl.length <= 0 && <Alert
                                message="没有知识库地址，请去添加"
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

                        <div ref={workDocument}>
                            <div className="wiki-table-top">
                                <div className="search-input">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-search"></use>
                                    </svg>
                                    <Input bordered={false} allowClear
                                           className="work-relation-search-input"
                                           key={"search"}
                                           onChange={(value) => inputChange(value.target.value)}
                                           placeholder="搜索文档"
                                           value={inputValue}
                                    />
                                </div>
                                <div className="top-operate">
                                    <Button type={"primary"} onClick={handleAddDocument}>
                                        关联文档
                                    </Button>
                                    <span
                                        className="link-text"
                                        onClick={() => props.history.push(`/project/${projectId}/set/integration`)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <SettingOutlined style={{marginRight: '5px'}}/>
                                        {/*关联知识库*/}
                                    </span>
                                </div>
                            </div>
                            <Table
                                columns={documentColumns}
                                dataSource={documentList}
                                rowKey={(record) => record.id}
                                pagination={false}
                                onChange={false}
                                scroll={{x: "100%"}}
                                locale={{
                                    emptyText: (
                                        <Empty description={"暂无数据"}/>
                                    )
                                }}
                            />
                            <PaginationCommon
                                currentPage={documentCondition.pageParam.currentPage}
                                changePage={(currentPage) => changePage(currentPage)}
                                totalPage={totalPage}
                                total={total}
                            />
                        </div>

                    <ProjectDocumentAddModel showAddModal={showAddModal} setShowAddModal={setShowAddModal} findPage={findPage}/>
                    </div>
                </Col>
            </Row>
        </div>
        </Provider>


    );
};

export default withRouter(observer(WikiRepository));
