/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-27 09:41:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-09 15:25:16
 */
import React, { useEffect, useRef, useState } from "react";
import { Table } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkDocumentList.scss"
import WorkDocumentAddmodal from "./WorkDocumentAdd"
import { applyJump } from "thoughtware-core-ui";
import WorkWikiStore from "../store/WorkWikiStore";
import Button from "../../common/button/Button"
import DeleteModal from "../../common/deleteModal/deleteModal";
const WorkDocumentList = (props) => {
    const store = {
        workWikiStore: WorkWikiStore
    }
    const { workStore, projectId } = props;
    const { findDocumentPageByWorkItemId, deleteWorkItemDocument, findSystemUrl } = WorkWikiStore;
    const { workId, getSelectUserList } = workStore;
    const [workDocumentList, setWorkDocumentList] = useState([])
    const [selectIds, setSelectIds] = useState()
    const [selectDocument, showSelectDocument] = useState(false);
    useEffect(() => {
        findDocumentPageByWorkItemId({ workItemId: workId }).then((data) => {
            setWorkDocumentList([...data])
        })
        return;
    }, [workId])

    // 
    const delectRepository = (id) => {
        deleteWorkItemDocument({ workItemId: workId, documentId: id }).then((data) => {
            if (data.code === 0) {
                findDocumentPageByWorkItemId({ workItemId: workId }).then((data) => {
                    setWorkDocumentList([...data])
                })
            }
        })
    }
    const goWikiDetail = (data) => {
        if (data.exist) {
            findSystemUrl({ name: "sward" }).then(res => {
                const kanassUrl = res.webUrl ? res.webUrl : res.systemUrl;
                applyJump(`${kanassUrl}/#/index/repositorydetail/${data.kanassRepositoryId}/doc/${data.id}`);
            })
        } else {
            return
        }

    }
    const columns = [
        {
            title: "标题",
            dataIndex: "documentName",
            key: "name",
            width: 150,
            render: (text, record) => (
                <div className="document-title">

                {
                    record.documentType !== "markdown" && <svg className="menu-icon" aria-hidden="true">
                        <use xlinkHref="#icon-file"></use>
                    </svg>
                }
                {
                    record.documentType === "markdown" && <svg className="menu-icon" aria-hidden="true">
                        <use xlinkHref="#icon-minmap"></use>
                    </svg>
                }
                <span onClick={() => goWikiDetail(record)} className={`${record.exist ? "span-botton" : ""}`} >{text}</span>
            </div>
                
                
            ),
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
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "15%",
            render: (text, record) => (
                // <span onClick={() => delectRepository(record.id)} className="span-botton" >删除</span>
                <DeleteModal deleteFunction = {delectRepository} id = {record.id} getPopupContainer = {workDocument.current}/>
            ),
        }
    ];

    const workDocument = useRef(null)
    return (<Provider {...store}>
        <div className="work-repository" ref = {workDocument}>
            <div className="repository-top">
                <div className="repository-top-title">关联文档({workDocumentList.length})</div>
                <div className="child-top-botton">
                    <Button onClick={() => { showSelectDocument(true) }}>
                        添加文档
                    </Button>
                </div>


            </div>
            <div className="document-content">

                {
                    selectDocument && <WorkDocumentAddmodal
                        {...props}
                        name="添加文档"
                        selectIds={selectIds}
                        setWorkDocumentList={setWorkDocumentList}
                        projectId={projectId}
                        showSelectDocument={showSelectDocument}
                        selectDocument={selectDocument}
                        getSelectUserList = {getSelectUserList}
                    />
                }
                <Table
                    className="repository-table"
                    columns={columns}
                    dataSource={workDocumentList}
                    rowKey={record => record.id}
                    pagination={false}
                />
            </div>

        </div>
    </Provider>

    )
}
export default inject("workStore")(observer(WorkDocumentList));