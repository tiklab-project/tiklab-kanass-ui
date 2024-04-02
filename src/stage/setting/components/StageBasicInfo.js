/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-08 09:24:33
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Input, Form, Select, DatePicker, Button, Modal, Row, Col, message, Alert } from "antd";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import moment from 'moment';
import "./StageBasicInfo.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";

import { Collapse } from 'antd';
import StageBasicStore from "../store/StageBasicStore";
import StageChangeModal from "../../overview/components/StageEndState";
const { Panel } = Collapse;

const { RangePicker } = DatePicker;
const StageBasicInfo = props => {
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
    const stageId = props.match.params.stage;
    const projectId = props.match.params.id;
    const { deleteStage, updateStage, findStage, getUseList, useList, status,
        findAllStageState, findSelectStageList } = StageBasicStore;
    const [disable, setDisabled] = useState(true);
    const [stageInfo, setStageInfo] = useState();
    const [stageChangeVisable, setStageChangeVisable] = useState(false)
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
        findAllStageState()
        return;
    }, [])
    const info = () => {
        findStage(stageId).then((response) => {
            if (response.code === 0) {
                const data = response.data;
                setStageInfo(data)
                form.setFieldsValue({
                    stageName: data.stageName,
                    desc: data.desc,
                    master: data.master.id,
                    status: data.status,
                    startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                })
            }

        })
    };

    const cancel = () => {
        form.setFieldsValue({
            stageName: stageInfo.stageName,
            master: stageInfo.master.id,
            desc: stageInfo.desc,
            startTime: [moment(stageInfo.startTime, dateFormat), moment(stageInfo.endTime, dateFormat)]
        })
        setDisabled(false)
        setIsChangeState(false)
    }

    const onFinish = () => {
        if (isChangeState) {
            setStageChangeVisable(true)
        } else {
            form.validateFields().then((values) => {
                const time = values["startTime"]
                const data = {
                    ...values,
                    startTime: time[0].format(dateFormat),
                    endTime: time[1].format(dateFormat),
                    master: { id: values.master },
                    desc: values.desc,
                    id: stageId
                }
                updateStage(data).then(res => {
                    if (res.code === 0) {
                        setStageInfo(data)
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
            deleteStage(stageId).then(response => {
                if (response.code === 0) {
                    message.success('删除成功');
                    setIsModalVisible(false);
                    props.history.push(`/projectDetail/${projectId}/stage`)
                }
            })

        })

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const [isChangeState, setIsChangeState] = useState(false)

    const stageInfoDesc = () => (
        <div>
            <div className="stage-info-title">
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use xlinkHref="#icon-projectDetail"></use>
                </svg>
                计划信息
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                计划图标信息，可见范围，负责人等信息，可点击修改</div>
        </div>
    );

    const stageDelete = () => (
        <div>
            <div className="stage-info-title">
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use xlinkHref="#icon-projectDelete"></use>
                </svg>
                删除计划
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                删除计划
            </div>
        </div>
    );

    const statusList = [
        {
            id: "0",
            name: "未开始"
        }, {
            id: "1",
            name: "进行中"
        }, {
            id: "2",
            name: "已完成"
        }
    ]
    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="stage-set-basicinfo">
                    <Breadcumb
                        firstText="计划信息"
                    />

                    <Collapse expandIconPosition={"right"}>
                        <Panel header={stageInfoDesc()} key="1" >
                            <div className="stage-set-icon">
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
                                        label="计划名称"
                                        name="stageName"
                                    >
                                        <Input placeholder="计划名称" />
                                    </Form.Item>


                                    <Form.Item
                                        label="负责人"
                                        name="master"
                                        rules={[
                                            {
                                                required: false,
                                                message: '请输入计划编码',
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder="负责人"
                                        >
                                            {
                                                useList && useList.map((item, index) => {
                                                    return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="状态"
                                        name="status"
                                        rules={[
                                            {
                                                required: true
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder="状态"
                                        >
                                            {
                                                statusList && statusList.map((item, index) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="startTime" label="计划日期" {...rangeConfig} >
                                        <RangePicker locale={locale} showTime />
                                    </Form.Item>
                                    <Form.Item
                                        label="计划描述"
                                        name="desc"
                                    >
                                        <Input placeholder="计划描述" />
                                    </Form.Item>
                                    <Form.Item {...formTailLayout} >
                                        <Button onClick={() => cancel()}>
                                            取消
                                        </Button>
                                        <Button htmlType="submit" type="primary" disabled={disable}>
                                            保存
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Panel>
                        <Panel header={stageDelete()} key="2">
                            <div className="stage-set-delete">
                                <div className="stage-set-icon-block">
                                    删除计划，包含计划与事项的关联关系
                                </div>

                                <div className="change-button delete-button" onClick={() => showModal()}>
                                    删除计划
                                </div>
                            </div>
                        </Panel>
                    </Collapse>

                </div>
                <div className="stage-delete-confirm">
                    <Modal
                        title="确定删除"
                        getContainer={false}
                        visible={isModalVisible}
                        closable={false} onOk={handleOk} onCancel={handleCancel} okText={"确定"} cancelText={"取消"}
                        okType="danger"
                        okButtonProps={{ type: "primary" }}
                    >
                        删除计划，包含计划与事项的关联关系
                    </Modal>
                </div>
                {/* <StageChangeModal
                    visible={stageChangeVisable}
                    projectId={projectId}
                    stageId={stageId}
                    StageBasicStore={StageBasicStore}
                    setVisible={setStageChangeVisable}
                    setStageInfo = {setStageInfo}
                    setDisabled = {setDisabled}
                    form={form}
                /> */}

            </Col>
        </Row >
    )
}

export default observer(StageBasicInfo);
