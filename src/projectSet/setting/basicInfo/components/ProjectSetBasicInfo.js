/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-08 09:24:33
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Input, Form, Select, DatePicker, Button, Modal, Row, Col } from "antd";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import "../components/ProjectSetBasicInfo.scss";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import ProjectSetIcon from "./changeProjectSetIcon";
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { Collapse } from 'antd';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const ProjectSetBasicInfo = props => {
    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 12,
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
    const projectSetId = props.match.params.projectSetId;
    const { projectSetStore } = props;

    const { deleProjectSet, updateProjectSet, findProjectSet, getUseList, uselist } = projectSetStore;
    const [disable, setDisabled] = useState(true);
    const [iconUrl, setIconUrl] = useState();
    const [visible, setVisible] = useState(false);
    const [projectSetInfo, setprojectSetInfo] = useState()
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
        getUseList()
        return;
    }, [])

    const info = () => {
        findProjectSet(projectSetId).then((response) => {
            const time = response["startTime"]
            if (response.code === 0) {
                const data = response.data;
                setprojectSetInfo(data)
                setIconUrl(data.iconUrl)
                form.setFieldsValue({
                    name: data.name,
                    remark: data.remark,
                    master: data.master.id,
                    startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                })
            }

        })
    };

    const cancel = () => {
        form.setFieldsValue({
            name: projectSetInfo.name,
            remark: projectSetInfo.remark,
            master: projectSetInfo.master.id,
            startTime: [moment(projectSetInfo.startTime, dateFormat), moment(projectSetInfo.endTime, dateFormat)]
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
                id: projectSetId
            }

            updateProjectSet(data);
            // setVisible(false);
        })
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        deleProjectSet(projectSetId).then(response => {
            if (response.code === 0) {
                props.history.push("/index/projectSetList")
            }
        })
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const projectSetInfoDesc = () => (
        <div>
            <div className="projectSet-info-title">
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use xlinkHref="#icon-projectDetail"></use>
                </svg>
                项目集信息
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon" fill="#fff">
                    <use></use>
                </svg>
                项目集图标信息，可见范围，负责人等信息，可点击修改</div>
        </div>
    );
    
    const projectSetDelete = () => (
        <div>
            <div className="projectSet-info-title">
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
                <div className="projectSet-set-basicinfo">
                    <Breadcumb
                        firstText="项目集信息"
                    />
                    <Collapse expandIconPosition={"right"}>
                        <Panel header={projectSetInfoDesc()} key="1" >
                            <div className="projectSet-set-icon">
                                <div className="projectSet-set-icon-block">
                                    <div>
                                        {
                                            iconUrl ?
                                                <img
                                                    src={('/images/' + iconUrl)}
                                                    alt="" width={60} height={60}
                                                />
                                                :
                                                <img
                                                    src={('images/project1.png')}
                                                    alt="" width={60} height={60}
                                                />
                                        }
                                        <span>项目集图标，可点击更改按钮修改icon</span>
                                    </div>
                                    <PrivilegeProjectButton code={'ProjectSetEdit'} domainId={projectSetId}  {...props}>
                                        <div className="change-botton" onClick={() => setVisible(true)}>
                                            更改图标
                                        </div>
                                    </PrivilegeProjectButton>

                                </div>
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
                                        label="项目集名称"
                                        name="name"
                                    >
                                        <Input placeholder="项目集名称" />
                                    </Form.Item>


                                    <Form.Item
                                        label="负责人"
                                        name="master"
                                        rules={[
                                            {
                                                required: false,
                                                message: '请输入项目集编码',
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
                                        label="项目集描述"
                                        name="remark"
                                    >
                                        <Input placeholder="项目集描述" />
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
                        <Panel header={projectSetDelete()} key="2" >
                            <div className="projectSet-set-icon">
                                <div className="projectSet-set-icon-block">
                                    <div>

                                        <span>此项目集及其事务、组件、附件和版本将在回收站中保留 60 天，之后将被永久删除。</span>
                                    </div>
                                    <PrivilegeProjectButton code={'ProjectSetDelete'} domainId={projectSetId}  {...props}>
                                        <div className="change-botton" onClick={() => showModal()}>
                                            删除项目集
                                        </div>
                                    </PrivilegeProjectButton>

                                </div>
                            </div>
                        </Panel>
                    </Collapse>



                </div>
                <Modal title="是否删除" visible={isModalVisible} closable={false} onOk={handleOk} onCancel={handleCancel} okText={"确定"} cancelText={"取消"}>
                    此项目集及其事务、组件、附件和版本将在回收站中保留 60 天，之后将被永久删除。
                </Modal>
                <ProjectSetIcon
                    visible={visible}
                    setVisible={setVisible}
                    updateprojectSet={updateProjectSet}
                    setIconUrl={setIconUrl}
                />
            </Col>
        </Row>
    )
}

export default inject("projectStore", "projectSetStore")(observer(ProjectSetBasicInfo));
