/*
 * @Descripttion: 项目的事项类型列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Space, message, Row, Col } from "antd";
import WorkTypeAddmodal from "./WorkTypeAddModal";
import WorkTypeEditmodal from "./WorkTypeEditModal"
import { observer, inject, Provider } from "mobx-react";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import ProjectWorkTypeStore from "../store/ProjectWorkTypeStore";
import { getUser } from "tiklab-core-ui";
import DeleteModal from "../../../../common/deleteModal/deleteModal";
import "./WorkType.scss";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";

const WorkType = (props) => {
    const store = {
        projectWorkTypeStore: ProjectWorkTypeStore
    }
    const { workAllTypeList, findWorkTypeDmList, deleteWorkTypeCustomList, setWorkTypeList } = ProjectWorkTypeStore;
    // 项目id
    const projectId = props.match.params.id;
    const tenant = getUser().tenant;
    /**
     * 获取项目的事项类型列表
     */
    useEffect(() => {
        findWorkTypeDmList({ projectId: projectId })
        return;
    }, []);

    /**
     * 删除事项类型
     * @param {事项类型id} id 
     */
    const deleWorkType = (id) => {
        deleteWorkTypeCustomList({ id: id }).then(res => {
            if (res.code === 3001) {
                message.error(res.msg);
            }
            if (res.code === 0) {
                message.success(res.data);
                findWorkTypeDmList({ projectId: projectId })
            }
        })
    }

    /**
     * 上移类型
     * @param {*} id 
     */
    const upWorkType = (id) => {
        const newList = workAllTypeList
        const index = workAllTypeList.findIndex((item) => {
            return item.id === id
        })
        if (index === 0) {
            message.warning('已是最高了！');
        } else {
            const newItem = newList[index]
            newList[index] = newList[index - 1]
            newList[index - 1] = newItem
            setWorkTypeList(newList)
        }

    }

    /**
     * 下移
     * @param {*} id 
     */
    const downWorkType = (id) => {
        const newList = workAllTypeList
        const index = newList.findIndex((item) => {
            return item.id === id
        })
        if (index === newList.length - 1) {
            message.warning('已是最低了！');
        } else {
            const newItem = newList[index]
            newList[index] = newList[index + 1]
            newList[index + 1] = newItem
            setWorkTypeList(newList)
        }

    }

    /**
     * 跳转到流程详情
     * @param {流程id} id 
     */
    const goFlow = (id) => {
        props.history.push(`/project/${projectId}/set/projectFlowDetail/${id}`)
    }

    /**
     * 跳转到表单详情
     * @param {表单id} id 
     */
    const goForm = (id) => {
        props.history.push(`/project/${projectId}/set/ProjectFormDetail/${id}`)
    }

    const viewPrivilege = (record) => {
        props.history.push({pathname:`/project/${projectId}/set/workPrivilege/${record.id}`});
    }

    const columns = [
        {
            title: "类型名称",
            dataIndex: ["workType", "name"],
            key: "name",
            render: (text, record) => (
                <div className="work-type-name" >
                    <div className="work-type-icon">
                        <ImgComponent
                            src={record.workType?.iconUrl}
                            alt=""
                            className="icon-32"
                        />
                    </div>
                    <div className="work-type-text">{text}</div>
                </div>
            )
        },
       
        {
            title: '表单',
            dataIndex: ['form', 'name'],
            key: 'form',
            render: (text, record) => <div onClick={() => goForm(record.form.id)} className="span-botton">表单配置</div>,
        },
        {
            title: '流程',
            dataIndex: ['flow', 'name'],
            key: 'flow',
            render: (text, record) => <div onClick={() => goFlow(record.flow.id)} className="span-botton">流程配置</div>
        },
        {
            title: '权限',
            key: 'privilege',
            render: (text, record) => <div onClick={() => viewPrivilege(record)} className="span-botton">权限配置</div>
        },
        {
            title: "描述",
            dataIndex: ["workType", "desc"],
            key: "desc",
        },
        // {
        //     title: "操作",
        //     key: "action",
        //     align: "left",
        //     width: '10%',
        //     render: (text, record) => (
        //         <Space size="middle">

        //             {
        //                 record.workType.grouper === "custom" && <>
        //                     <WorkTypeEditmodal
        //                         name="编辑"
        //                         id={record.id}
        //                     >
        //                         编辑
        //                     </WorkTypeEditmodal>
        //                     <DeleteModal deleteFunction={deleWorkType} id={record.id} />
        //                 </>
        //             }
        //         </Space>
        //     ),
        // },
    ];

    return (<Provider {...store}>
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-work-type">
                    <Breadcumb
                        firstText="事项类型"
                    >
                        <div className="add-botton">
                            <WorkTypeAddmodal
                                findWorkTypeDmList={findWorkTypeDmList}
                                name="添加事件类型"
                                type="add"
                                workAllTypeList={workAllTypeList}
                            ></WorkTypeAddmodal>
                        </div>
                    </Breadcumb>
                    <div style={{ padding: "20px 0" }}>
                        <Table
                            columns={columns}
                            rowKey={(record) => record.id}
                            dataSource={workAllTypeList}
                            pagination={false}
                            scroll={{x: "100%"}}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    </Provider>

    );
};
export default observer(WorkType);