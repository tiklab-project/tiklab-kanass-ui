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
import "./WorkTestCase.scss"
import WorkTestCaseAddmodal from "./WorkTestCaseAdd"

const { Search } = Input;

const WorkTestCaseList = (props) => {
    const { workWikiStore, workStore } = props;
    const { findTestCasePageByWorkItemId, deleteWorkItemTestCase, findSystemUrl } = workWikiStore;
    const { workId } = workStore;
    const [testCaseList, setTestCaseList] = useState([])
    const [selectIds, setSelectIds] = useState()
    useEffect(() => {
        findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
            setTestCaseList([...data])
        })
        return;
    }, [workId])

    const searchSelectWorkRepository = (value) => {
        // getSelectWorkRelationList({title: value})
        findTestCasePageByWorkItemId({ workItemId: workId, name: value }).then((data) => {
            setTestCaseList([...data])
        })
    }

    // 
    const delectRepository = (id) => {
        deleteWorkItemTestCase({ workItemId: workId, testCaseId: id }).then((data) => {
            if (data.code === 0) {
                findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
                    setTestCaseList([...data])
                })
            }
        })
    }
    const goWikiDetail = (data) => {
        findSystemUrl().then(res=> {
            const kanassUrl = res.data.kanassUrl
            window.open(`${kanassUrl}/#/index/repositorydetail/${data.repository.id}/doc/${data.id}`)
        })
    }
    const columns = [
        {
            title: "标题",
            dataIndex: "name",
            key: "name",
            width: 150,
            render: (text, record) => (
                <span onClick={() => goWikiDetail(record)} className="span-botton" >{text}</span>
            ),
        },
        {
            title: "知识库",
            dataIndex: ["repository", "name"],
            key: "workStatus",
            width: 150
        },
        {
            title: "作者",
            dataIndex: ["master", "name"],
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
                <div className="repository-top-title">关联文档({testCaseList.length})</div>
                <WorkTestCaseAddmodal
                    {...props}
                    name="添加文档"
                    selectIds={selectIds}
                    setTestCaseList={setTestCaseList}
                />
            </div>
            <Table
                className="repository-table"
                columns={columns}
                dataSource={testCaseList}
                rowKey={record => record.id}
                pagination={false}
            />
        </div>
    )
}
export default inject(
    "workStore",
    "workWikiStore"
)(observer(WorkTestCaseList));