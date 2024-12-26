/*
 * @Descripttion: 事项详情页面的文档选择
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:11:14
 */
import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, message } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkDocumentAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
const WorkDocumentAddmodal = (props) => {
    const { workWikiStore, workStore, setWorkDocumentList, projectId, showSelectDocument, selectDocument } = props;
    const { workId } = workStore;

    const { findDocumentPageByWorkItemId, createWorkItemDocument,
        findProjectWikiRepositoryList, findUnRelationWorkDocumentList,
        findRepositoryUserList, userList } = workWikiStore;

    const [selectedRow, setSelectedRow] = useState([]);
    const [documentList, setDocumentList] = useState([])
    const [repositoryallList, setRepositoryaList] = useState([]);
    const [repositoryallIdList, setRepositoryallIdList] = useState([]);
    const [repositoryValue, setRepositoryValue] = useState()

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
                            projectId: projectId
                        }).then((data) => {
                            if (data.code === 0) {
                                setDocumentList(data.data.dataList)
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
            width: 150
        },
        {
            title: "知识库",
            dataIndex: "kanassRepositoryName",
            key: "workStatus",
            width: 150
        },
        {
            title: "作者",
            dataIndex: "userName",
            key: "assigner",
            width: 150
        }
    ];


    /**
     * 根据知识库筛选数据
     */
    const searchUnselectWorkRepository = (value) => {
        let params;
        if(value){
            params = {
                repositoryIds: [value?.value],
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }
            findRepositoryUserList(value?.value)
        }else {
            params = {
                repositoryIds: repositoryallIdList,
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }
            findRepositoryUserList(repositoryallIdList[0])
        }
        setRepositoryValue(value)
        findUnRelationWorkDocumentList(params).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
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
                pageSize: 10,
                currentPage: 1
            }
        }
        findUnRelationWorkDocumentList(categoryQuery).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
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
    const documentAdd = useRef()
    return (
        <>
            <div className="document-add" ref={documentAdd}>

                <div className="document-add-search">
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


                    <div className="document-add-submit" style={{width: "66px"}}>
                        <span onClick={() => submitWorkDocumentList()}>
                            确定
                        </span>
                        <span style={{ marginLeft: "10px" }} onClick={() => showSelectDocument(false)}>
                            取消
                        </span>
                    </div>
                </div>
                <div className="document-add-model">
                    <Table
                        columns={columns}
                        dataSource={documentList}
                        rowKey={record => record.id}
                        rowSelection={{
                            selectedRow,
                            onChange: selectWorkRepository,
                            getCheckboxProps: (record) => ({
                                disabled: record.rele === true
                            })
                        }}
                        okText="确定"
                        cancelText="取消"
                        pagination={false}
                        scroll={{x: "100%"}}
                    />
                </div>


            </div>


        </>
    );
};

export default inject('workStore', 'workWikiStore')(observer(WorkDocumentAddmodal));
