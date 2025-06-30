import {withRouter} from "react-router";
import {Button, Form, Input, Modal, Select, DatePicker} from "antd";
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import React from "react";

const EditProjectSetModal = (props) => {
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

    const projectSetLimits = [
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
            title={"编辑项目集"}
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
                    label="项目集名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '请输入项目集名称',
                        }
                    ]}
                >
                    <Input placeholder="项目集名称" />
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
                    label="可见范围"
                    name="projectSetLimits"
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
                            projectSetLimits.map((item, index) => {
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
                {/*<PrivilegeProjectButton code={'ProjectSetEdit'} domainId={projectSetId}  {...props}>*/}
                {/*    <Form.Item {...formTailLayout} >*/}
                {/*        <Button onClick={() => cancel()}>*/}
                {/*            取消*/}
                {/*        </Button>*/}
                {/*        <Button htmlType="submit" type="primary" disabled={disable}>*/}
                {/*            保存*/}
                {/*        </Button>*/}
                {/*    </Form.Item>*/}
                {/*</PrivilegeProjectButton>*/}

            </Form>
        </Modal>

    )
}

export default withRouter(EditProjectSetModal);