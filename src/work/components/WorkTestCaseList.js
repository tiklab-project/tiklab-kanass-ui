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
import {applyJump} from "tiklab-core-ui";
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

    const goCaseDetail = (record)=>{
        if(record.exist){
            switch (record.caseType) {
                case "api-unit":
                    toCaseDetail("apiUnitId",record)
                    break;
                case "api-scene":
                    toCaseDetail("apiSceneId",record)
                    break;
                case "api-perform":
                    toCaseDetail("apiPerfId",record)
                    break;
                case "web-scene":
                    toCaseDetail("webSceneId",record)
                    break;
                case "web-perform":
                    toCaseDetail("webPerfId",record)
                    break;
                case "app-scene":
                    toCaseDetail("appSceneId",record)
                    break;
                case "app-perform":
                    toCaseDetail("appPerfId",record)
                    break;
                case "function":
                    toCaseDetail("functionId",record)
                    break;
    
            }
        }else {
            return;
        }
        
    }

    //跳转路由
    // const toCaseDetail = (setId,record)=>{
    //     // sessionStorage.setItem(`${setId}`,record.id);
    //     props.history.push(`/repository/${record.caseType}/${record.id}`)
    // }
    const toCaseDetail = (caseType, data) => {
        findSystemUrl({name: "teston"}).then(res=> {
            const testUrl = res.webUrl ? res.webUrl : res.systemUrl
            // window.open(`${testUrl}/#/repository/${data.caseType}/${data.id}`)
            applyJump(`${testUrl}/#/repository/${data.caseType}/${data.id}`)
        })
    }
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