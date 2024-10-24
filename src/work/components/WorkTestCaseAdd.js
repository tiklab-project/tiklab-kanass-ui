import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import { message, Modal, Table } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkTestCaseAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
const WorkTestCaseAddmodal = (props) => {
    const { workTestStore, workStore, setWorkTestCaseList, projectId, showSelectTestCase, selectTestCase } = props;
    const { workId } = workStore;
    // const {searchpro} =  projectStore;
    const { findTestCasePageByWorkItemId, createWorkTestCase,
        findProjectTestRepositoryList, findUnRelationWorkTestCaseList,
        findTestOnRepositoryUserList, unRelationWorkCondition } = workTestStore;

    const {userList,getSelectUserList } = workStore;
    const [selectedRow, setSelectedRow] = useState([]);
    const [testCaseList, setTestCaseList] = useState([])
    const [repositoryallList, setRepositoryaList] = useState([]);
    const [repositoryallIdList, setRepositoryallIdList] = useState([]);
    const [repositoryValue, setRepositoryValue] = useState()
    const [testCaseUserList, setTestCaseUserList] = useState([]);
    useEffect(() => {
        if (selectTestCase === true) {
            getSelectUserList(projectId)
            findProjectTestRepositoryList({ projectId: projectId }).then(res => {
                if (res.code === 0) {
                    setRepositoryaList(res.data)
                    let list = []
                    if (res.data.length > 0) {
                        res.data.map(item => {
                            list.push(item.id)
                        })
                        setRepositoryallIdList(list)
                        findUnRelationWorkTestCaseList({ workItemId: workId, repositoryIds: list, name: "", repositoryId: null }).then((data) => {
                            if (data.code === 0) {
                                setTestCaseList(data.data.dataList)
                            }
                        })
                        findTestOnRepositoryUserList(list).then(res => {
                            if(res.code === 0){
                                setTestCaseUserList(res.data)
                            }
                            
                        })
                    }else {
                        Modal.confirm({
                            title: '提示?',
                            content: "该项目没有关联用例库，是否先去添加用例库",
                            centered: true,
                            okText: "去添加",
                            cancelText: "取消",
                            getContainer: testCaseAdd ? () => testCaseAdd.current : null,
                            onOk() { props.history.push({
                                pathname: `/project/${projectId}/test`,
                                state: { activeKey: "repository" }
                            }) }
                        });
                    }

                }
            })
        }
        
        return;
    }, [selectTestCase])

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
            key: "testCategoryName",
            width: 150
        },
        {
            title: "用例库",
            dataIndex: ["repository", "name"],
            key: "repository",
            width: 150
        },
        {
            title: "作者",
            dataIndex: "createUser",
            key: "createUser",
            width: 150
        }
    ];



    // 选择知识库筛选数据
    const searchUnselectWorkRepository = (value) => {
        let params;
        if(value){
            params = {
                repositoryIds: [value?.value],
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }
        }else {
            params = {
                repositoryIds: repositoryallIdList,
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }
        }
        setRepositoryValue(value)
        findUnRelationWorkTestCaseList(params).then((data) => {
            if (data.code === 0) {
                setTestCaseList(data.data.dataList)
            }
        })
    }

    const searchUnselectUser = (value) => {
        const categoryQuery = {
            creatUserId: value.value,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        findUnRelationWorkTestCaseList(categoryQuery).then((data) => {
            if (data.code === 0) {
                setTestCaseList(data.data.dataList)
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
                // createWorkTestCase({id: selectedRowKeys[i],workitemId:workId })
                workItemTestCase.push({ 
                    testCaseId: selectedRow[i].id, 
                    workItemId: workId, 
                    repositoryId: selectedRow[i].kanassRepositoryId,
                    projectId: projectId
                })
            }
            createWorkTestCase(workItemTestCase).then((data) => {
                if (data.code === 0) {
                    findTestCasePageByWorkItemId({ workItemId: workId }).then((data) => {
                        setWorkTestCaseList([...data])
                    })
                    showSelectTestCase(false)
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
    const testCaseAdd = useRef()
    return (
        <>
            <div className="testCase-add" ref={testCaseAdd}>

                <div className="testCase-add-search">
                    <InputSearch style={{ minWidth: "100px", maxWidth: "300px", flex: 1 }} onChange={(value) => searchSelectWorkRepository(value)} placeholder={"搜索用例"} />
                    <SelectSimple 
                        name="repository"
                        onChange={(value) => searchUnselectWorkRepository(value)}
                        title={"用例库"}
                        suffixIcon = {true}
                        value = {repositoryValue}
                    >
                        {
                            repositoryallList.map(item => {
                                return <SelectItem
                                    value={item.id}
                                    label={item.testRepositoryName}
                                    key={item.id}
                                    imgUrl={`${base_url}/${item.iconUrl}`}
                                />
                            })
                        }
                    </SelectSimple>
                    {
                        testCaseUserList && testCaseUserList.length > 0 && <SelectSimple name="user"
                            onChange={(value) => searchUnselectUser(value)}
                            title={"用例作者"}
                            suffixIcon = {true}
                        >
                            {
                                testCaseUserList.map(item => {
                                    return <SelectItem
                                        value={item.id}
                                        label={item.nickname}
                                        key={item.id}
                                    />
                                })
                            }
                        </SelectSimple>
                    }


                    <div className="testCase-add-submit" style={{width: "66px"}}>
                        <span onClick={() => submitWorkRepositoryList()}>
                            确定
                        </span>
                        <span style={{ marginLeft: "10px" }} onClick={() => showSelectTestCase(false)}>
                            取消
                        </span>
                    </div>
                </div>
                <div className="testCase-add-model">
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
                        pagination={false}
                        scroll={{x: "100%"}}
                    />
                </div>


            </div>


        </>
    );
};

export default inject('workStore', 'workTestStore')(observer(WorkTestCaseAddmodal));
