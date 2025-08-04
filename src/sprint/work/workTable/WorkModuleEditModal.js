import {observer} from "mobx-react";
import {withRouter} from "react-router";
import React,{useEffect, useState} from "react";
import {Form, Input, Modal} from "antd";

const WorkModuleEditModal = (props) => {
    const {moduleStore, moduleVisible, setModuleVisible, selectTreeData, moduleInfo} = props;
    const {editModuleById} = moduleStore
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({moduleName: moduleInfo.moduleName});
    }, [moduleVisible]);

    const handleOk = () => {
        const param = {
            moduleName: form.getFieldValue("moduleName"),
            project:{
                id: moduleInfo.project.id
            },
            parentId:{
                id: moduleInfo.parent?.id
            },
            id: moduleInfo.id
        }
        editModuleById(param).then(res => {
            setModuleVisible(false);
            selectTreeData()
        });

    }

    const handleCancel = () => {
        setModuleVisible(false);
    }

    return(
        <Modal
            title={"编辑模块"}
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

export default withRouter((observer(WorkModuleEditModal)));