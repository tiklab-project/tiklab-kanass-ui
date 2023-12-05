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
import "./VersionBasicInfo.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";

import { Collapse } from 'antd';
import VersionBasicStore from "../store/VersionBasicStore";
const { Panel } = Collapse;

const { RangePicker } = DatePicker;
const VersionBasicInfo = props => {
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
    const versionId = props.match.params.version;
    const projectId = props.match.params.id;
    const { deleteVersion, updateVersion, findVersion, getUseList, useList, status, findAllVersionState } = VersionBasicStore;
    const [disable, setDisabled] = useState(true);
    const [versionInfo, setVersionInfo] = useState();
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
    const dateFormat = 'YYYY/MM/DD';

    useEffect(() => {

        info()
        getUseList(projectId)
        findAllVersionState()
        return;
    }, [])
    const info = () => {
        findVersion(versionId).then((response) => {
            if (response.code === 0) {
                const data = response.data;
                setVersionInfo(data)
                form.setFieldsValue({
                    name: data.name,
                    versionState: data.versionState.id,
                    master: data.master.id,
                    startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                })
            }

        })
    };

    const cancel = () => {
        form.setFieldsValue({
            name: versionInfo.name,
            versionState: versionInfo.versionState.id,
            master: versionInfo.master.id,
            startTime: [moment(versionInfo.startTime, dateFormat), moment(versionInfo.endTime, dateFormat)]
        })
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: { id: values.master },
                versionState: {
                    id: values.versionState
                },
                id: versionId
            }
            updateVersion(data).then(res => {
                if(res.code === 0){
                    message.success("修改成功");
                    setDisabled(true);
                }
            });
        })
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        confirmForm.validateFields().then((fieldsValue) => {
            deleteVersion(versionId).then(response => {
                if (response.code === 0) {
                    message.success('删除成功');
                    setIsModalVisible(false);
                    props.history.push(`/projectDetail/${projectId}/version`)
                }
            })
            
        })

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const versionInfoDesc = () => (
        <div>
            <div className="version-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-versionDetail"></use>
                </svg>
                版本信息
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                版本图标信息，可见范围，负责人等信息，可点击修改</div>
        </div>
    );


    const versionDelete = () => (
        <div>
            <div className="version-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-versionDelete"></use>
                </svg>
                删除版本
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                删除版本
            </div>
        </div>
    );
    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="version-set-basicinfo">
                    <Breadcumb
                        firstText="版本信息"
                    />

                    <Collapse expandIconPosition={"right"}>
                        <Panel header={versionInfoDesc()} key="1" >
                            <div className="version-set-icon">
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
                                    // onValuesChange={onFinish}
                                >
                                    <Form.Item
                                        label="版本名称"
                                        name="name"
                                    >
                                        <Input placeholder="版本名称" />
                                    </Form.Item>
                                    <Form.Item
                                        label="版本状态"
                                        name="versionState"
                                    >
                                        <Select
                                            placeholder="版本状态"
                                            allowClear
                                        >
                                            {
                                                status && status.map((item, index) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="负责人"
                                        name="master"
                                        rules={[
                                            {
                                                required: false,
                                                message: '请输入版本编码',
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder="负责人"
                                            allowClear
                                        >
                                            {
                                                useList && useList.map((item, index) => {
                                                    return <Select.Option value={item.user.id} key={item.user.id}>{item.user.nickname}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="startTime" label="计划日期" {...rangeConfig} >
                                        <RangePicker locale={locale} />
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
                        <Panel header={versionDelete()} key="2">
                            <div className="version-set-delete">
                                <div className="version-set-icon-block">
                                    删除版本，包含版本与事项的关联关系，等
                                </div>

                                <div className="change-botton" onClick={() => showModal()}>
                                    删除版本
                                </div>
                            </div>
                        </Panel>
                    </Collapse>

                </div>
                <div className="version-delete-confirm">
                    <Modal title="确定删除" getContainer = {false} visible={isModalVisible} closable={false} onOk={handleOk} onCancel={handleCancel} okText={"确定"} cancelText={"取消"}>
                        删除版本，包含版本与事项的关联关系
                    </Modal>
                </div>
            </Col>
        </Row >
    )
}

export default observer(VersionBasicInfo);
