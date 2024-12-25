/*
 * @Descripttion: 迭代设置页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-25 15:40:39
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Input, Form, Select, DatePicker, Button, Modal, Row, Col, message, Alert } from "antd";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import moment from 'moment';
import "./SprintBasicInfo.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";

import { Collapse } from 'antd';
import SprintBasicStore from "../store/SprintBasicStore";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
const { Panel } = Collapse;

const { RangePicker } = DatePicker;
const SprintBasicInfo = props => {
    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const formTailLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 18,
            offset: 4
        },
    };
    const [form] = Form.useForm();
    const [confirmForm] = Form.useForm();
    const sprintId = props.match.params.sprint;
    const projectId = props.match.params.id;
    const { deleteSprint, updateSprint, findSprint, getUseList, useList, status,
        findAllSprintState } = SprintBasicStore;
    const [disable, setDisabled] = useState(true);
    const [sprintInfo, setSprintInfo] = useState();
    const [sprintChangeVisable, setSprintChangeVisable] = useState(false)
    // 周期
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: 'Please select time!',
            }
        ]
    };
    const dateFormat = "YYYY-MM-DD HH:mm:ss";

    useEffect(() => {

        info()
        getUseList(projectId)
        findAllSprintState()
        return;
    }, [])

    /**
     * 初始化迭代信息
     */
    const info = () => {
        findSprint(sprintId).then((response) => {
            if (response.code === 0) {
                const data = response.data;
                setSprintInfo(data)
                form.setFieldsValue({
                    sprintName: data.sprintName,
                    desc: data.desc,
                    master: data.master.id,
                    startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                })
            }

        })
    };

    const cancel = () => {
        form.setFieldsValue({
            sprintName: sprintInfo.sprintName,
            master: sprintInfo.master.id,
            desc: sprintInfo.desc,
            startTime: [moment(sprintInfo.startTime, dateFormat), moment(sprintInfo.endTime, dateFormat)]
        })
        setDisabled(false)
        setIsChangeState(false)
    }

    const onFinish = () => {
        if (isChangeState) {
            setSprintChangeVisable(true)
        } else {
            form.validateFields().then((values) => {
                const time = values["startTime"]
                const data = {
                    ...values,
                    startTime: time[0].format(dateFormat),
                    endTime: time[1].format(dateFormat),
                    master: { id: values.master },
                    desc: values.desc,
                    id: sprintId
                }
                updateSprint(data).then(res => {
                    if (res.code === 0) {
                        setSprintInfo(data)
                        message.success("修改成功");
                        setDisabled(true);
                    }
                });
            })
        }

    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        confirmForm.validateFields().then((fieldsValue) => {
            deleteSprint(sprintId).then(response => {
                if (response.code === 0) {
                    message.success('删除成功');
                    setIsModalVisible(false);
                    props.history.push(`/project/${projectId}/sprint`)
                }
            })

        })

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const [isChangeState, setIsChangeState] = useState(false)

    const sprintInfoDesc = () => (
        <div>
            <div className="sprint-info-title">
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use xlinkHref="#icon-projectDetail"></use>
                </svg>
                迭代信息
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                迭代图标信息，可见范围，负责人等信息，可点击修改</div>
        </div>
    );

    const sprintDelete = () => (
        <div>
            <div className="sprint-info-title">
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use xlinkHref="#icon-projectDelete"></use>
                </svg>
                删除迭代
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                删除迭代
            </div>
        </div>
    );
    return (
        <Row className="sprint-basicinfo">
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="sprint-set-basicinfo">
                    <Breadcumb
                        firstText="迭代信息"
                    />

                    <Collapse defaultActiveKey = {"1"} expandIconPosition={"right"}>
                        <Panel header={sprintInfoDesc()} key="1" >
                            <div className="sprint-set-icon">
                                <Form
                                    {...layout}
                                    name="basic"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    form={form}
                                    onFinish={onFinish}
                                    onFieldsChange={() => setDisabled(false)}
                                    labelAlign={"left"}
                                >
                                    <Form.Item
                                        label="迭代名称"
                                        name="sprintName"
                                    >
                                        <Input placeholder="迭代名称" />
                                    </Form.Item>


                                    <Form.Item
                                        label="负责人"
                                        name="master"
                                        rules={[
                                            {
                                                required: false,
                                                message: '请输入迭代编码',
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder="负责人"
                                            allowClear
                                        >
                                            {
                                                useList && useList.map((item, index) => {
                                                    return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="startTime" label="计划日期" {...rangeConfig} >
                                        <RangePicker locale={locale} showTime />
                                    </Form.Item>
                                    <Form.Item
                                        label="迭代描述"
                                        name="desc"
                                    >
                                        <Input placeholder="迭代描述" />
                                    </Form.Item>
                                    <PrivilegeProjectButton code={'SprintEdit'} domainId={projectId}  {...props}>
                                        <Form.Item {...formTailLayout} >
                                            <Button onClick={() => cancel()}>
                                                取消
                                            </Button>
                                            <Button htmlType="submit" type="primary" disabled={disable}>
                                                保存
                                            </Button>
                                        </Form.Item>
                                    </PrivilegeProjectButton>

                                </Form>
                            </div>
                        </Panel>
                        <Panel header={sprintDelete()} key="2">
                            <div className="sprint-set-delete">
                                <div className="sprint-set-icon-block">
                                    删除迭代，包含迭代与事项的关联关系
                                </div>
                                <PrivilegeProjectButton code={'SprintDelete'} domainId={projectId}  {...props}>
                                    <div className="change-button delete-button" onClick={() => showModal()}>
                                        删除迭代
                                    </div>
                                </PrivilegeProjectButton>

                            </div>
                        </Panel>
                    </Collapse>

                </div>
                <div className="sprint-delete-confirm">
                    <Modal
                        title="确定删除"
                        getContainer={false}
                        visible={isModalVisible}
                        closable={false} onOk={handleOk} onCancel={handleCancel} okText={"确定"} cancelText={"取消"}
                        okType="danger"
                        okButtonProps={{ type: "primary" }}
                    >
                        删除迭代，包含迭代与事项的关联关系
                    </Modal>
                </div>
                {/* <SprintChangeModal
                    visible={sprintChangeVisable}
                    projectId={projectId}
                    sprintId={sprintId}
                    SprintBasicStore={SprintBasicStore}
                    setVisible={setSprintChangeVisable}
                    setSprintInfo = {setSprintInfo}
                    setDisabled = {setDisabled}
                    form={form}
                /> */}

            </Col>
        </Row >
    )
}

export default observer(SprintBasicInfo);
