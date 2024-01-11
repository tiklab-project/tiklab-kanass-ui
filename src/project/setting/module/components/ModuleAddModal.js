/*
 * @Descripttion: 添加模块弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-05-08 16:32:40
 */

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, TreeSelect } from 'antd';
import { PrivilegeProjectButton } from "thoughtware-privilege-ui";
import { inject, observer } from "mobx-react";
import Button from "../../../../common/button/Button";
import ModuleStore from "../store/ModuleStore";
import { withRouter } from "react-router";
const { TreeNode } = TreeSelect;
const ModuleAddModal = (props) => {
    const { parent, type, visible, setVisible, modalName, id, modulelist } = props;
    const { createModule, searchModuleById, editModuleById } = ModuleStore;
    // form ref
    const [form] = Form.useForm();
    // const [parentId, setParentId] = useState(parent.id)

    // 弹框显示

    // 项目id
    const projectId = props.match.params.id;
    // 表单的宽度
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 24,
        },
    };


    useEffect(() => {
        if (visible) {
            if (type === "edit") {
                searchModuleById(id).then((res) => {
                    if (res.code === 0) {

                        form.setFieldsValue({
                            moduleName: res.data.moduleName,
                            id: res.data.id,
                            desc: res.data.desc,
                            parent: res.data.parent?.id || parent
                        })
                    }

                })
            }else {
                form.setFieldsValue({
                    parent: parent
                })
            }
        }
    }, [visible])

    /**
     * 提交表单
     */
    const onFinish = () => {
        form.validateFields().then((fieldsValue) => {
            console.log(fieldsValue)
            fieldsValue.project = { id: props.projectid };
            const params = {
                ...fieldsValue,
                project: { id: props.projectid },
                parent: {
                    id: fieldsValue.parent || "nullstring"
                }
            }
            if (props.type === "add") {
                createModule(params)

            } else {
                params.id = props.id
                editModuleById(params)
            }
            setVisible(false);
            form.resetFields();
        })

    };

    /**
     * 关闭表单，重置数据
     */
    const onFinishFailed = () => {
        form.resetFields();
        setVisible(false);
    };

    const moduleTree= (dataList)=>{
        return dataList?.map(item=> {
            if((item.id != id && type === "edit") || type === "add"){
               return item.children ?
                <TreeNode value={item.id} title={item.moduleName} key={item.id}>
                    {
                        moduleTree(item.children)
                    }
                </TreeNode>
                :
                <TreeNode value={item.id} title={item.moduleName} key={item.id}/> 
            }
            
        })
    }

    return (
        <div className="addmodel">
            {/* {
                props.type !== "edit" ?
                   
                    :
                    <PrivilegeProjectButton code={'ModuleEdit'} domainId={projectId}  {...props}>
                        <svg className="svg-icon" aria-hidden="true" onClick={showModal} style={{ cursor: "pointer" }}>
                            <use xlinkHref="#icon-edit"></use>
                        </svg>
                    </PrivilegeProjectButton>
            } */}
            <Modal
                title={modalName}
                visible={visible}
                onOk={onFinish}
                onCancel={onFinishFailed}
                cancelText="取消"
                okText="确定"
                closable={false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="上级模块"
                        name="parent"
                    >
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="选择上级模块"
                            allowClear
                            // value = {parentId}
                            // onChange={(value)=> setParentId(value)}
                            treeDefaultExpandAll
                        >   
                        {
                            moduleTree(modulelist)
                        }
                        </TreeSelect>
                    </Form.Item>
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
                        <Input placeholder="请输入模块名称" />
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
                        <Input placeholder="请输入模块描述" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default withRouter(observer(ModuleAddModal));