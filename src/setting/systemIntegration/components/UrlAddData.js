import React, { Fragment, useEffect } from "react";
import { Modal, Form, Input } from 'antd';
import { observer, inject } from "mobx-react";

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 16,
    },
};

const UrlAddData = (props) => {
    const [form] = Form.useForm();
    const {
        urlAddvisible,
        setUrlAddvisible,
        urlDataStore,
        modalTitle,
        setUrlDataList,
        actionType,
        urlId,
        selectedSystem
    } = props;

    const {
        createSystemUrl,
        findAllSystemUrl,
        findSystemUrl,
        updateSystemUrl
    } = urlDataStore;

    // 编辑模式下获取数据
    useEffect(() => {
        if (actionType === "edit" && urlId) {
            const params = new FormData();
            params.append("id", urlId);
            findSystemUrl(params).then(res => {
                if (res.code === 0) {
                    const data = res.data;
                    form.setFieldsValue({
                        systemUrl: data.systemUrl,
                        webUrl: data.webUrl || ""
                    });
                }
            });
        } else if (actionType === "add" && selectedSystem) {
            form.setFieldsValue({
                name: selectedSystem
            });
        }
    }, [urlId, actionType, form, findSystemUrl, selectedSystem]);

    const onFinish = () => {
        form.validateFields().then((values) => {
            // 确保表单中包含系统名称
            if (!values.name && selectedSystem) {
                values.name = selectedSystem;
            }

            if (actionType === "add") {
                createSystemUrl(values).then(res => {
                    if (res.code === 0) {
                        refreshDataAndCleanup();
                    }
                });
            } else if (actionType === "edit") {
                values.id = urlId;
                updateSystemUrl(values).then(res => {
                    if (res.code === 0) {
                        refreshDataAndCleanup();
                    }
                });
            }
        });
    };

    // 刷新数据并清理表单
    const refreshDataAndCleanup = () => {
        findAllSystemUrl().then(data => {
            if (data.code === 0) {
                setUrlDataList(data.data);
                form.resetFields();
                setUrlAddvisible(false);
            }
        });
    };

    const onCancel = () => {
        form.resetFields();
        setUrlAddvisible(false);
    };

    return (
        <Fragment>
            <Modal
                title={modalTitle}
                visible={urlAddvisible}
                onCancel={onCancel}
                onOk={onFinish}
                closable={false}
                destroyOnClose
            >
                <Form
                    {...layout}
                    name="urlForm"
                    form={form}
                    preserve={false}
                    initialValues={{
                        name: selectedSystem || ""
                    }}
                >
                    <Form.Item
                        name="name"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="系统地址"
                        name="systemUrl"
                        rules={[
                            {
                                required: true,
                                message: '请输入系统地址',
                            },
                            {
                                pattern: new RegExp(/^(https:\/\/|http:\/\/)/, "g"),
                                message: '请输入正确网址'
                            }
                        ]}
                    >
                        <Input placeholder="以http://或https://开头" />
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*    label="浏览器端地址"*/}
                    {/*    name="webUrl"*/}
                    {/*    rules={[*/}
                    {/*        {*/}
                    {/*            pattern: new RegExp(/^(https:\/\/|http:\/\/)/, "g"),*/}
                    {/*            message: '请输入正确网址'*/}
                    {/*        }*/}
                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <Input placeholder="以http://或https://开头（可选）" />*/}
                    {/*</Form.Item>*/}
                </Form>
            </Modal>
        </Fragment>
    );
};

export default inject("urlDataStore")(observer(UrlAddData));