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
import { Breadcrumb, Input, Form, Select, DatePicker, Divider, Button,Modal } from "antd";
import project from "../../../../assets/images/projectSet.png";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import "../components/basicInfo.scss"
const { RangePicker } = DatePicker;
const BasicInfo = props => {
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const [form] = Form.useForm();
    const projectId = localStorage.getItem("projectId");
    const { proStore } = props;
    const {  deleproList, updateProject,searchpro, projectTypelist, getProjectTypeList, getUseList, uselist} = proStore;
    const [disable, setDisabled] = useState(true)
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
    }, [])
    const info = () => {
        getProjectTypeList()
        getUseList()
        searchpro(projectId).then((response) => {
            const time = response["startTime"]
            form.setFieldsValue({
                projectName: response.projectName,
                projectType: response.projectType.id,
                desc: response.desc,
                projectState: response.projectState,
                startTime: [moment(response.startTime, dateFormat), moment(response.endTime, dateFormat)]
            })
            // setProjectId(response.id)
            if (response.master) {
                form.setFieldsValue({
                    master: response.master.id,
                })
            }

        })
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                id: projectId
            }

            // if (props.type === "add") {
            //     addProlist(data)
            // } else {
            //     updateProject(data)
            // }
            updateProject(data);
            setVisible(false);
        })
    }
    // 状态类型
    const status = [
        {
            name: "未开始",
            id: "1"
        },
        {
            name: "进行中",
            id: "2"
        },
        {
            name: "已结束",
            id: "3"
        }
    ]
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        deleproList(projectId).then(response => {
            if(response.code === 0){
                props.history.push("/index/project")
            }
        })
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div className="project-set-basicinfo">
            <div className="project-set-head">
                <Breadcrumb>
                    <Breadcrumb.Item>项目管理</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/">项目详情</a>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <span className="project-set-delete" onClick={()=>showModal()}>删除</span>
            </div>

            <Divider />
            <div className="project-info">
                <img src={project} alt="" width="100px" height="100px" className="project-icon" />
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    onFinish={onFinish}
                    onFieldsChange={() => setDisabled(false)}
                >
                    <Form.Item
                        label="项目名称"
                        name="projectName"

                    // rules={[
                    //     {
                    //         required: true,
                    //         message: '请输入项目名称',
                    //     },
                    // ]}
                    >
                        <Input placeholder="项目名称" />
                    </Form.Item>
                    <Form.Item
                        label="项目类型"
                        name="projectType"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: '请输入项目编码',
                    //     },
                    // ]}
                    >
                        <Select
                            placeholder="项目类型"
                            allowClear
                        >
                            {
                                projectTypelist && projectTypelist.map((item, index) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="项目状态"
                        name="projectState"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: '请选择项目状态',
                    //     },
                    // ]}
                    >
                        <Select
                            placeholder="项目状态"
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
                                message: '请输入项目编码',
                            }
                        ]}
                    >
                        <Select
                            placeholder="负责人"
                            allowClear
                        >
                            {
                                uselist && uselist.map((item, index) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="startTime" label="计划日期" {...rangeConfig} >
                        <RangePicker locale={locale} />
                    </Form.Item>
                    <Form.Item
                        label="项目描述"
                        name="desc"
                    // rules={[
                    //     {
                    //         required: false,
                    //         message: '请输入项目描述',
                    //     },
                    // ]}
                    >
                        <Input placeholder="项目描述" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
                        <Button type="primary" htmlType="submit" disabled={disable}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Modal title="是否删除" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                此项目及其事务、组件、附件和版本将在回收站中保留 60 天，之后将被永久删除。
            </Modal>
        </div>
    )
}

export default inject("proStore")(observer(BasicInfo));
