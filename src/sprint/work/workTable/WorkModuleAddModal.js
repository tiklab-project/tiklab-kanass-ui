import {observer} from "mobx-react";
import {withRouter} from "react-router";
import React,{useEffect, useState} from "react";
import {Form, Input, Modal} from "antd";

const WorkModuleAddModal = (props) => {
    const {moduleStore, moduleVisible, setModuleVisible, parentId, projectId} = props;
    const {createModule} = moduleStore
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [moduleVisible]);

    const handleOk = () => {
        const param = {
            moduleName: form.getFieldValue("moduleName"),
            parent: {
                id: parentId
            },
            project: {
                id: projectId
            }
        }
        console.log(param)
        createModule(param).then(res => {
            setModuleVisible(false);
        });

    }

    const handleCancel = () => {
        setModuleVisible(false);
    }

    return(
        <Modal
            title={"新增模块"}
            onOk={handleOk}
            onCancel={handleCancel}
            width={500}
            visible={moduleVisible}
        >
            <Form
                initialValues={{ remember: true }}
                form={form}
                className="module-add-form"
                layout="vertical"
                labelAlign="right"
            >
                <Form.Item
                    label="模块名称"
                    name="moduleName"
                    rules={[{ required: true, message: '请输入模块名称!' }]}
                >
                    <Input placeholder="模块名称" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default withRouter((observer(WorkModuleAddModal)));