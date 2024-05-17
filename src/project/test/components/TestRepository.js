/*
 * @Descripttion: 版本列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useRef, useState } from "react";
import { Table, Space, Row, Col, message } from "antd";
import { Provider, observer } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import "./TestRepository.scss";
import TestRepositoryAdd from "./TestRepositoryAdd";
import { withRouter } from "react-router";
import {applyJump} from "thoughtware-core-ui";
import TestRepositoryStore from "../store/TestRepositoryStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
const TestRepository = (props) => {
    const store = {
        testRepositoryStore: TestRepositoryStore
    }
    const { deleteProjectTestRepositoryByCondition, findProjectTestRepositoryList, findSystemUrl } = TestRepositoryStore;

    const projectId = props.match.params.id;
    const [testAddvisible, setTestAddvisible] = useState()
    const [projectTestList, setProjectTestList] = useState()

    const delteRepository = (id) => {
        deleteProjectTestRepositoryByCondition({repositoryId:id, projectId: projectId }).then(data => {
            if(data.code === 0){
                message.info('删除成功');
                findProjectTestRepositoryList({ projectId: projectId }).then(res => {
                    if(res.code === 0){
                       setProjectTestList(res.data) 
                    }
                })
            }
        })
    }

    const goRepository = (data) => {
        findSystemUrl({name: "teston"}).then(res=> {
            const testUrl = res.webUrl ? res.webUrl : res.systemUrl
            // window.open(`${testUrl}/#/repository/detail/${data.id}`)
            applyJump(`${testUrl}/#/repository/detail/${data.id}`)
        })
    }
    // 列表的列
    const columns = [
        {
            title: "仓库名称",
            dataIndex: "testRepositoryName",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title" onClick={() => goRepository(record)}>
                {
                    record.iconUrl ?
                        <img
                            src={(record.iconUrl)}
                            alt=""
                            className="icon-32"
                        />
                        :
                        <img
                            src={('images/repository1.png')}
                            alt=""
                            className="icon-32"
                        />
                }
                <span className="repository-name">{text}</span>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: "user",
            key: "user",
            align: "left",
            width: "20%",
        },
        {
            title: '操作',
            key: 'action',
            width: "10%",
            render: (text, record) => (
              <Space size="small">
                    {/* <span className="repository-delete" onClick={() => delteRepository(record.id)}>删除</span> */}
                    <DeleteModal deleteFunction = {delteRepository} id = {record.id} getPopupContainer = {testRepository.current}/>
              </Space>
            ),
          },
    ];


    // 初始化
    useEffect(() => {
        findProjectTestRepositoryList({ projectId: projectId }).then(res => {
            if(res.code === 0){
               setProjectTestList(res.data) 
            }
            
        })
        return;
    }, []);


    const showTestRepository = () => {
        setTestAddvisible(true)
    }
    const testRepository = useRef(null)
    return (<Provider {...store}>
          <div className="test-repository" ref = {testRepository}>
            <Row >
                <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                    <div className="test-repository-list">

                        <Breadcumb
                            firstText="测试用例库"
                        >
                            <div>
                                <Button type="primary" onClick={() => showTestRepository()}>
                                    添加测试用例库
                                </Button>
                            </div>
                        </Breadcumb>

                        <Table
                            columns={columns}
                            dataSource={projectTestList}
                            rowKey={(record) => record.id}
                            pagination={false}
                            onChange={false}
                        />
                        <TestRepositoryAdd 
                            projectId = {projectId} 
                            testAddvisible={testAddvisible} 
                            setTestAddvisible={setTestAddvisible} 
                            setProjectTestList = {setProjectTestList}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    </Provider>
      

    );
};

export default withRouter(observer(TestRepository));
