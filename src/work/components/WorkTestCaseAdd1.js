import React, { Fragment, useEffect, useState } from "react";
import { Modal, Button, Table, Select, message, Input } from 'antd';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";

const { Search } = Input;
const { Option } = Select;

const WorkTestCaseAddmodal = (props) => {
    const { workTestStore, workStore,projectId, setWorkTestCaseList, projectStore } = props;
    const { workId } = workStore;
    // const {searchpro} =  projectStore;
    const { findTestCasePageByWorkItemId, createWorkTestCase,
        findProjectTestRepositoryList, findUnRelationWorkTestCaseList, unRelationWorkCondition, unRelationTotal } = workTestStore;
    const [visible, setVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [testCaseList, setTestCaseList] = useState([])
    const [repositoryallList, setRepositoryaList] = useState([]);
    const showModal = () => {
        setVisible(true)
    };
    const path = props.location.pathname.split("/")[1];
    useEffect(() => {
        if (visible === true) {
            findProjectTestRepositoryList({ projectId: projectId }).then(res => {
                if (res.code === 0) {
                    setRepositoryaList(res.data)
                    if(res.data.length > 0){
                        let list = []
                        res.data.map(item => {
                            list.push(item.id)
                        })
                        findUnRelationWorkTestCaseList({ workItemId: workId, repositoryIds: list, name: "", repositoryId: null }).then((data) => {
                            if (data.code === 0) {
                                setTestCaseList(data.data.dataList)
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
            dataIndex: "testCaseName",
            key: "title",
            width: 150
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
        }
    ];

    const onCancel = () => {
        setVisible(false);
    };

    // 选择知识库筛选数据
    const searchUnselectWorkRepository = (value) => {
        const params = {
            repositoryIds: [value],
            pageParam: {
                pageSize: 1,
                currentPage: 1
            }
        }
        // setSelectRepository()
        findUnRelationWorkTestCaseList(params).then((data) => {
            if (data.code === 0) {
                setTestCaseList(data.data.dataList)
            }
        })
    }
    const searchSelectWorkRepository = (value) => {
        const categoryQuery = {
            name: value,
            pageParam: {
                pageSize: 1,
                currentPage: 1
            }
        }
        findUnRelationWorkTestCaseList(categoryQuery).then((data) => {
            if (data.code === 0) {
                setTestCaseList(data.data.dataList)
            }

        })
    }
    // 选择文档
    const selectWorkRepository = (selected, selectedRows) => {
        setSelectedRow(selectedRows)
    }
    //提交用户列表
    const submitWorkRepositoryList = () => {
        const workItemTestCase = [];
        if (selectedRow.length !== 0) {
            for (let i = 0; i < selectedRow.length; i++) {
                workItemTestCase.push({ testCaseId: selectedRow[i].id, workItemId: workId, repositoryId: selectedRow[i].repositoryId })

            }
            createWorkTestCase(workItemTestCase).then((data) => {
                if (data.code === 0) {

                    findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
                        setWorkTestCaseList([...data])
                        setVisible(false)
                    })

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

    const goTestRepository = () => {
        // searchpro(projectId).then(res => {
        //     if(res.code === 0){
        //         props.history.push(`/project/${projectId}/test`)
        //     }
        // })
        props.history.push(`/project/${projectId}/test`)
    }

    const changePage = (pagination) => {
        const params = {
            pageParam: {
                pageSize: 1,
                currentPage: pagination
            }
        }
        findUnRelationWorkTestCaseList(params).then((data) => {
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
                    title="选择测试用例"
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
                                    选择用例仓库：
                                    <Select
                                        style={{ width: 200 }}
                                        allowClear
                                        onChange={(value) => searchUnselectWorkRepository(value)}
                                    >
                                        {
                                            repositoryallList && repositoryallList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.testRepositoryName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                    <Search
                                        allowClear
                                        placeholder="请输入用例关键字"
                                        onSearch={searchSelectWorkRepository}
                                        enterButton
                                        style={{ width: 200, marginLeft: "10px" }}
                                    />
                                </div>
                                <Table
                                    columns={columns}
                                    dataSource={testCaseList}
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
                                    pagination={{
                                        total: unRelationTotal,
                                        pageSize: unRelationWorkCondition.pageParam.pageSize,
                                        current: unRelationWorkCondition.pageParam.currentPage,
                                        onChange: changePage
                                    }}
                                    scroll={{x: "100%"}}
                                />
                            </Fragment>
                            :
                            <div>暂无关联用例仓库，请去  <Button type="primary" onClick={() => goTestRepository()}>添加</Button></div>
                    }

                </Modal>
            </div>

        </>
    );
};

export default withRouter(inject('workStore', 'workTestStore')(observer(WorkTestCaseAddmodal)));
