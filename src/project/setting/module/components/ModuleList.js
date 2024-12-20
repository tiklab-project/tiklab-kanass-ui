/*
 * @Descripttion: 模块列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:23:15
 */
import React, { useEffect, useState } from "react";
import { Input, Table, Space, Row, Col } from "antd";
import ModuleAddmodal from "./ModuleAddModal";
import "../components/module.scss";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import ModuleStore from "../store/ModuleStore";
import { observer } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import Button from "../../../../common/button/Button";
import DeleteModal from "../../../../common/deleteModal/deleteModal";
import InputSearch from "../../../../common/input/InputSearch";
const ModuleList = (props) => {
    // 解析 moduleStore
    const { moduleList, findModuleListTree, createModule, deleteModule, editModuleById} = ModuleStore;

    const [type, setType] = useState("add")
    const [moduleId, setModuleId] = useState()
    const [visible, setVisible] = useState(false);
    const [parent, setParent] = useState()
    const [modalName, setModalName] = useState()
    // 项目id
    const projectId = props.match.params.id;

    // 加载中
    const [loading, setLoading] = useState(false)


    // 初始化
    useEffect(() => {
        const params = {projectId: projectId};
        findModule(params)
        return null;
    }, []);

    /**
     * 获取模块列表，带分页
     */
    const findModule = (params) => {
        setLoading(true)
        findModuleListTree(params).then(() => {
            setLoading(false)
        })
    }

    /**
     * 通过名字搜索模块
     * @param {*} values 
     */
    const onSearch = (values) => {
        const params = {
            projectId: projectId,
            moduleName: values
        }
        findModule(params)
    };


    const showModal = (record, name) => {
        setVisible(true);
        setParent(record?.id)
        setType("add")
        setModalName(name)
    };

    const showEditModule = (record) => {
        setVisible(true);
        setParent(record.parent?.id)
        setModuleId(record.id)
        setType("edit")
        setModalName("编辑")
    }

    const columns = [
        {
            title: "模块名称",
            dataIndex: "moduleName",
            key: "moduleName"
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
            width: "20%",
        },
        {
            title: "操作",
            key: "action",
            width: "15%",
            render: (text, record) => (
                <Space size="middle">
                    <PrivilegeProjectButton code={'ModuleAdd'} domainId={projectId}  {...props}>
                        <svg className="svg-icon" aria-hidden="true" onClick={() => showModal(record, "添加子模块")} style={{ cursor: "pointer" }}>
                            <use xlinkHref="#icon-add2"></use>
                        </svg>
                    </PrivilegeProjectButton>
                    <svg className="svg-icon" aria-hidden="true" onClick={() => showEditModule(record)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <DeleteModal deleteFunction = {deleteModuleList} id = {record.id}/>
                </Space>
            )
        }
    ];

    const deleteModuleList = (id) => {
        deleteModule(id).then(() => {
            findModule({projectId: projectId})
        })
    }

    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-module">
                    <Breadcumb
                        firstText="模块"
                    >
                        <PrivilegeProjectButton code={'ModuleAdd'} domainId={projectId}  {...props}>
                            <Button type="primary" onClick={() => showModal(null, "添加模块")}>
                                添加模块
                            </Button>
                        </PrivilegeProjectButton>
                    </Breadcumb>
                    <div className="project-module-contant">
                        <div className="search-add">
                            {/* <Input
                                className="module-search"
                                placeholder="请输入名字"
                                onChange={(value) => onSearch(value)}
                                suffix={
                                    <SearchOutlined
                                        style={{
                                            color: 'rgba(0,0,0,.45)',
                                        }}
                                    />
                                }
                            /> */}
                            <InputSearch onChange={(value) => onSearch(value)} placeholder={"搜索模块"} />
                        </div>
                        <div className="module-table-box">
                            <Table
                                columns={columns}
                                dataSource={moduleList}
                                rowKey={(record) => record.id}
                                loading={loading}
                                onSearch={onSearch}
                                pagination={false}
                                scroll={{x: "100%"}}
                            />
                            
                        </div>
                    </div>
                </div>
                <ModuleAddmodal
                    id= {moduleId}
                    projectid={projectId}
                    parent={parent}
                    createModule={createModule}
                    editModuleById={editModuleById}
                    visible = {visible}
                    setVisible = {setVisible}
                    type = {type}
                    modalName = {modalName}
                    moduleList = {moduleList}
                ></ModuleAddmodal>
            </Col>
        </Row>
    );
};
export default observer(ModuleList);
