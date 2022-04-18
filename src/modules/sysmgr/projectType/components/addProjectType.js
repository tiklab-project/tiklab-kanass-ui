import React,{useState} from "react";
import { Modal, Button, Form, Input, Upload, Select,message } from 'antd';
import "./projectType.scss"
const { Option } = Select;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
};

const ProjectTypeAddmodal = (props) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const { addProjectList, findProjectTypeListById,
        editProjectList } = props;
    const showModal = () => {
        setVisible(true);
        if (props.type === "edit") {
            findProjectTypeListById(props.id).then((res) => {
                form.setFieldsValue({
                    name: res.name,
                    id: res.id,
                    desc: res.desc
                })
                // setIconUrl()
            })
        }
    };

    const onFinish = (values) => {
        const data = {...values}
        if (props.type === "add") {
            addProjectList(data)

        } else {
            data.id = props.id
            editProjectList(data )
        }
        setVisible(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };


    return (
        <>
            <div className="project-type-add">
                {
                    props.type !== "edit" ? <Button type="primary" onClick={showModal}>
                        +{props.name}
                    </Button> :
                        <Button
                            type="link"
                            onClick={showModal}
                        >
                            {props.name}
                        </Button>
                }
                <Modal
                    title="Title"
                    visible={visible}
                    footer={null}
                    onCancel={onCancel}
                    className="project-type-add-modal"
                >
                    <Form
                        {...layout}
                        name="name"
                        initialValues={{
                            group: "system"
                        }}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >

                        <Form.Item
                            label={`${props.typename}名称`}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入类型名称',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label={`${props.typename}描述`}
                            name="desc"
                            rules={[
                                {
                                    required: false,
                                    message: '请输入类型描述',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            <Button htmlType="button" onClick={onCancel}>
                                取消
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

        </>
    );
};

export default ProjectTypeAddmodal;