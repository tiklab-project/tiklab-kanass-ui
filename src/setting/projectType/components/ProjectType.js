/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:26:21
 * @Description: 项目类型
 */
import React, { useEffect, useState } from "react";
import { Table, Space, message, Row, Col } from "antd";
import ProjectTypeAddmodal from "./ProjectTypeAddModal";
import { observer } from "mobx-react";
import "./ProjectType.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import ProjectTypeStore from "../store/ProjectTypeStore";
import ImgComponent from "../../../common/imgComponent/ImgComponent";


const ProjectType = () => {
    const { projectTypelist, getProjectTypeList,
        addProjectTypeList, findProjectTypeListById,
        editProjectTypeList, deleteProjectTypeList,
    } = ProjectTypeStore;

    useEffect(() => {
        getProjectTypeList()
        return;
    }, []);

    const deleProjectType = (id) => {
        // deleteProjectTypeList(id)
        deleteProjectTypeList(id).then(res => {
            if (res.code === 3001) {
                message.error(res.msg);
            }
            if (res.cdoe === 0) {
                message.success(res.data);
            }
        })
    }

    const onSearch = (value) => {
        getProjectTypeList({ current: 1 }, value)
    }

    // 改变页码
    const onChange = (pagination) => {
        getProjectTypeList(pagination)
    }


    const [loading, setLoading] = useState(false)

    const columns = [
        {
            title: "类型名称",
            colSpan: 1,
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="project-type-name">
                    <div className="project-type-icon">
                        <ImgComponent
                            src={record.iconUrl}
                            alt=""
                            className="img-icon-right"
                        />

                    </div>
                    <div>{text}</div>
                </div>
            )

        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "操作",
            key: "action",
            align: "left",
            width: '10%',
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
                    <svg className="svg-icon" aria-hidden="true" onClick={() => deleProjectType(record.id)} style={{ cursor: "pointer" }}>
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                </Space>
            ),
        },
    ];

    return (
        // <Row>
        //     <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
        <div className="project-type">
            <Breadcumb
                firstText="项目类型"
            >
                <ProjectTypeAddmodal
                    name="添加项目类型"
                    typename="类型"
                    type="add"
                    addProjectList={addProjectTypeList}
                    getProjectTypeList={getProjectTypeList}
                />
            </Breadcumb>
            <div style={{ padding: "20px 0" }}>
                {
                    projectTypelist.length > 0 && <Table
                        columns={columns}
                        rowKey={(record) => record.id}
                        loading={loading}
                        dataSource={projectTypelist}
                        onChange={onChange}
                        pagination={false}
                        scroll={{x: "100%"}}
                    />
                }
            </div>
        </div>
        //     </Col>
        // </Row>
    );
};
export default observer(ProjectType);