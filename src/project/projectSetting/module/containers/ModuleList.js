/*
 * @Descripttion: 模块列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import React, { useEffect, useState } from "react";
import { Input, Table, Space, Button, Row, Col } from "antd";
import ModuleAddmodal from "../components/ModuleAddModal";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import "../components/module.scss";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import { SearchOutlined } from '@ant-design/icons';
const ModuleList = (props) => {
    // 解析 props
    const { moduleStore } = props;

    // 解析 moduleStore
    const { modulelist, searchmodule, findModulePage, addModule, deleModule,
        searchModuleById, editModuleById, totalRecord, modulePageParam, setPageParam
    } = moduleStore;

    // 项目id
    const projectId = props.match.params.id;

    // 搜索模块的颜色
    const [moduleName, setModuleName] = useState("")

    // 加载中
    const [loading, setLoading] = useState(false)

    // 列表的列
    const columns = [
        {
            title: "模块名称",
            dataIndex: "moduleName",
            key: "moduleName",
            render: (text, record) => (
                <Link to={`/index/moduledetail/${record.id}`}>{text}</Link>
            ),
        },
        {
            title: "所属项目",
            dataIndex: ["project", "projectName"],
            key: "project.projectName",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <Space size="middle">
                    <ModuleAddmodal
                        name="编辑模块"
                        type="edit"
                        id={record.id}
                        projectId={projectId}
                        searchmodule={searchmodule}
                        editModuleById={editModuleById}
                        addModule={addModule}
                        searchModuleById={searchModuleById}
                    ></ModuleAddmodal>
                    {/* <PrivilegeProjectButton code={'ModuleDele'} disabled={"hidden"} domainId={projectId}  {...props}> */}
                        <Button
                            type="link"
                            onClick={() => deleModule(record.id, projectId)}
                        >
                            删除
                        </Button>
                    {/* </PrivilegeProjectButton> */}
                </Space>
            ),
        },
    ];

    // 初始化
    useEffect(() => {
        findModule()
        return null;
    }, [moduleName, modulePageParam.current]);

    /**
     * 获取模块列表，带分页
     */
    const findModule = () => {
        setLoading(true)
        findModulePage(projectId, moduleName).then(() => {
            setLoading(false)
        })
    }

    /**
     * 通过名字搜索模块
     * @param {*} values 
     */
    const onSearch = (values) => {
        setModuleName(values)
        // 重置分页参数，从第一页开始搜索
        setPageParam({ current: 1, pageSize: 10 })
    };

    /**
     * 翻页
     * @param {*} pagination 
     */
    const pageTurning = (pagination) => {
        setPageParam(pagination)
    }

    return (
        <Row>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-module">
                    <Breadcumb
                        firstText="项目管理"
                        secondText="模块列表"
                    >
                        <ModuleAddmodal
                            name="添加模块"
                            type="add"
                            id="0"
                            projectid={projectId}
                            addModule={addModule}
                            editModuleById={editModuleById}
                        ></ModuleAddmodal>
                    </Breadcumb>
                    <div className="project-module-contant">
                        <div className="search-add">
                            <Input
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
                            />

                        </div>
                        <div className="table-box">
                            <Table
                                columns={columns}
                                dataSource={modulelist}
                                rowKey={(record) => record.id}
                                loading={loading}
                                onSearch={onSearch}
                                onChange={pageTurning}
                                pagination = {false}
                            />
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};
export default inject("moduleStore")(observer(ModuleList));
