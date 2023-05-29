import React, { Fragment, useEffect, useState } from "react";
import { Modal, Button, Table, Select, message, Input } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";

const { Search } = Input;
const { Option } = Select;

const WorkDocumentAddmodal = (props) => {
    const { workWikiStore, workStore, setWorkDocumentList, projectId, projectStore } = props;
    const { workId } = workStore;
    const {searchpro} =  projectStore;
    // const projectId = props.match.params.id;
    const { findDocumentPageByWorkItemId, createWorkItemDocument,
        findProjectWikiRepositoryList, findUnRelationWorkDocumentList, unRelationTotal,unRelationWorkCondition } = workWikiStore;
    const [visible, setVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [documentList, setDocumentList] = useState([])
    const [repositoryallList, setRepositoryaList] = useState([]);
    
    const showModal = () => {
        setVisible(true)
    };

    useEffect(() => {
        if (visible === true) {
            findProjectWikiRepositoryList({ projectId: projectId }).then(res => {
                if (res.code === 0) {
                    setRepositoryaList(res.data)
                    let list = []
                    if (res.data.length > 0) {
                        res.data.map(item => {
                            list.push(item.id)
                        })

                        findUnRelationWorkDocumentList({ workItemId: workId, repositoryIds: list, name: "", repositoryId: null }).then((data) => {
                            if (data.code === 0) {
                                setDocumentList(data.data.dataList)
                            }
                        })
                    }

                }
            })
        }
        return;
    }, [visible])

    const columns = [
        {
            title: "标题",
            dataIndex: "documentName",
            key: "title",
            width: 150
        },
        {
            title: "知识库",
            dataIndex: "kanassRepositoryName",
            key: "workStatus",
            width: 150
        },
        {
            title: "作者",
            dataIndex: "userName",
            key: "assigner",
            width: 150
        }
    ];

    const onCancel = () => {
        setVisible(false);
    };

    // 选择知识库筛选数据
    const searchUnselectWorkRepository = (value) => {
        const params = {
            repositoryId: value,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        findUnRelationWorkDocumentList(params).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
            }
        })
    }
    const searchSelectWorkRepository = (value) => {
        const categoryQuery = {
            name: value,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        findUnRelationWorkDocumentList(categoryQuery).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
            }

        })
    }
    // 选择文档
    const selectWorkRepository = (selected, selectedRows) => {
        setSelectedRow(selectedRows)
    }
    //提交用户列表
    const submitWorkRepositoryList = () => {
        const workItemDocument = [];
        if (selectedRow.length !== 0) {
            for (let i = 0; i < selectedRow.length; i++) {
                // createWorkItemDocument({id: selectedRowKeys[i],workitemId:workId })
                workItemDocument.push({ documentId: selectedRow[i].id, workItemId: workId, repositoryId: selectedRow[i].kanassRepositoryId })
            }
            createWorkItemDocument(workItemDocument).then((data) => {
                if (data.code === 0) {
                    findDocumentPageByWorkItemId({ workItemId: workId }).then((data) => {
                        setWorkDocumentList([...data])
                    })
                    setVisible(false)
                }
            })
        } else {
            info()
        }
    }
    //没有选择用户提升
    const info = () => {
        message.info('请选择事项');
    };

    const goWikiRepository = () => {
        searchpro(projectId).then(res => {
            if(res.code === 0){
                props.history.push(`/index/projectDetail/${projectId}/wiki`)
            }
        })
        
    }

    const changePage = (pagination) => {
        const params = {
            pageParam: {
                pageSize: 10,
                currentPage: pagination
            }
        }
        findUnRelationWorkDocumentList(params).then((data) => {
            if (data.code === 0) {
                setDocumentList(data.data.dataList)
            }

        })
    }
    return (
        <>
            <div className="addmodel">
                {
                    props.type !== "edit" ? <Button onClick={showModal}>
                        +{props.name}
                    </Button> :
                        <span onClick={showModal} style={{ color: "var(--tiklab-gray-400)" }}>{props.name}</span>
                }
                <Modal
                    title="选择文档"
                    visible={visible}
                    onCancel={onCancel}
                    width={800}
                    onOk={submitWorkRepositoryList}
                    className="work-kanass-addmodel"
                    destroyOnClose={true}
                    closable={false}
                >


                    {
                        repositoryallList && repositoryallList.length > 0 ?
                            <Fragment>
                                <div className="work-kanass-search" style={{ marginBottom: "20px" }}>
                                    选择知识库：
                                    <Select
                                        style={{ width: 200 }}
                                        allowClear
                                        onChange={(value) => searchUnselectWorkRepository(value)}
                                    >
                                        {
                                            repositoryallList && repositoryallList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.kanassRepositoryName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                    <Search
                                        allowClear
                                        placeholder="请输入关联文档名称"
                                        onSearch={searchSelectWorkRepository}
                                        enterButton
                                        style={{ width: 200, marginLeft: "10px" }}
                                    />
                                </div>
                                <Table
                                    columns={columns}
                                    dataSource={documentList}
                                    rowKey={record => record.id}
                                    rowSelection={{
                                        selectedRow,
                                        onChange: selectWorkRepository,
                                        getCheckboxProps: (record) => ({
                                            disabled: record.rele === true
                                        })
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                    // pagination={false}
                                    pagination={{
                                        total: unRelationTotal,
                                        pageSize: unRelationWorkCondition.pageParam.pageSize,
                                        current: unRelationWorkCondition.pageParam.currentPage,
                                        onChange: changePage
                                    }}
                                />
                            </Fragment>
                            :
                            <div>暂无关联知识库，请去  <Button type="primary" onClick={() => goWikiRepository()}>添加</Button></div>
                    }


                </Modal>
            </div>

        </>
    );
};

export default withRouter(inject('workStore', 'workWikiStore', 'projectStore')(observer(WorkDocumentAddmodal)));
