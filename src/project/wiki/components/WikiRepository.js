/*
 * @Descripttion: 版本列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-02 13:28:22
 */
import React, { useEffect, useState } from "react";
import { Input, Table, Space, Row, Col, DatePicker } from "antd";
import { observer, inject } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import "./wikiRepository.scss";
import WikiRepositoryAdd from "./WikiRepositoryAdd";
import { withRouter } from "react-router";
const WikiRepository = (props) => {
    const { wikiRepositoryStore } = props;
    const { findAllRepository } = wikiRepositoryStore;

    const projectId = props.match.params.id;
    const [wikiAddvisible, setWikiAddvisible] = useState()
    const [projectWikiList, setProjectWikiList] = useState()

    // 列表的列
    const columns = [
        {
            title: "知识库名称",
            dataIndex: "name",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title">
                {
                    record.iconUrl ?
                        <img
                            src={('/images/' + record.iconUrl)}
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
            dataIndex: ["master", "name"],
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
        }
    ];


    // 初始化
    useEffect(() => {
        findAllRepository({ projectId: projectId }).then(res => {
            if(res.code === 0){
               setProjectWikiList(res.data) 
            }
            
        })
        return;
    }, []);


    const showWikiRepository = () => {
        setWikiAddvisible(true)
    }

    return (
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
                        {/* <div className="project-version-contant">
                            <div className="table-box">
                               
                            </div>
                        </div> */}
                        <WikiRepositoryAdd projectId = {projectId} wikiAddvisible={wikiAddvisible} setWikiAddvisible={setWikiAddvisible} />
                    </div>
                </Col>
            </Row>
        </div>

    );
};

export default withRouter(inject("wikiRepositoryStore")(observer(WikiRepository)));
