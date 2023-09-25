import React, { useState } from "react";
import { Modal, Form, Input, Upload, Select, message } from 'antd';
import Button from "../../../common/button/Button";
import "./ProjectType.scss"
const { Option } = Select;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};


const ProjectTypeAddModal = (props) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const { addProjectList, findProjectTypeListById,
        editProjectList, getProjectTypeList } = props;

    const [iconUrl, setIconUrl] = useState("")

    const iconList = [
        {
            iconUrl: "projectType1.png",
            key: "projectType1"
        },
        {
            iconUrl: "projectType2.png",
            key: "projectType2"
        }
    ]

    const showModal = () => {
        setVisible(true);
        if (props.type === "edit") {
            findProjectTypeListById(props.id).then((res) => {
                form.setFieldsValue({
                    name: res.name,
                    id: res.id,
                    desc: res.desc,
                    type: res.type
                })
                setIconUrl(res.iconUrl)
                // setIconUrl()
            })
        }
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            const data = { ...values, iconUrl: iconUrl }
            if (props.type === "add") {
                addProjectList(data).then(res => {
                    if (res.code === 0) {
                        getProjectTypeList()
                    }
                })

            } else {
                data.id = props.id
                editProjectList(data)
            }
            setVisible(false);
        })

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };


    return (
        <div className="project-type-add">
            {
                props.type !== "edit" ? <Button type="primary" onClick={showModal}>
                    {props.name}
                </Button> :
                    <svg className="svg-icon" aria-hidden="true" onClick={showModal} style={{ cursor: "pointer", marginRight: "16px" }}>
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
            }
            <Modal
                title="添加事项类型"
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                className="project-type-add-modal"
                closable={false}
            >
                <Form
                    {...layout}
                    name="name"
                    initialValues={{
                        group: "system"
                    }}
                    form={form}
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
                    <Form.Item
                        label="类型"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: '请选择类型',
                            },
                        ]}
                    >
                        <Select
                            placeholder="默认"
                            allowClear
                        >
                            <Select.Option value="scrum" key="scrum">敏捷</Select.Option>
                            <Select.Option value="nomal" key="nomal">普通</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="project-type-add-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div className={`project-type-add-icon ${item.iconUrl === iconUrl ? "icon-select" : null}`} key={item.id} onClick={() => { setIconUrl(item.iconUrl) }}>
                                        <img src={('/images/' + item.iconUrl)} alt="" className="img-icon-right" />
                                    </div>
                                })
                            }
                        </div>
                    </Form.Item>
                    {/* <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                            <Button htmlType="button" onClick={onCancel}>
                                取消
                            </Button>
                        </Form.Item> */}
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectTypeAddModal;