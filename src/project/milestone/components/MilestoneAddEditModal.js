/*
 * @Descripttion: 添加里程碑弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-16 16:51:43
 */

import React from "react";
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { PrivilegeProjectButton } from "thoughtware-privilege-ui";
import { observer, inject } from "mobx-react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import Button from "../../../common/button/Button";

const MilestoneAddEditModal = (props) => {
    //里程碑添加表单
    const [form] = Form.useForm();
    // 当前项目id
    const projectId = props.match.params.id;
    // 弹框显示
    const [visible, setVisible] = React.useState(false);
    // 解析props
    const { milestoneStore } = props;
    const { getUseList, uselist, addMilestone, editMilestoneById, searchMilestoneById } = milestoneStore;

    // 表单的宽度
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    };

    /**
     * 显示弹窗
     */
    const showModal = () => {
        setVisible(true);
        getUseList(projectId).then(res => {
            if(res.code === 0 && props.type === "add" && res.data.length > 0){
                form.setFieldsValue({
                    master: res.data[0]?.user?.id,
                })
            }
        })
        if (props.type === "edit") {
            searchMilestoneById(props.id).then((res) => {
                form.setFieldsValue({
                    name: res.name,
                    master: res.master.id,
                    milestoneTime: moment(res.milestoneTime, "YYYY-MM-DD"),
                    milestoneStatus: res.milestoneStatus
                })
            })
        }
    };

    /**
     * 提交表单
     */
    const onFinish = () => {
        form.validateFields().then((fieldsValue) => {
            let value = {
                ...fieldsValue,
                project: { id: projectId },
                master: {
                    id: fieldsValue.master
                },
                milestoneStatus: "0",
                milestoneTime: fieldsValue.milestoneTime.format("YYYY-MM-DD")
            }
            if (props.type === "add") {
                addMilestone(value).then(res=> {
                    if(res.code === 0){
                        form.resetFields()
                    }
                })
            } else {
                value.id = props.id
                editMilestoneById(value).then(res=> {
                    if(res.code === 0){
                        form.resetFields()
                    }
                })
            }
            setVisible(false);
        })
    };

    /**
     * 关闭表单，重置数据
     */
    const onFinishFailed = () => {
        form.resetFields();
        setVisible(false);
    };

    /**
      * 里程碑的状态 
      */
    const milestoneStatusList = [
        {
            id: "0",
            name: "未开始"
        },
        {
            id: "1",
            name: "进行中"
        },
        {
            id: "2",
            name: "已结束"
        }
    ]

    return (
        <div className="addmodel">
            {
                props.type !== "edit" ?
                    <PrivilegeProjectButton code={'MilestoneAdd'} disabled={"hidden"} domainId={projectId}  {...props}>
                        <Button type="primary" onClick={showModal}>
                            添加里程碑
                        </Button>
                    </PrivilegeProjectButton> :
                    <PrivilegeProjectButton code={'MilestoneEdit'} disabled={"hidden"} domainId={projectId}  {...props}>
                        <svg className="svg-icon" aria-hidden="true"
                            onClick={() => showModal()}
                            style={{ cursor: "pointer", marginRight: "16px" }}
                        >
                            <use xlinkHref="#icon-edit"></use>
                        </svg>
                    </PrivilegeProjectButton>
            }
            <Modal
                title={props.name}
                visible={visible}
                onOk={onFinish}
                onCancel={onFinishFailed}
                cancelText="取消"
                okText="确定"
                closable={false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="里程碑名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入里程碑名称',
                            },
                        ]}
                    >
                        <Input placeholder="请输入里程碑名称" />
                    </Form.Item>
                    <Form.Item
                        label="负责人"
                        name="master"
                        rules={[
                            {
                                required: false,
                                message: '请输入项目编码',
                            },
                        ]}
                    >
                        <Select
                            placeholder="负责人"
                            allowClear
                        >
                            {
                                uselist && uselist.map((item, index) => {
                                    return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    {
                        props.type !== "add" && <Form.Item
                            label="里程碑状态"
                            name="milestoneStatus"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入里程碑状态',
                                },
                            ]}
                        >
                            <Select
                                placeholder="里程碑状态"
                                allowClear
                            >
                                {
                                    milestoneStatusList && milestoneStatusList.map((item, index) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }
                    <Form.Item
                        name="milestoneTime"
                        label="计划日期"
                        rules={[
                            {
                                required: true,
                                message: '请输入里程碑计划日期',
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default inject("systemRoleStore", "milestoneStore")(observer(MilestoneAddEditModal));