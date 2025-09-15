import React, {useEffect, useState} from "react";
import {Button, Col, Empty, message, Row, Space, Table} from "antd";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import {applyJump} from "tiklab-core-ui";
import WikiRepositoryAdd from "../../wiki/repository/components/WikiRepositoryAdd";
import {observer,Provider} from "mobx-react";
import WikiRepositoryStore from "../../wiki/repository/store/WikiRepositoryStore";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";

const BindSward = (props) => {
    const {activeKey} = props

    const store = {
        wikiRepositoryStore: WikiRepositoryStore
    }
    const { deleteProjectWikiRepositoryByCondition,
        findProjectWikiRepositoryList, findSystemUrl,
    } = WikiRepositoryStore;

    const projectId = props.match.params.id;
    const [projectWikiList, setProjectWikiList] = useState()
    const [wikiAddvisible,setWikiAddvisible] = useState(false);

    // 列表的列
    const columns = [
        {
            title: "知识库名称",
            dataIndex: "kanassRepositoryName",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title">
                <img
                    src={('images/repository1.png')}
                    alt=""
                    className="icon-30"
                />
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
            width: "10%",
            render: (text, record) => (
                <Space size="small">
                    <DeleteModal deleteFunction={deleteRepository} id={record.id} />
                </Space>
            ),
        }
    ];

    useEffect(() => {
        findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                setProjectWikiList(res.data)
            }
        })
    }, [projectId,activeKey]);


    const deleteRepository = (id) => {
        deleteProjectWikiRepositoryByCondition({ repositoryId: id, projectId: projectId }).then(data => {
            if (data.code === 0) {
                message.info('删除成功');

                findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
                    if (res.code === 0) {
                        setProjectWikiList(res.data)
                    }
                })
            }
        })
    }

    const goWikiDetail = (data) => {

        findSystemUrl({ name: "sward" }).then(res => {
            let kanassUrl;
            if (res.code === 0 && res.data.length > 0) {
                kanassUrl = res.data[0]?.systemUrl
            }
            applyJump(`${kanassUrl}/#/repository/${data.id}/overview`)
        })
    }



    return (
        <Provider {...store}>
            <Row className={"integration-content-row"} style={{height: "100%", overflow: "unset"}}>
                <Col
                    sm={24}
                    md={24}
                    lg={{ span: 24 }}
                    xl={{ span: "18", offset: "3" }}
                    xxl={{ span: "18", offset: "3" }}
                >
                    <div className={"project-set-integration"}>
                        <Breadcumb firstText="服务集成" secondText="sward">
                            {
                                <Button
                                    type="primary"
                                    onClick={() => setWikiAddvisible(true)}
                                >
                                    关联知识库
                                </Button>
                            }
                        </Breadcumb>
                        <Table
                            columns={columns}
                            dataSource={projectWikiList}
                            rowKey={(record) => record.id}
                            pagination={false}
                            onChange={false}
                            scroll={{x: "100%"}}
                            locale={{
                                emptyText: <Empty
                                    imageStyle={{height: 100}}
                                    description={<span>暂无数据</span>}
                                />
                            }}
                        />
                        <WikiRepositoryAdd
                            projectId={projectId}
                            wikiAddvisible={wikiAddvisible}
                            setWikiAddvisible={setWikiAddvisible}
                            setProjectWikiList={setProjectWikiList}
                        />
                    </div>
                </Col>
            </Row>

        </Provider>
    )
}

export default observer(BindSward);