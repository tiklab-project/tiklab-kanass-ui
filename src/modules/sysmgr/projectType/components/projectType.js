import React, { Fragment, useEffect,useState } from "react";
import { Breadcrumb, Input, Table, Space, Button,message,Divider } from "antd";
import ProjectTypeAddmodal from "./addProjectType";
import { observer, inject } from "mobx-react";
const { Search } = Input;


const ProjectType = (props) => {
    // 初始化
    const {projectTypeStore} = props;
    const {projectTypelist,getProjectTypeList,
            addProjectTypeList,findProjectTypeListById,
            editProjectTypeList,deleteProjectTypeList,
            projectTypePage
            } = projectTypeStore;

    useEffect(() => {
        getProjectTypeList()
    }, []);

    const deleProjectType = (id)=> {
        deleteProjectTypeList(id)
    }

    const onSearch=(value)=>{
        getProjectTypeList({current: 1},value)
    }

    // 改变页码
    const onChange = (pagination)=> {
        getProjectTypeList(pagination)
    }


    const [loading,setLoading] = useState(false)

    const columns = [
        {
            title: "类型名称",
            colSpan: 1,
            dataIndex: "name",
            key: "name"
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="middle">
                    <ProjectTypeAddmodal
                        name="编辑"
                        type="edit"
                        typename="类型"
                        id={record.id}
                        addProjectList={addProjectTypeList}
                        editProjectList={editProjectTypeList}
                        findProjectTypeListById={findProjectTypeListById}
                    >
                        编辑
                    </ProjectTypeAddmodal>
                    <Button
                        type="link"
                        onClick={() => deleProjectType(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];
    
    return (
        <Fragment>
            <Breadcrumb>
                <Breadcrumb.Item>项目类型管理</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/">项目类型列表</a>
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
                <ProjectTypeAddmodal
                    name="添加项目类型"
                    typename="类型"
                    type="add"
                    addProjectList={addProjectTypeList}
                ></ProjectTypeAddmodal>
            </div>
            {
                projectTypelist.length>0 && <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    loading={loading}
                    dataSource= {projectTypelist}
                    onChange = {onChange}
                    pagination = {{...projectTypePage}}
                />
            } 
        </Fragment>
    );
};
export default inject("projectTypeStore")(observer(ProjectType));