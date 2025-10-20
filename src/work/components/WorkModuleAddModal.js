import {observer} from "mobx-react";
import {withRouter} from "react-router";
import React,{useEffect, useState} from "react";
import {Form, Input, message, Modal} from "antd";

const WorkModuleAddModal = (props) => {
    const {moduleStore, moduleVisible, setModuleVisible, parentId, projectId} = props;
    const {createModule} = moduleStore
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
    }, [moduleVisible]);

    const handleOk = () => {
        form.validateFields()
            .then(value => {
                const param = {
                    moduleName: value.moduleName,
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
            })
            .catch((errorInfo) => {
            // 显示具体错误信息
                if (errorInfo.errorFields){
                    console.log("表单验证失败",errorInfo.errorFields);
                }else {
                    message.error(`新增模块失败，请检查网络连接：${errorInfo}`);
                }
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