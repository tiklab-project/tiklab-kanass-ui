import React, { Fragment,useState } from "react";
import { Modal, Form,Input,Radio,Select } from 'antd';
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
    const {urlAddvisible, setUrlAddvisible, urlDataStore, modalTitle, setUrlDataList} = props;
    const { createSystemUrl, findAllSystemUrl } = urlDataStore;
    const  urlReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    const  ipReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([0-9]))\.){2}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))$/

    const onFinish = () => {
        form.validateFields().then((values) => {
            if(props.actionType ==="add"){
                createSystemUrl(values).then(res => {
                    if(res.code === 0){
                        findAllSystemUrl().then(data => {
                            if(data.code === 0){
                                setUrlDataList(data.data)
                            }
                        })
                    }
                })
                
            }else {
                // data.id= props.id
                // editWorkPriorityList(data)
            }
            setUrlAddvisible(false);
        })
        
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        form.resetFields();
        setUrlAddvisible(false);
    };

    return (
        <>
        <Fragment>
            <Modal
                title={modalTitle}
                visible={urlAddvisible}
                onCancel={onCancel}
                onOk={onFinish}
                closable = {false}
            >
                <Form
                    {...layout}
                    name="basic"
                    form={form}
                    onFinishFailed={onFinishFailed}
                >

                    <Form.Item
                        label={"系统名称"}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入系统名称',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={"系统地址"}
                        name="systemUrl"
                        rules={[
                        {
                            required: true,
                            message: '请输入系统地址',
                        },
                        {   
                            pattern: new RegExp(/^(https:\/\/|http:\/\/)/, "g") , 
                            message: '请输入正确网址'
                        } 
                        ]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </Fragment>
        
        </>
    );
};

export default inject("urlDataStore")(observer(UrlAddData));