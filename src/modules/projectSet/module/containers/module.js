/*
 * @Descripttion: 模块列表页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */
import React, { Fragment, useEffect,useState } from "react";
import { Breadcrumb, Input, Table, Space, Button,Divider } from "antd";
import ModuleAddmodal from "../components/moduleAdd";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import "../components/module.scss"

const { Search } = Input;
const Module = (props) => {
    // 解析 props
    const { moduleStore } = props;

    // 解析 moduleStore
    const { modulelist, searchmodule, findModulePage, addModule,deleModule,
            searchModuleById, editModuleById, totalRecord, modulePageParam, setPageParam
            } = moduleStore;
    
    // 项目id
    const projectId = localStorage.getItem("projectId");

    // 搜索模块的颜色
    const [moduleName,setModuleName] = useState("")

    // 加载中
    const [loading,setLoading] = useState(false)
    
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
                        projectid={projectId}
                        searchmodule={searchmodule}
                        editModuleById={editModuleById}
                        addModule={addModule}
                        searchModuleById={searchModuleById}
                    ></ModuleAddmodal>
                    <PrivilegeProjectButton code={'ModuleDele'} disabled ={"hidden"} domainId={projectId}>
                        <Button
                            type="link"
                            onClick={() => deleModule(record.id, projectId)}
                        >
                            删除
                        </Button>
                    </PrivilegeProjectButton>
                </Space>
            ),
        },
    ];

    // 初始化
    useEffect(() => {
        findModule()
        return null;
    }, [moduleName,modulePageParam.current]);

    /**
     * 获取模块列表，带分页
     */
    const findModule = () => {
        setLoading(true)
        findModulePage(projectId,moduleName).then(()=> {
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
        setPageParam({current: 1,pageSize: 10})
    };

    /**
     * 翻页
     * @param {*} pagination 
     */
    const pageTurning = (pagination)=> {
        setPageParam(pagination)
    }

    return (
        <div className="project-module">
            <Breadcrumb>
                <Breadcrumb.Item>模块管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">模块详情</a>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Divider />
            <div className="search-add">
                <Search
                    placeholder="input search text"
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300}}
                />
                <ModuleAddmodal
                    name="添加模块"
                    type="add"
                    id="0"
                    projectid={projectId}
                    addModule={addModule}
                    editModuleById={editModuleById}
                ></ModuleAddmodal>
            </div>
            <div className= "table-box">           
                <Table
                    columns={columns}
                    dataSource={modulelist}
                    rowKey={(record) => record.id}
                    pagination = {{...modulePageParam}}
                    loading={loading}
                    onSearch ={onSearch}
                    onChange = {pageTurning}
                />
            </div>
        </div>
    );
};
export default inject("moduleStore")(observer(Module));
