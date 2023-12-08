/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-27 09:41:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-09 15:25:16
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Table } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkTestCaseList.scss"
import WorkTestCaseAddmodal from "./WorkTestCaseAdd"
import { applyJump } from "thoughtware-core-ui";
import WorkTestStore from "../store/WorkTestStore";
import Button from "../../common/button/Button"
const WorkTestCaseList = (props) => {
    const store = {
        workTestStore: WorkTestStore
    }
    const { workStore, projectId } = props;
    const { findTestCasePageByWorkItemId, deleteWorkTestCaseRele, findSystemUrl } = WorkTestStore;
    const { workId, getSelectUserList } = workStore;
    const [testCaseList, setWorkTestCaseList] = useState([])
    const [selectIds, setSelectIds] = useState()
    const [selectTestCase, showSelectTestCase] = useState(false);
    useEffect(() => {
        findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
            setWorkTestCaseList([...data])
        })
        return;
    }, [workId])

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

    const columns = [
        {
            title: "标题",
            dataIndex: "testCaseName",
            key: "name",
            width: 150,
            render: (text, record) => (
                <span onClick={() => goCaseDetail(record)} className={`${record.exist ? "span-botton" : ""}`} >{text}</span>
            ),
        },
        {
            title: "用例库",
            dataIndex: "testCaseName",
            key: "testCaseName",
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

    const goCaseDetail = (record) => {
        if (record.exist) {
            switch (record.caseType) {
                case "api-unit":
                    toCaseDetail("apiUnitId", record)
                    break;
                case "api-scene":
                    toCaseDetail("apiSceneId", record)
                    break;
                case "api-perform":
                    toCaseDetail("apiPerfId", record)
                    break;
                case "web-scene":
                    toCaseDetail("webSceneId", record)
                    break;
                case "web-perform":
                    toCaseDetail("webPerfId", record)
                    break;
                case "app-scene":
                    toCaseDetail("appSceneId", record)
                    break;
                case "app-perform":
                    toCaseDetail("appPerfId", record)
                    break;
                case "function":
                    toCaseDetail("functionId", record)
                    break;

            }
        } else {
            return;
        }

    }


    const toCaseDetail = (caseType, data) => {
        findSystemUrl({ name: "teston" }).then(res => {
            const testUrl = res.webUrl ? res.webUrl : res.systemUrl
            applyJump(`${testUrl}/#/repository/${data.caseType}/${data.id}`)
        })
    }
    return (<Provider {...store}>
        <div className="work-repository">
            <div className="repository-top">
                <div className="repository-top-title">关联用例({testCaseList.length})</div>
                <div className="child-top-botton">
                    <Button onClick={() => { showSelectTestCase(true) }}>
                        添加文档
                    </Button>
                </div>

            </div>
            <div className="testcase-content">

                {
                    selectTestCase && <WorkTestCaseAddmodal
                        {...props}
                        name="添加测试用例"
                        selectIds={selectIds}
                        setWorkTestCaseList={setWorkTestCaseList}
                        projectId={projectId}
                        showSelectTestCase={showSelectTestCase}
                        selectTestCase={selectTestCase}
                        getSelectUserList={getSelectUserList}
                    />
                }
                <Table
                    className="repository-table"
                    columns={columns}
                    dataSource={testCaseList}
                    rowKey={record => record.id}
                    pagination={false}
                />
            </div>
        </div>
    </Provider>

    )
}
export default inject(
    "workStore",
)(observer(WorkTestCaseList));