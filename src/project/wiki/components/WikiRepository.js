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
import { observer, Provider } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import "./wikiRepository.scss";
import WikiRepositoryAdd from "./WikiRepositoryAdd";
import { withRouter } from "react-router";
import {applyJump} from "tiklab-core-ui";
import WikiRepositoryStore from "../store/WikiRepositoryStore";
const WikiRepository = (props) => {
    const store = {
        wikiRepositoryStore: WikiRepositoryStore
    }
    const { deleteProjectWikiRepositoryByCondition, findProjectWikiRepositoryList, findSystemUrl } = WikiRepositoryStore;

    const projectId = props.match.params.id;
    const [wikiAddvisible, setWikiAddvisible] = useState()
    const [projectWikiList, setProjectWikiList] = useState()

    const delteRepository = (id) => {
        deleteProjectWikiRepositoryByCondition({repositoryId:id, projectId: projectId }).then(data => {
            if(data.code === 0){
                message.info('删除成功');
                findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
                    if(res.code === 0){
                       setProjectWikiList(res.data) 
                    }
                })
            }
        })
    }

    const goWikiDetail = (data) => {
        
        findSystemUrl({name: "kanass"}).then(res=> {
            const kanassUrl = res.webUrl ? res.webUrl : res.systemUrl
            // window.open(`${kanassUrl}/#/index/repositorydetail/${data.id}/survey`)
            applyJump(`${kanassUrl}/#/index/repositorydetail/${data.id}/survey`)
        })
    }
    // 列表的列
    const columns = [
        {
            title: "知识库名称",
            dataIndex: "kanassRepositoryName",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title">
                {
                    record.iconUrl ?
                        <img
                            src={('/images/' + record.iconUrl)}
                            alt=""
                            className="img-icon-right"
                        />
                        :
                        <img
                            src={('images/repository1.png')}
                            alt=""
                            className="img-icon-right"
                        />
                }
                <span className="repository-name" onClick={() => goWikiDetail(record)} >{text}</span>
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
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
            align: "left",
            width: "20%"
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <Space size="small">
                    <span className="repository-delete" onClick={() => delteRepository(record.id)}>删除</span>
              </Space>
            ),
        }
    ];


    // 初始化
    useEffect(() => {
        findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
            if(res.code === 0){
               setProjectWikiList(res.data) 
            }
            
        })
        return;
    }, []);


    const showWikiRepository = () => {
        setWikiAddvisible(true)
    }

    return (<Provider {...store}>
        <div className="wiki-repository">
            <Row >
                <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <div className="wiki-repository-list">

                        <Breadcumb
                            firstText="知识库"
                        >
                            <div>
                                <Button type="primary" onClick={() => showWikiRepository()}>
                                    添加知识库
                                </Button>
                            </div>
                        </Breadcumb>

                        <Table
                            columns={columns}
                            dataSource={projectWikiList}
                            rowKey={(record) => record.id}
                            pagination={false}
                            onChange={false}
                        />
                        <WikiRepositoryAdd 
                            projectId = {projectId} 
                            wikiAddvisible={wikiAddvisible} 
                            setWikiAddvisible={setWikiAddvisible} 
                            setProjectWikiList = {setProjectWikiList}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    </Provider>
        

    );
};

export default withRouter(observer(WikiRepository));
