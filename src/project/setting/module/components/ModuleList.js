/*
 * @Descripttion: 模块列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:23:15
 */
import React, { useEffect, useState } from "react";
import {Input, Table, Space, Row, Col, message, Empty} from "antd";
import ModuleAddmodal from "./ModuleAddModal";
import "../components/module.scss";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import ModuleStore from "../store/ModuleStore";
import { observer } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import Button from "../../../../common/button/Button";
import DeleteModal from "../../../../common/deleteModal/deleteModal";
import InputSearch from "../../../../common/input/InputSearch";
import ProductModuleStore from "../../../../product/module/store/ProductModuleStore";

const getStore = (project) =>{
    if (project?.productId){
        return ProductModuleStore
    }else {
        return ModuleStore
    }
}
const ModuleList = (props) => {
    // 解析 moduleStore
    const project = JSON.parse(localStorage.getItem('project'));
    const { moduleList, findModuleListTree, createModule, deleteModule, editModuleById} = getStore(project);
    const [type, setType] = useState("add")
    const [moduleId, setModuleId] = useState()
    const [visible, setVisible] = useState(false);
    const [parent, setParent] = useState()
    const [modalName, setModalName] = useState()
    const path = props.match.path;
    // 项目id
    const projectId = props.match.params.id;

    // 加载中
    const [loading, setLoading] = useState(false)

    const [bindProduct, setBindProduct] = useState(false);


    // 初始化
    useEffect(() => {
        if (project?.productId){
            const params = {productId: project?.productId};
            findModule(params)
        }else {
            const params = {projectId: projectId};
            findModule(params)
        }
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
        if (project?.productId){
            const params = {
                productId: project?.productId,
                moduleName: values
            }
            findModule(params)
        }else {
            const params = {
                projectId: projectId,
                moduleName: values
            }
            findModule(params)
        }
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
    ];

    const deleteModuleList = (id) => {
        deleteModule(id).then((res) => {
            if (res.data === false){
                message.error("该模块下存在事项无法删除")
            }else {
                findModule({projectId: projectId})
            }
        })
    }

    const actionColumn = {
        title: "操作",
        key: "action",
        width: "15%",
        render: (text, record) => (
            <Space size="middle">
                <PrivilegeProjectButton code={'project_module_add'} domainId={projectId}  {...props}>
                    <svg className="svg-icon" aria-hidden="true" onClick={() => showModal(record, "添加子模块")} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-add2"></use>
                    </svg>
                </PrivilegeProjectButton>
                <PrivilegeProjectButton code={'project_module_update'} domainId={projectId}  {...props}>
                    <svg className="svg-icon" aria-hidden="true" onClick={() => showEditModule(record)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                </PrivilegeProjectButton>
                <PrivilegeProjectButton code={'project_module_delete'} domainId={projectId}  {...props}>
                    <DeleteModal deleteFunction = {deleteModuleList} id = {record.id}/>
                </PrivilegeProjectButton>
            </Space>
        )
    }

    const getColumns = () => {
        if (project?.productId){
            return columns
        }else {
            return [...columns, actionColumn]
        }
    }

    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-module">
                    <Breadcumb
                        firstText="模块"
                    >
                        {
                            project?.productId ? <></> :
                                <PrivilegeProjectButton code={'project_module_add'} domainId={projectId}  {...props}>
                                    <Button type="primary" onClick={() => showModal(null, "添加模块")}>
                                        添加模块
                                    </Button>
                                </PrivilegeProjectButton>
                        }

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
                                columns={getColumns()}
                                dataSource={moduleList}
                                rowKey={(record) => record.id}
                                loading={loading}
                                onSearch={onSearch}
                                pagination={false}
                                scroll={{x: "100%"}}
                                locale={{
                                    emptyText: <Empty
                                        imageStyle={{height: 100}}
                                        description={<span>暂无数据</span>}
                                    />
                                }}
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
