/*
 * @Descripttion: 添加模块弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-05-08 16:32:40
 */

import React from "react";
import { Modal, Button,Form,Input } from 'antd';
import { PrivilegeProjectButton } from "doublekit-privilege-ui";

const ModuleAddmodal = (props) => {
    // form ref
    const [form] = Form.useForm();

    // 弹框显示
    const [visible, setVisible] = React.useState(false);

    // 解析props
    const {editModuleById,searchModuleById,addModule,projectid} = props;
    
    // 表单的宽度
    const layout = {
        labelCol: {
        span: 6,
        },
        wrapperCol: {
        span: 16,
        },
    };

    /**
     * 显示弹窗
     */
    const showModal = () => {
        setVisible(true);
        if(props.type === "edit"){
            searchModuleById(props.id).then((res)=> {
                form.setFieldsValue({
                    moduleName: res.moduleName,
                    id: res.id,
                    desc: res.desc
                })
            })
        }
    };

    /**
     * 提交表单
     */
    const onFinish = () => {
        form.validateFields().then((fieldsValue) => {
            fieldsValue.project={id:props.projectid};
            if(props.type ==="add"){
                addModule(fieldsValue)
            }else {
                fieldsValue.id= props.id
                editModuleById(fieldsValue)
            }
            setVisible(false);
        })
        
    };

    /**
     * 关闭表单，重置数据
     */
    const onFinishFailed = () => {
        form.resetFields();
        setVisible(false);
    };


    return (
        <div className="addmodel">
            {   
                props.type !== "edit"?
                <PrivilegeProjectButton code={'ModuleAdd'} disabled ={"hidden"} domainId={projectid}>
                    <Button type="primary" onClick={showModal}>
                        +{props.name}
                    </Button>
                </PrivilegeProjectButton>: 
                <PrivilegeProjectButton code={'ModuleEdit'} disabled ={"hidden"} domainId={projectid}>
                    <span onClick={showModal} className = "span-botton" >
                        {props.name}
                    </span>
                </PrivilegeProjectButton>
            }
            <Modal
                title={props.name}
                visible={visible}
                onOk={onFinish}
                onCancel={onFinishFailed}
                cancelText="取消"
                okText="确定"
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                >
                    <Form.Item
                        label="模块名称"
                        name="moduleName"
                        rules={[
                        {
                            required: true,
                            message: '请输入模块名称',
                        },
                        ]}
                    >
                        <Input placeholder= "请输入模块名称"/>
                    </Form.Item>
                    <Form.Item
                        label="模块描述"
                        name="desc"
                        rules={[
                        {
                            required: false,
                            message: '请输入模块描述',
                        },
                        ]}
                    >
                        <Input placeholder= "请输入模块描述"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModuleAddmodal;