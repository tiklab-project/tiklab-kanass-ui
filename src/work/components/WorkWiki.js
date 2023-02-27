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
import "./WorkWiki.scss"
import WorkWikiAddmodal from "./WorkWikiAdd"

const { Search } = Input;

const WorkWiki = (props) => {
    const { workWikiStore, workStore } = props;
    const { findDocumentPageByItemId, deleteWorkItemDocument } = workWikiStore;
    const { workId } = workStore;
    const [workDoucumentList, setWorkDoucumentList] = useState([])
    const [selectIds, setSelectIds] = useState()
    useEffect(() => {
        findDocumentPageByItemId({ workItemId: workId }).then((data) => {
            setWorkDoucumentList([...data])
        })
        return;
    }, [workId])

    const searchSelectWorkWiki = (value) => {
        // getSelectWorkRelationList({title: value})
        findDocumentPageByItemId({ workItemId: workId, name: value }).then((data) => {
            setWorkDoucumentList([...data])
        })
    }

    // 
    const delectWiki = (id) => {
        deleteWorkItemDocument({ workItemId: workId, documentId: id }).then((data) => {
            if (data.code === 0) {
                findDocumentPageByItemId({ workItemId: workId }).then((data) => {
                    setWorkDoucumentList([...data])
                })
            }
        })
    }
    const columns = [
        {
            title: "标题",
            dataIndex: "name",
            key: "name",
            width: 150
        },
        {
            title: "知识库",
            dataIndex: ["repository", "name"],
            key: "workStatus",
            width: 150
        },
        {
            title: "作者",
            dataIndex: ["repository", "master", "name"],
            key: "assigner",
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "15%",
            render: (text, record) => (
                <span onClick={() => delectWiki(record.id)} className="span-botton" >删除</span>
            ),
        }
    ];


    return (
        <div className="work-wiki">
            <div className="wiki-top">
                <div className="wiki-top-title">关联文档({workDoucumentList.length})</div>
                <WorkWikiAddmodal
                    {...props}
                    name="添加文档"
                    selectIds={selectIds}
                    setWorkDoucumentList={setWorkDoucumentList}
                />
            </div>
            <Table
                className="wiki-table"
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
)(observer(WorkWiki));