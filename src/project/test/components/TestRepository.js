/*
 * @Descripttion: 版本列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useState } from "react";
import { Input, Table, Space, Row, Col, message } from "antd";
import { observer, inject } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import "./TestRepository.scss";
import TestRepositoryAdd from "./TestRepositoryAdd";
import { withRouter } from "react-router";
const TestRepository = (props) => {
    const { testRepositoryStore } = props;
    const { deleteProjectTestRepositoryByCondition, findProjectTestRepositoryList } = testRepositoryStore;

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

    const goWikiDetail = (data) => {
        const formData = new FormData();
        formData.append("id", "a7318913")
        
        findSystemUrl(formData).then(res=> {
            const kanassUrl = res.webUrl ? res.webUrl : res.systemUrl
            window.open(`${kanassUrl}/#/index/repositorydetail/${data.wikiRepository.id}/doc/${data.id}`)
        })
    }
    // 列表的列
    const columns = [
        {
            title: "仓库名称",
            dataIndex: "testRepositoryName",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title">
                {
                    record.iconUrl ?
                        <img
                            src={(record.iconUrl)}
                            alt=""
                            className="img-icon"
                        />
                        :
                        <img
                            src={('images/repository1.png')}
                            alt=""
                            className="img-icon"
                        />
                }
                <span className="repository-name">{text}</span>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: "userName",
            key: "master",
            align: "left",
            width: "20%",
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <Space size="small">
                    <span className="repository-delete" onClick={() => delteRepository(record.id)}>删除</span>
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

    return (
        <div className="test-repository">
            <Row >
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="test-repository-list">

                        <Breadcumb
                            firstText="用例库"
                        >
                            <div>
                                <Button type="primary" onClick={() => showTestRepository()}>
                                    添加测试用例仓库
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

    );
};

export default withRouter(inject("testRepositoryStore")(observer(TestRepository)));
