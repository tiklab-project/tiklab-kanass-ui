/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-09-27 09:41:12
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-10-09 15:25:16
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Empty, Table } from 'antd';
import { observer, inject, Provider } from "mobx-react";
import "./WorkTestCaseList.scss"
import WorkTestCaseAddmodal from "./WorkTestCaseAdd"
import { applyJump } from "tiklab-core-ui";
import WorkTestStore from "../store/WorkTestStore";
import Button from "../../common/button/Button"
import DeleteModal from "../../common/deleteModal/deleteModal";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
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
        console.log(id)
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
                <div className="testcase-title">
                    <svg className="menu-icon" aria-hidden="true">
                        <use xlinkHref="#icon-testcase"></use>
                    </svg>
                    <span onClick={() => goCaseDetail(record)} className={`${record.exist ? "span-botton" : ""}`} >{text}</span>

                </div>
            ),
        },
        {
            title: "目录",
            dataIndex: "testCaseName",
            key: "testCaseName",
            width: 150
        },
        {
            title: "仓库",
            dataIndex: ["repository", "name"],
            key: "repository",
            width: 150
        },
        {
            title: "作者",
            dataIndex: "createUser",
            key: "createUser",
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record) => (
                <WorkPrivilegeComponent workId={workId} code="WorkTestDelete">
                    <DeleteModal deleteFunction={delectRepository} id={record.id} getPopupContainer={workTestCase.current} />
                </WorkPrivilegeComponent>
            ),
        }
    ];

    const goCaseDetail = (record) => {
        if (record.exist) {
            switch (record.caseType) {
                case "api-unit":
                    toCaseDetail("apiUnit", record)
                    break;
                case "api-scene":
                    toCaseDetail("apiScene", record)
                    break;
                case "api-perform":
                    toCaseDetail("apiPerform", record)
                    break;
                case "web-scene":
                    toCaseDetail("webScene", record)
                    break;
                case "web-perform":
                    toCaseDetail("webPerform", record)
                    break;
                case "app-scene":
                    toCaseDetail("appScene", record)
                    break;
                case "app-perform":
                    toCaseDetail("appPerform", record)
                    break;
                case "function":
                    toCaseDetail("function", record)
                    break;

            }
        } else {
            return;
        }

    }


    const toCaseDetail = (caseType, data) => {
        findSystemUrl({ name: "testhubo" }).then(res => {
            const testUrl = res.webUrl ? res.webUrl : res.systemUrl
            applyJump(`${testUrl}/#/project/${data.repository.id}/testcase/${caseType}/${data.id}`)
        })
    }

    const workTestCase = useRef(null)
    return (<Provider {...store}>
        <div className="work-testcase" ref={workTestCase}>
            <div className="testcase-top">
                <div className="testcase-top-title">共{testCaseList.length}个</div>
                <div className="child-top-botton">
                    <WorkPrivilegeComponent workId={workId} code="WorkTestAdd">
                        <Button onClick={() => { showSelectTestCase(true) }}>
                            添加用例
                        </Button>
                    </WorkPrivilegeComponent>

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
                {
                    testCaseList?.length > 0 ? <Table
                        className="testcase-table"
                        columns={columns}
                        dataSource={testCaseList}
                        rowKey={record => record.id}
                        pagination={false}
                        scroll={{ x: "100%" }}
                    />
                        :
                        <Empty description="暂无关联用例" />
                }

            </div>
        </div>
    </Provider>

    )
}
export default inject(
    "workStore",
)(observer(WorkTestCaseList));