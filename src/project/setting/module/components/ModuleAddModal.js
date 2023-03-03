/*
 * @Descripttion: 添加模块弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-05-08 16:32:40
 */

import React from "react";
import { Modal, Form,Input } from 'antd';
import { PrivilegeProjectButton } from "tiklab-privilege-ui";
import { inject, observer } from "mobx-react";
import Button from "../../../../common/button/Button";
import { withRouter } from "react-router";

const ModuleAddModal = (props) => {
    // form ref
    const [form] = Form.useForm();

    // 弹框显示
    const [visible, setVisible] = React.useState(false);
    // 项目id
    const projectId = props.match.params.id;
    // 解析props
    const {editModuleById,searchModuleById,addModule} = props;
    // 表单的宽度
    const layout = {
        labelCol: {
        span: 6,
        },
        wrapperCol: {
        span: 24,
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
                <PrivilegeProjectButton code={'ModuleAdd'} domainId={projectId}  {...props}>
                    <Button type="primary" onClick={showModal}>
                        +{props.name}
                    </Button>
                </PrivilegeProjectButton>
                : 
                <PrivilegeProjectButton code={'ModuleEdit'} domainId={projectId}  {...props}>
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
                closable = {false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    layout = "vertical"
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

export default withRouter(inject("systemRoleStore")(observer(ModuleAddModal)));