import React, { Fragment, useEffect, useState } from "react";
import { Modal, Form, Table, Radio, Select } from 'antd';
import { observer, inject } from "mobx-react";

const TestRepositoryAdd = (props) => {
    const [form] = Form.useForm();
    const { testAddvisible, setTestAddvisible, testRepositoryStore, projectId, setProjectTestList } = props;
    const { createProjectTestRepository, findProjectTestRepositoryList, findUnProjectTestRepository } = testRepositoryStore;

    const [repositoryList, setRepositoryList] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    useEffect(() => {
        if(testAddvisible){
            findUnProjectTestRepository({ projectId: projectId }).then(res => {
                if (res.code === 0) {
                    setRepositoryList(res.data)
                }
            })
        }
        return;
    }, [testAddvisible])

    //提交用户列表
    const submitRepositoryList = () => {
        if (selectedRow.length !== 0) {
            for (let i = 0; i < selectedRow.length; i++) {
                const value = {testRepository: {id: selectedRow[i].id}, project: {id: projectId}}
                createProjectTestRepository(value).then((data) => {
                    if (data.code === 0) {
                        findProjectTestRepositoryList({ projectId: projectId }).then((res) => {
                            if(res.code === 0){
                                setProjectTestList(res.data) 
                            }
                        })
                        setTestAddvisible(false)
                    }
                })
            }

        } else {
            info()
        }
    }

    // 列表的列
    const columns = [
        {
            title: "用例仓库名称",
            dataIndex: "testRepositoryName",
            key: "name",
            align: "left",
            render: (text, record) => <div className="repository-title">
                {
                    record.iconUrl ?
                        <img
                            src={(record.iconUrl)}
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
                <span className="repository-name">{text}</span>
            </div>,
        },
        {
            title: "负责人",
            dataIndex: "userName",
            key: "master",
            align: "left",
            width: "20%",
        }
    ];

    const onCancel = () => {
        form.resetFields();
        setTestAddvisible(false);
    };

    // 选择文档
    const selectWorkRepository = (selected, selectedRows) => {
        setSelectedRow(selectedRows)
    }

    return (
        <>
            <Fragment>
                <Modal
                    title={"添加用例测试仓库"}
                    visible={testAddvisible}
                    onCancel={onCancel}
                    onOk={submitRepositoryList}
                    closable={false}
                    width={800}
                    destroyOnClose = {true}
                >
                    <Table
                        columns={columns}
                        dataSource={repositoryList}
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
                    />
                </Modal>
            </Fragment>

        </>
    );
};

export default inject("testRepositoryStore")(observer(TestRepositoryAdd));