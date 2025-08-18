import {Modal, Table} from "antd";
import React, {useEffect, useRef, useState} from "react";
import InputSearch from "../../../../common/input/InputSearch";
import {SelectItem, SelectSimple} from "../../../../common/select";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import "./ProjectDocumentAddModel.scss"
import ProjectDocumentStore from "../store/ProjectDocumentStore";
import {observer} from "mobx-react";
import {withRouter} from "react-router";

const ProjectDocumentAddModel = (props) => {
    const {showAddModal, setShowAddModal, findPage} = props;

    const { findDocumentPageByWorkItemId, createProjectDocument,
        findProjectWikiRepositoryList, findUnRelationProjectDocumentList,
        findRepositoryUserList, userList, unRelationTotal, setUnRelationWorkCondition, currentRecord, setCurrentRecord,cleanCurrentRecord
    } = ProjectDocumentStore;
    const projectId = props.match.params.id;
    const [documentList, setDocumentList] = useState([])
    const [repositoryallList, setRepositoryaList] = useState([]);
    const [repositoryallIdList, setRepositoryallIdList] = useState([]);
    const [repositoryValue, setRepositoryValue] = useState()
    const [currentPage, setCurrentPage] = useState();
    const [totalPage, setTotalPage] = useState();
    const documentAdd = useRef();

    useEffect(() => {
        if (showAddModal){
            findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
                if (res.code === 0) {
                    setRepositoryaList(res.data)
                    let list = []
                    if (res.data.length > 0) {
                        res.data.map(item => {
                            list.push(item.id)
                        })
                        findRepositoryUserList(res.data[0].id)
                        setRepositoryallIdList(list)
                        findUnRelationProjectDocumentList({
                            repositoryIds: list,
                            name: "",
                            repositoryId: null,
                            projectId: projectId,
                            pageParam:{
                                pageSize:10,
                                currentPage: 1
                            }
                        }).then((data) => {
                            if (data.code === 0) {
                                setDocumentList(data.data.dataList)
                                setCurrentPage(data.data.currentPage)
                                setTotalPage(data.data.totalPage)
                            }
                        })
                    }
                }
            })
        }
    }, [showAddModal]);

    const handleOk = () => {
        setShowAddModal(false);
    }

    const addWorkItemDocument = (record) => {
        const param = [{
            documentId: record.id,
            repositoryId: record.kanassRepositoryId,
            projectId: projectId
        }]
        createProjectDocument(param).then((data) => {
            if (data.code === 0) {
                findPage().then(res => {
                    setShowAddModal(false)
                })
            }
        })
    }

    const handleCancel = () => {
        setShowAddModal(false);
    }

    /**
     * 根据文档标题筛选数据
     */
    const searchSelectWorkRepository = (value) => {
        const categoryQuery = {
            name: value,
            pageParam: {
                pageSize: 5,
                currentPage: 1
            }
        }
        findUnRelationProjectDocumentList(categoryQuery).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }

        })
    }

    /**
     * 根据知识库筛选数据
     */
    const searchUnselectWorkRepository = (value) => {
        let params;
        if(value){
            params = {
                repositoryIds: [value?.value],
                pageParam: {
                    pageSize: 5,
                    currentPage: 1
                }
            }
            findRepositoryUserList(value?.value)
        }else {
            params = {
                repositoryIds: repositoryallIdList,
                pageParam: {
                    pageSize: 5,
                    currentPage: 1
                }
            }
            findRepositoryUserList(repositoryallIdList[0])
        }
        setRepositoryValue(value)
        findUnRelationProjectDocumentList(params).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    const searchUnselectUser = (value) => {

    }

    const changePage = (page) => {
        if (page < 1 || page > totalPage){
            return;
        }
        setUnRelationWorkCondition({
            pageParam:{
                pageSize:10,
                currentPage: page
            }
        })
        findUnRelationProjectDocumentList().then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    const columns = [
        {
            title: "标题",
            dataIndex: "documentName",
            key: "title",
            width: "35%"
        },
        {
            title: "知识库",
            dataIndex: "kanassRepositoryName",
            key: "workStatus",
            width: "20%"
        },
        {
            title: "作者",
            dataIndex: "userName",
            key: "assigner",
            width: "10%"
        },
        {
            title: '操作',
            width: "10%",
            key: 'action',
            render: (text, record) => (
                <div style={{ display: "flex", gap: "15px" }}>
                    <svg className="svg-icon projectSet-action-icon" aria-hidden="true" onClick={() => addWorkItemDocument(record)}>
                        <use xlinkHref="#icon-add2"></use>
                    </svg>
                </div>
            ),
        }
    ];

    return(
        <Modal
            visible={showAddModal}
            width={730}
            className="projectDocument-addmodel"
            destroyOnClose={true}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText="取消"
            okText="确定"
            title={`关联文档`}
            footer={null}
            closable={true}
            maskClosable={false}
        >
            <div className={"projectDocument-add"} ref={documentAdd}>
                <div className="projectDocument-add-search">
                    <InputSearch style={{ minWidth: "100px", maxWidth: "300px", flex: 1 }} onChange={(value) => searchSelectWorkRepository(value)} placeholder={"搜索文档"} />
                    <SelectSimple
                        name="repository"
                        onChange={(value) => searchUnselectWorkRepository(value)}
                        title={"知识库"}
                        suffixIcon = {true}
                        value = {repositoryValue}
                    >
                        {
                            repositoryallList.map(item => {
                                return <SelectItem
                                    value={item.id}
                                    label={item.kanassRepositoryName}
                                    key={item.id}
                                    imgUrl={"repository1.png"}
                                />
                            })
                        }
                    </SelectSimple>
                    {
                        userList && userList.length > 0 && <SelectSimple name="user"
                                                                         onChange={(value) => searchUnselectUser(value)}
                                                                         title={"文档作者"}
                                                                         suffixIcon = {true}
                        >
                            {
                                userList.map(item => {
                                    return <SelectItem
                                        value={item.user?.id}
                                        label={item.user.nickname}
                                        key={item.user?.id}
                                    />
                                })
                            }
                        </SelectSimple>
                    }

                </div>
                <div className="projectDocument-add-model">
                    <Table
                        columns={columns}
                        dataSource={documentList}
                        rowKey={record => record.id}
                        okText="确定"
                        cancelText="取消"
                        pagination={false}
                        scroll={{x: "100%"}}
                    />
                    <div className="projectDocument-add-page">
                        <div className="projectDocument-add-page-total">
                            共{unRelationTotal}条
                        </div>
                        <div className="projectDocument-add-bottom" >
                            <div className="page-button" onClick={() => changePage(currentPage - 1)}>
                                <LeftOutlined className={`${currentPage === 1 ? "page-disable" : ""}`} />
                            </div>

                            <span>
                                {currentPage}
                            </span>
                            <span>
                                &nbsp; / &nbsp;
                            </span>
                            <span>
                                {totalPage}
                            </span>
                            <div className="page-button" onClick={() => changePage(currentPage + 1)}>
                                <RightOutlined className={`${currentPage === totalPage ? "page-disable" : ""}`} />
                            </div>

                        </div>
                        {/*<div className="projectDocument-add-page-ref" onClick={() => refresh()} >*/}
                        {/*    <svg className="svg-icon" aria-hidden="true">*/}
                        {/*        <use xlinkHref="#icon-refresh"></use>*/}
                        {/*    </svg>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default withRouter(observer(ProjectDocumentAddModel));