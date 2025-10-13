import {DatePicker, Form, Input, Modal, Select} from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import {withRouter} from "react-router";
import React from "react";

const EditProductModal = (props) => {
    const {RangePicker} = DatePicker
    const {form, editModalVisible, onFinish, cancel, useList} = props

    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    // 周期
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: '选择计划时间!',
            }
        ]
    };

    const productLimits = [
        {
            name: "公共项目",
            id: "0"
        },
        {
            name: "私密项目",
            id: "1"
        }
    ]

    return(
        <Modal
            title={"编辑产品"}
            width={500}
            height={600}
            onOk={onFinish}
            onCancel={cancel}
            visible={editModalVisible}
        >
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    remember: true,
                }}
                form={form}
                labelAlign={"left"}
            >


                <Form.Item
                    label="产品名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '请输入产品名称',
                        }
                    ]}
                >
                    <Input placeholder="产品名称" />
                </Form.Item>


                <Form.Item
                    label="负责人"
                    name="master"
                    rules={[
                        {
                            required: true,
                            message: '请输入负责人',
                        }
                    ]}
                >
                    <Select
                        placeholder="负责人"
                    >
                        {
                            useList && useList.map((item, index) => {
                                return <Select.Option value={item.id} key={item.id}>{item.nickname}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"产品状态"}
                    name="status"
                    rules={[
                        {
                            required: true
                        }
                    ]}
                >
                    <Select
                        placeholder="产品状态"
                    >
                        <Select.Option value="0" key="0">未开始</Select.Option>
                        <Select.Option value="1" key="1">进行中</Select.Option>
                        <Select.Option value="2" key="2">已结束</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="可见范围"
                    name="productLimits"
                    rules={[
                        {
                            required: true
                        }
                    ]}
                >
                    <Select
                        placeholder="可见范围"
                    >
                        {
                            productLimits.map((item, index) => {
                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="startTime" label="计划日期" {...rangeConfig} >
                    <RangePicker locale={locale} />
                </Form.Item>
                <Form.Item
                    label="产品描述"
                    name="remark"
                >
                    <Input placeholder="产品描述" />
                </Form.Item>
            </Form>
        </Modal>

    )
}
export default withRouter(EditProductModal);