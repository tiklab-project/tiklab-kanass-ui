import React, { Fragment, useEffect, useState } from "react";
import { Modal, Form, Table, Radio, Select } from 'antd';
import { observer, inject } from "mobx-react";

const WikiRepositoryAdd = (props) => {
    const [form] = Form.useForm();
    const { wikiAddvisible, setWikiAddvisible, wikiRepositoryStore, projectId, setProjectWikiList } = props;
    const { createProjectWikiRepository, findProjectWikiRepositoryList, findUnProjectWikiRepository } = wikiRepositoryStore;

    const [repositoryList, setRepositoryList] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    useEffect(() => {
        findUnProjectWikiRepository({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                setRepositoryList(res.data)
            }
        })
    }, [])

    //提交用户列表
    const submitRepositoryList = () => {
        if (selectedRow.length !== 0) {
            for (let i = 0; i < selectedRow.length; i++) {
                const value = {wikiRepository: {id: selectedRow[i].id}, project: {id: projectId}}
                createProjectWikiRepository(value).then((data) => {
                    if (data.code === 0) {
                        findProjectWikiRepositoryList({ projectId: projectId }).then((res) => {
                            if(res.code === 0){
                                setProjectWikiList(res.data) 
                            }
                        })
                        setWikiAddvisible(false)
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

    const onCancel = () => {
        form.resetFields();
        setWikiAddvisible(false);
    };

    // 选择文档
    const selectWorkRepository = (selected, selectedRows) => {
        setSelectedRow(selectedRows)
    }

    return (
        <>
            <Fragment>
                <Modal
                    title={"添加知识库"}
                    visible={wikiAddvisible}
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

export default inject("wikiRepositoryStore")(observer(WikiRepositoryAdd));