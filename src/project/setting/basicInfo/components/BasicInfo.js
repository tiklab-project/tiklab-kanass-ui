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
import "../components/BasicInfo.scss";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import ProjectIconChange from "./ProjectIconChange"
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { Collapse } from 'antd';
import { getUser } from "tiklab-core-ui";
import setImageUrl from "../../../../common/utils/setImageUrl";
const { Panel } = Collapse;

const { RangePicker } = DatePicker;
const BasicInfo = props => {
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
    const projectId = props.match.params.id;
    const { projectStore } = props;
    const { deleproList, updateProject, searchpro, projectTypelist,
        getProjectTypeList, getUseList, uselist } = projectStore;
    const [disable, setDisabled] = useState(true);
    const [iconUrl, setIconUrl] = useState();
    const [visible, setVisible] = useState(false);
    const [projectInfo, setProjectInfo] = useState();
    const tenant = getUser().tenant;
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
        getProjectTypeList()
        getUseList()
        return;
    }, [])
    const info = () => {
        searchpro(projectId).then((response) => {
            const time = response["startTime"]
            if (response.code === 0) {
                const data = response.data;
                setProjectInfo(data)
                setIconUrl(data.iconUrl)
                form.setFieldsValue({
                    projectName: data.projectName,
                    projectType: data.projectType.id,
                    desc: data.desc,
                    projectState: data.projectState,
                    master: data.master.id,
                    startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                })
            }

        })
    };

    const cancel = () => {
        form.setFieldsValue({
            projectName: projectInfo.projectName,
            projectType: projectInfo.projectType.id,
            desc: projectInfo.desc,
            projectState: projectInfo.projectState,
            master: projectInfo.master.id,
            startTime: [moment(projectInfo.startTime, dateFormat), moment(projectInfo.endTime, dateFormat)]
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
                projectType: {
                    id: values.projectType
                },
                id: projectId,
                iconUrl: iconUrl
            }

            // if (props.type === "add") {
            //     addProlist(data)
            // } else {
            //     updateProject(data)
            // }
            updateProject(data);
            // setVisible(false);
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
        confirmForm.validateFields().then((fieldsValue) => {
            deleproList(projectId).then(response => {
                if (response.code === 0) {
                    message.success('删除成功');
                    setIsModalVisible(false);
                    props.history.push("/index/project")
                }
            })
            
        })

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const projectInfoDesc = () => (
        <div>
            <div className="project-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-projectDetail"></use>
                </svg>
                项目信息
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                项目图标信息，可见范围，负责人等信息，可点击修改</div>
        </div>
    );

    const [confirmProjectName, setConfirmProjectName] = useState();

    const projectDelete = () => (
        <div>
            <div className="project-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-projectDelete"></use>
                </svg>
                删除项目
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                删除项目
            </div>
        </div>
    );
    return (
        <Row>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="project-set-basicinfo">
                    <Breadcumb
                        firstText="项目信息"
                    />

                    <Collapse expandIconPosition={"right"}>
                        <Panel header={projectInfoDesc()} key="1" >
                            <div className="project-set-icon">
                                <Form.Item
                                    label="项目图标"
                                    className="project-form-icon"
                                    {...layout}
                                    labelAlign="left"
                                >
                                    <div className="project-form-icon-content">
                                        <div>
                                            {
                                                iconUrl ? <Fragment>
                                                    <img src={setImageUrl(iconUrl)} alt="" width={60} height={60} />
                                                </Fragment>

                                                    :
                                                    <img
                                                        src={('images/project1.png')}
                                                        alt="" width={60} height={60}
                                                    />
                                            }
                                            <span>项目图标，可点击更改按钮修改icon</span>
                                        </div>

                                        <PrivilegeProjectButton code={'ProjectEdit'} domainId={projectId}  {...props}>
                                            <div className="change-botton" onClick={() => setVisible(true)}>
                                                更改图标
                                            </div>
                                        </PrivilegeProjectButton>
                                    </div>
                                </Form.Item>

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
                                    onValuesChange={onFinish}
                                >
                                    <Form.Item
                                        label="项目名称"
                                        name="projectName"
                                    >
                                        <Input placeholder="项目名称" />
                                    </Form.Item>
                                    <Form.Item
                                        label="项目类型"
                                        name="projectType"
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
                                    >
                                        <Input placeholder="项目描述" />
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
                        <Panel header={projectDelete()} key="2">
                            <div className="project-set-delete">
                                <div className="project-set-icon-block">
                                    此项目及其事务、组件、附件和版本将在回收站中保留 60 天，之后将被永久删除。
                                </div>

                                <PrivilegeProjectButton code={'ProjectDelete'} domainId={projectId}  {...props}>
                                    <div className="change-botton" onClick={() => showModal()}>
                                        删除项目
                                    </div>
                                </PrivilegeProjectButton>
                            </div>
                        </Panel>
                    </Collapse>

                </div>
                <div className="project-delete-confirm">
                    <Modal title="确定删除" getContainer = {false} visible={isModalVisible} closable={false} onOk={handleOk} onCancel={handleCancel} okText={"确定"} cancelText={"取消"}>
                        <Alert message=" 此项目及其事务、组件、附件和版本将被永久删除" type="error" showIcon />

                        <Form
                            form={confirmForm}
                            name="dependencies"
                            autoComplete="off"
                            style={{
                                maxWidth: 600,
                            }}
                            layout="vertical"
                        >


                            <Form.Item
                                label="项目名称"
                                name="confirmProjectName"
                                rules={[
                                    {
                                        required: true,
                                        message: `请输入项目名称`,
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            //getFieldValue可以获得其他输入框的内容
                                            if (projectInfo?.projectName !== value) return Promise.reject(`请输入${projectInfo?.projectName}`);
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <Input value={confirmProjectName} onChange={(value) => setConfirmProjectName(value.target.value)} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>

                <ProjectIconChange
                    visible={visible}
                    setVisible={setVisible}
                    updateProject={updateProject}
                    setIconUrl={setIconUrl}
                />

            </Col>
        </Row >
    )
}

export default inject("projectStore")(observer(BasicInfo));
