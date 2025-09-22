/*
 * @Descripttion: 事项详情页面的文档选择
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:11:14
 */
import React, { useEffect, useState, useRef } from "react";
import {Modal, Table, message, Empty, Avatar} from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkDocumentAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
import {LeftOutlined, RightOutlined, UserOutlined} from "@ant-design/icons";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import WorkDeleteSelectModal from "./WorkDeleteSelectModal";
import UserIcon from "../../common/UserIcon/UserIcon";
const WorkDocumentAddmodal = (props) => {
    const { workWikiStore, workStore, setWorkDocumentList, projectId, showSelectDocument, selectDocument } = props;
    const { workId } = workStore;

    const { findDocumentPageByWorkItemId, createWorkItemDocument,
        findProjectWikiRepositoryList, findUnRelationWorkDocumentList,
        findRepositoryUserList, userList, unRelationTotal, setUnRelationWorkCondition, currentRecord, setCurrentRecord,cleanCurrentRecord
    } = workWikiStore;

    const [selectedRow, setSelectedRow] = useState([]);
    const [documentList, setDocumentList] = useState([])
    const [repositoryallList, setRepositoryaList] = useState([]);
    const [repositoryallIdList, setRepositoryallIdList] = useState([]);
    const [repositoryValue, setRepositoryValue] = useState()

    const [currentPage, setCurrentPage] = useState();
    const [totalPage, setTotalPage] = useState();
    const [addModalVisible, setAddModalVisible] = useState(false);

    /**
     * 监听selectDocument的变化，获取文档列表
     */
    useEffect(() => {
        if (selectDocument === true) {
            // 获取项目知识库列表
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
                        findUnRelationWorkDocumentList({
                            workItemId: workId, 
                            repositoryIds: list, 
                            name: "", 
                            repositoryId: null, 
                            projectId: projectId,
                            pageParam:{
                                pageSize:5,
                                currentPage: 1
                            }
                        }).then((data) => {
                            if (data.code === 0) {
                                setDocumentList(data.data.dataList)
                                setCurrentPage(data.data.currentPage)
                                setTotalPage(data.data.totalPage)
                            }
                        })
                    }else {
                        Modal.confirm({
                            title: '提示?',
                            content: "该项目没有关联知识库，是否先去添加知识库",
                            centered: true,
                            okText: "去添加",
                            cancelText: "取消",
                            getContainer: documentAdd ? () => documentAdd.current : null,
                            onOk() { props.history.push({
                                pathname: `/project/${projectId}/wiki`,
                                state: { activeKey: "repository" }
                            }) }
                        });
                    }
                }
            })
        }
        
        return;
    }, [selectDocument])

    const columns = [
        {
            title: "标题",
            dataIndex: "documentName",
            key: "title",
            width: "40%",
            ellipsis: true,
        },
        {
            title: "知识库",
            dataIndex: "kanassRepositoryName",
            key: "workStatus",
            width: "20%",
            ellipsis: true,
        },
        {
            title: "作者",
            dataIndex: "userName",
            key: "assigner",
            width: "10%"
        },
        // {
        //     title: '操作',
        //     width: "10%",
        //     key: 'action',
        //     render: (text, record) => (
        //         <div style={{ display: "flex", gap: "15px" }}>
        //             <svg className="svg-icon projectSet-action-icon" aria-hidden="true" onClick={() => addWorkItemDocument(record)}>
        //                 <use xlinkHref="#icon-add2"></use>
        //             </svg>
        //         </div>
        //     ),
        // }
    ];
    const showAddModal = (record) => {
        setCurrentRecord(record)
        // setAddModalVisible(true);
        addWorkItemDocument(record);
        cleanCurrentRecord();
    }

    const addWorkItemDocument = (record) => {
        const param = [{
            documentId: record.id,
            workItem: {id: workId},
            repositoryId: record.kanassRepositoryId,
            projectId: projectId
        }]
        createWorkItemDocument(param).then((data) => {
            if (data.code === 0) {
                findDocumentPageByWorkItemId({ workItemId: workId }).then((data) => {
                    setWorkDocumentList([...data])
                })
                showSelectDocument(false)
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
        findUnRelationWorkDocumentList(params).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    /**
     * 根据文档作者筛选数据，后端限制，没实现
     */
    const searchUnselectUser = () => {

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
        findUnRelationWorkDocumentList(categoryQuery).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }

        })
    }

    /**
     * 选择文档
     */
    const selectWorkRepository = (selected, selectedRows) => {
        setSelectedRow(selectedRows)
    }
    
    /**
     * 创建文档与事项的关联
     */
    const submitWorkDocumentList = () => {
        const workItemDocument = [];
        if (selectedRow.length !== 0) {
            for (let i = 0; i < selectedRow.length; i++) {
                // createWorkItemDocument({id: selectedRowKeys[i],workitemId:workId })
                workItemDocument.push({ 
                    documentId: selectedRow[i].id, 
                    workItem: {id: workId}, 
                    repositoryId: selectedRow[i].kanassRepositoryId,
                    projectId: projectId
                })
            }
            createWorkItemDocument(workItemDocument).then((data) => {
                if (data.code === 0) {
                    findDocumentPageByWorkItemId({ workItemId: workId }).then((data) => {
                        setWorkDocumentList([...data])
                    })
                    showSelectDocument(false)
                }
            })
        } else {
            info()
        }
    }
    //没有选择用户提升
    const info = () => {
        message.info('请选择文档');
    };

    const changePage = (page) => {
        if (page < 1 || page > totalPage){
            return;
        }
        setUnRelationWorkCondition({
            pageParam:{
                pageSize:5,
                currentPage: page
            }
        })
        findUnRelationWorkDocumentList().then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
                setCurrentPage(data.data.currentPage)
                setTotalPage(data.data.totalPage)
            }
        })
    }

    const documentAdd = useRef()
    return (
        <>
            <div className="document-add" ref={documentAdd}>

                <div className="document-add-modal-top">
                    <div className="document-add-table-title">选择事项</div>
                    <div className="document-add-submit">
                        <span className="close-icon" onClick={() => showSelectDocument(false)}>
                               ×
                        </span>
                    </div>
                </div>

                <div className="document-add-search">
                    <InputSearch style={{ minWidth: "100px", flex: 1 }} onChange={(value) => searchSelectWorkRepository(value)} placeholder={"搜索文档"} />
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
                                    icon={"repository-bluecolor"}
                                />
                            })
                        }
                    </SelectSimple>

                </div>
                <div className="document-add-model">
                    {
                        documentList.length > 0 && documentList.map((item, index) => {
                            return <div className="document-add-item" onClick={() => addWorkItemDocument(item)} key={item.id}>
                                <div className="document-icon">
                                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                        <svg className="img-icon-right" aria-hidden="true">
                                            <use xlinkHref="#icon-file"></use>
                                        </svg>
                                        <div className="work-item-title">{item.documentName} </div>
                                    </div>
                                </div>
                                <div className="work-item-right">
                                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                        <svg className="img-icon-right" aria-hidden="true">
                                            <use xlinkHref="#icon-repository-bluecolor"></use>
                                        </svg>
                                        <div className="work-item-title">{item.kanassRepositoryName} </div>
                                    </div>
                                </div>
                                <div className="work-item-right">
                                    <UserIcon name={item.userName}/>
                                    <div className="work-item-icon">
                                        {item.userName}
                                    </div>
                                </div>
                            </div>
                        })
                    }
                    {/*<Table*/}
                    {/*    columns={columns}*/}
                    {/*    dataSource={documentList}*/}
                    {/*    rowKey={record => record.id}*/}
                    {/*    // rowSelection={{*/}
                    {/*    //     selectedRow,*/}
                    {/*    //     onChange: selectWorkRepository,*/}
                    {/*    //     getCheckboxProps: (record) => ({*/}
                    {/*    //         disabled: record.rele === true*/}
                    {/*    //     })*/}
                    {/*    // }}*/}
                    {/*    onRow={(record) =>({*/}
                    {/*        onClick: () => addWorkItemDocument(record)*/}
                    {/*    })}*/}
                    {/*    okText="确定"*/}
                    {/*    cancelText="取消"*/}
                    {/*    pagination={false}*/}
                    {/*    scroll={{x: "100%"}}*/}
                    {/*    locale={{*/}
                    {/*        emptyText: <Empty*/}
                    {/*            imageStyle={{height: 100}}*/}
                    {/*            description={<span>暂无数据</span>}*/}
                    {/*        />*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <div className="document-add-page">
                        <div className="document-add-page-total">
                            共{unRelationTotal}条
                        </div>
                        <div className="document-add-bottom" >
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
                        {/*<div className="document-add-page-ref" onClick={() => refresh()} >*/}
                        {/*    <svg className="svg-icon" aria-hidden="true">*/}
                        {/*        <use xlinkHref="#icon-refresh"></use>*/}
                        {/*    </svg>*/}
                        {/*</div>*/}
                    </div>
                </div>

            </div>

            <Modal
                title={"是否添加文档"}
                visible={addModalVisible}
                onOk={(e) => {
                    e.nativeEvent.stopImmediatePropagation()
                    addWorkItemDocument()
                }}
                onCancel={() => {
                    cleanCurrentRecord();
                    setAddModalVisible(false);
                }}
            />
        </>
    );
};

export default inject('workStore', 'workWikiStore')(observer(WorkDocumentAddmodal));
