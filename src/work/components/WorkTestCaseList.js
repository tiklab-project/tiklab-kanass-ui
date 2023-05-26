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
    const { workTestStore, workStore, projectId } = props;
    const { findTestCasePageByWorkItemId, deleteWorkTestCaseRele, findSystemUrl } = workTestStore;
    const { workId } = workStore;
    const [testCaseList, setWorkTestCaseList] = useState([])
    const [selectIds, setSelectIds] = useState()
    useEffect(() => {
        findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
            setWorkTestCaseList([...data])
        })
        return;
    }, [workId])

    const searchSelectWorkRepository = (value) => {
        // getSelectWorkRelationList({title: value})
        findTestCasePageByWorkItemId({ workItemId: workId, name: value }).then((data) => {
            setWorkTestCaseList([...data])
        })
    }

    // 
    const delectRepository = (id) => {
        deleteWorkTestCaseRele({ workItemId: workId, testCaseId: id }).then((data) => {
            if (data.code === 0) {
                findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
                    setWorkTestCaseList([...data])
                })
            }
        })
    }
    const goWikiDetail = (data) => {
        findSystemUrl({name: "teston"}).then(res=> {
            const kanassUrl = res.webUrl ? res.webUrl : res.systemUrl
            window.open(`${kanassUrl}/#/index/repositorydetail/${data.repository.id}/doc/${data.id}`)
        })
    }
    const columns = [
        {
            title: "标题",
            dataIndex: "testCaseName",
            key: "name",
            width: 150,
            render: (text, record) => (
                <span onClick={() => goWikiDetail(record)} className="span-botton" >{text}</span>
            ),
        },
        {
            title: "目录",
            dataIndex: "testCategoryName",
            key: "workStatus",
            width: 150
        },
        {
            title: "作者",
            dataIndex: "createUser",
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
                <div className="repository-top-title">关联用例({testCaseList.length})</div>
                <WorkTestCaseAddmodal
                    {...props}
                    name="添加测试用例"
                    selectIds={selectIds}
                    setWorkTestCaseList={setWorkTestCaseList}
                    projectId = {projectId}
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
    "workTestStore"
)(observer(WorkTestCaseList));