/*
 * @Descripttion: 项目的事项类型列表添加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:02:38
 */

import React, { useState } from "react";
import { Modal, Form, Table } from 'antd';
import "./WorkType.scss"
import Button from "../../../../common/button/Button";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import { getUser } from "tiklab-core-ui";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";


const WorkTypeAddModal = (props) => {
    const [form] = Form.useForm();
    const { workAllTypeList, projectWorkTypeStore, findWorkTypeDmList } = props;
    const { findSelectWorkTypeDmList, workSelectTypeList, createWorkTypeDm } = projectWorkTypeStore;
    // 弹窗的显示参数
    const [visible, setVisible] = useState(false);
    // 项目的id
    const projectId = props.match.params.id;
    // 选择的事项类型
    const [selectWorkType, setSelelctWorkType] = useState()
    const tenant = getUser().tenant;
    /**
     * 显示添加弹窗，获取未被添加的事项列表
     */
    const showModal = () => {
        setVisible(true);
        let ids = []
        workAllTypeList.map(item => {
            ids.push(item.workType.id)
        })
        findSelectWorkTypeDmList({ selectIds: ids }).then(res => {
            if (res.code === 0) {
                console.log(res.data)
            }
        })
    };

    /**
     * 添加事项类型到项目
     */
    const addWorkTypeDm = () => {
        selectWorkType.map((item, index) => {
            const data = {
                projectId: projectId,
                workType: item,
                flow: item.flow,
                form: item.form
            }
            createWorkTypeDm(data).then(res => {
                if (res.code === 0 && selectWorkType.length === index + 1) {
                    findWorkTypeDmList({ projectId: projectId })
                    setVisible(false)
                }
            })
        })

    };

    /**
     * 取消添加
     */
    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    /**
     * 列参数
     */
    const columns = [
        {
            title: "类型名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="work-type-name" >
                    <div className="work-type-icon">
                        <ImgComponent
                            src={record.iconUrl}
                            alt=""
                            className="icon-32"
                        />
                    </div>
                    <div className="work-type-text">{text}</div>
                </div>
            )
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: '流程配置',
            dataIndex: ['flow', 'name'],
            key: 'flow',
            render: (text, record) => <div onClick={() => goFlow(record.flow.id)} className="span-botton">{text}</div>
        }

    ];

    /**
     * 列表选择操作
     */
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelelctWorkType(selectedRows)
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
            console.log(record, selected, selectedRows, nativeEvent)
        }
    };

    return (
        <>
            <div >
                <Button type={"primary"} onClick={showModal}>
                    添加事项类型
                </Button>
                <Modal
                    title="添加事项类型"
                    visible={visible}
                    onOk={addWorkTypeDm}
                    onCancel={onCancel}
                    className="work-type-addmodel"
                    closable={false}
                >
                    <Table
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={workSelectTypeList}
                        pagination={false}
                        scroll={{x: "100%"}}
                    />
                </Modal>
            </div>
        </>
    );
};

export default withRouter(inject("projectWorkTypeStore")(observer(WorkTypeAddModal)));