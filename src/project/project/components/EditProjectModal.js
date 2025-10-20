import React from "react";
import {Button, Form, Input, Modal, Select, DatePicker, Spin} from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";


const EditProjectModal = (props) => {
    const { RangePicker } = DatePicker
    const {modalVisible, onFinish, cancel, form, projectTypeList, projectLimits, status, dmUser, rangeConfig, loading} = props;
    // const [form] = Form.useForm();
    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    return (
        <Modal
            title={"编辑项目"}
            visible={modalVisible}
            width={500}
            height={700}
            onOk={onFinish}
            onCancel={cancel}
        >
            <Spin spinning={loading}>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    // onFinish={onFinish}
                    labelAlign={"left"}
                >
                    <Form.Item
                        label="项目名称"
                        name="projectName"
                        rules={[
                            {
                                required: true,
                                message: '项目名称不能为空！',
                            },
                            {
                                max: 50, // 假设最大长度为50字符
                                message: '项目名称不能超过50个字符！',
                            },
                            {
                                pattern: /^[\w\s\u4e00-\u9fa5]+$/, // 限制为中英文、数字、空格
                                message: '只能使用中英文、数字和空格！',
                            },
                        ]}
                    >
                        <Input placeholder="项目名称" />
                    </Form.Item>
                    <Form.Item
                        label="项目类型"
                        name="projectType"
                    >
                        <Select
                            placeholder="项目类型"
                            disabled
                            allowClear
                        >
                            {
                                projectTypeList && projectTypeList.map((item, index) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="可见范围"
                        name="projectLimits"
                    >
                        <Select
                            placeholder="可见范围"
                            allowClear
                        >
                            {
                                projectLimits.map((item, index) => {
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
                                dmUser && dmUser.map((item, index) => {
                                    return <Select.Option value={item.user.id} key={item.user.id}>{item.user.nickname ? item.user.nickname : item.user.name}</Select.Option>
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
                    {/*<PrivilegeProjectButton code={'ProjectEdit'} domainId={projectId}  {...props}>*/}
                    {/*    <Form.Item {...formTailLayout} >*/}
                    {/*        <Button onClick={() => cancel()}>*/}
                    {/*            取消*/}
                    {/*        </Button>*/}
                    {/*        /!*<Button htmlType="submit" type="primary" disabled={disable}>*/}
                    {/*                                保存*/}
                    {/*                            </Button>*!/*/}
                    {/*        <Button*/}
                    {/*            htmlType="submit"*/}
                    {/*            type="primary"*/}
                    {/*            disabled={*/}
                    {/*                form.getFieldsError().some(field => field.errors.length > 0) ||*/}
                    {/*                form.getFieldValue('projectName')?.length > 50*/}
                    {/*            }*/}
                    {/*        >*/}
                    {/*            保存*/}
                    {/*        </Button>*/}
                    {/*    </Form.Item>*/}
                    {/*</PrivilegeProjectButton>*/}

                </Form>
            </Spin>

        </Modal>
    )
}

export default EditProjectModal;