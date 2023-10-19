/*
 * @Descripttion: 史诗添加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-18 18:28:57
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 09:18:04
 */
import React, { useEffect } from "react";
import { Modal, Select, DatePicker, Input, Form } from 'antd';
import { observer, inject } from "mobx-react";
const { RangePicker } = DatePicker;
import { withRouter } from "react-router";
const { TextArea } = Input;
const EpicAddModal = (props) => {
    const {showEpicAddModal, setShowEpicAddModal,epicStore, setEpicList, addChild, parent} = props;
    const {createEpic, uselist,getUseList, findEpicList} = epicStore
    const [form] = Form.useForm();
    // 项目id
    const projectId = props.match.params.id;
    // 表单布局
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 24,
        },
    };
    /**
     * 获取项目成员列表
     */
    useEffect(()=> {
        getUseList({projectId: projectId})
        return;
    },[])

    /**
     * 提交表单，添加或者编辑
     */
    const submitVersion = () => {
        form.validateFields().then((fieldsValue) => {
            const values = {
                ...fieldsValue,
                project: {id: projectId},
                master: {id: fieldsValue.master},
                startTime: fieldsValue.startTime[0].format('YYYY-MM-DD'),
                endTime: fieldsValue.startTime[1].format('YYYY-MM-DD')
            };
            if(addChild === "child"){
                values.parentEpic = {
                    id: parent
                }
            }
            createEpic(values).then(() => {
                // findVersion({ projectId: projectId })
                findEpicList({ projectId: projectId, epicParentNull: true }).then(res => {
                    if(res.code === 0){
                        setEpicList(res.data)
                    }
                })
                setShowEpicAddModal(false);
            })
        })

    }

    /**
     * 取消添加或者编辑
     */
    const onFinishFailed = () => {
        form.resetFields();
        setShowEpicAddModal(false);
    }

    // 状态类型
    const status = [
        {
            name: "未开始",
            id: "0"
        },
        {
            name: "进行中",
            id: "1"
        },
        {
            name: "已发布",
            id: "2"
        }
    ]

    return (
        <div className="addmodel">
            <Modal
                title={"添加需求集"}
                visible={showEpicAddModal}
                width={520}
                onOk={submitVersion}
                onCancel={onFinishFailed}
                cancelText="取消"
                okText="确定"
                closable={false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        project: projectId
                    }}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="需求集名称"
                        name="epicName"
                        rules={[
                            {
                                required: true,
                                message: '请输入需求集名称',
                            },
                        ]}
                    >
                        <Input placeholder="请输入需求集名称" />
                    </Form.Item>
                    <Form.Item
                        label="负责人"
                        name="master"
                        rules={[
                            {
                                required: true,
                                message: '请输入负责人',
                            },
                        ]}
                    >
                        <Select
                            placeholder="负责人"
                            allowClear
                        >   
                            {
                                uselist && uselist.map((item,index)=> {
                                    return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="需求集状态"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: '请选择需求集状态',
                            },
                        ]}
                    >
                        <Select
                            placeholder="需求集状态"
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
                        label="开始结束时间"
                        name="startTime"
                        rules={[
                            {
                                required: true,
                                message: '请选择起始日期',
                            }
                        ]}
                    >
                        <RangePicker />
                    </Form.Item>
                    <Form.Item
                        label="需求集描述"
                        name="desc"
                        rules={[
                        {
                            required: false,
                            message: '请输入需求集描述',
                        },
                        ]}
                    >
                        <TextArea rows={4}  maxLength={6} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};
export default withRouter(inject("epicStore")(observer(EpicAddModal)));