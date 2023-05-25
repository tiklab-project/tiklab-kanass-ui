/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-27 09:41:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-09 15:25:16
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Button, Input, Row, Table, Col } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkDocument.scss"
import WorkDocumentAddmodal from "./WorkDocumentAdd"

const { Search } = Input;

const WorkDocumentList = (props) => {
    const { workWikiStore, workStore } = props;
    const { findDocumentPageByWorkItemId, deleteWorkItemDocument, findSystemUrl } = workWikiStore;
    const { workId } = workStore;
    const [workDoucumentList, setWorkDoucumentList] = useState([])
    const [selectIds, setSelectIds] = useState()
    useEffect(() => {
        findDocumentPageByWorkItemId({ workItemId: workId }).then((data) => {
            setWorkDoucumentList([...data])
        })
        return;
    }, [workId])

    const searchSelectWorkRepository = (value) => {
        // getSelectWorkRelationList({title: value})
        findDocumentPageByWorkItemId({ workItemId: workId, name: value }).then((data) => {
            setWorkDoucumentList([...data])
        })
    }

    // 
    const delectRepository = (id) => {
        deleteWorkItemDocument({ workItemId: workId, documentId: id }).then((data) => {
            if (data.code === 0) {
                findDocumentPageByWorkItemId({ workItemId: workId }).then((data) => {
                    setWorkDoucumentList([...data])
                })
            }
        })
    }
    const goWikiDetail = (data) => {
        const formData = new FormData();
        formData.append("id", "a7318913")
        
        findSystemUrl(formData).then(res=> {
            const kanassUrl = res.data.webUrl
            window.open(`${kanassUrl}/#/index/repositorydetail/${data.kanassRepositoryId}/doc/${data.id}`)
        })
    }
    const columns = [
        {
            title: "标题",
            dataIndex: "documentName",
            key: "name",
            width: 150,
            render: (text, record) => (
                <span onClick={() => goWikiDetail(record)} className="span-botton" >{text}</span>
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
                <span onClick={() => delectRepository(record.id)} className="span-botton" >删除</span>
            ),
        }
    ];


    return (
        <div className="work-repository">
            <div className="repository-top">
                <div className="repository-top-title">关联文档({workDoucumentList.length})</div>
                <WorkDocumentAddmodal
                    {...props}
                    name="添加文档"
                    selectIds={selectIds}
                    setWorkDoucumentList={setWorkDoucumentList}
                />
            </div>
            <Table
                className="repository-table"
                columns={columns}
                dataSource={workDoucumentList}
                rowKey={record => record.id}
                pagination={false}
            />
        </div>
    )
}
export default inject(
    "workStore",
    "workWikiStore"
)(observer(WorkDocumentList));