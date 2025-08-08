import React, { useState } from 'react';
import { observer, inject } from "mobx-react";
import {Modal, Form, Input, Button, Tooltip} from 'antd';
import IconCommon from "../../../common/caseCommon/IconCommon";

/**
 * 目录的编辑与添加
 */
const CategoryEdit =(props)=>{
    const { categoryStore,categoryId } = props;
    const {
        findCategory,
        createCategory,
        updateCategory,
    } = categoryStore;

    const [visible, setVisible] = useState(false);

    const [form] = Form.useForm();

    const [curCategoryId, setCurCategoryId] = useState();

    const projectId = localStorage.getItem('projectId');

    /**
     * 弹框展示
     */
    const showModal = async () => {
        if(props.type === "edit"){
            let res = await findCategory(categoryId)
            form.setFieldsValue({ name: res.name })

            setCurCategoryId(res.id)
        }

        setVisible(true);
    };

    /**
     * 收起弹框
     */
    const hideModal = () => {setVisible(false)};

    /**
     * 弹框提交
     */
    const onFinish = async () => {
        let values = await form.validateFields();
        values.repository = { id:projectId }

        if(props.type === 'edit'){
            values.id=curCategoryId
            updateCategory(values).then(()=>{
                props.findList(projectId)
            });
        }else{
            values.parentId = categoryId
            createCategory(values).then(()=>{
                props.findList(projectId)
            });
        }

        setVisible(false)
    };


    /**
     * 展示组件
     */
    const showEditView = () =>{

        if(props.children){
            return(
                <Tooltip title="添加子模块">
                    <div>
                        <IconCommon
                            icon={"xinzeng"}
                            className={"icon-s edit-icon"}
                            onClick={showModal}
                        />
                    </div>
                </Tooltip>
            )
        }

        if(props.type==="edit"){
            return(
                <IconCommon
                    icon={"bianji11"}
                    className={"icon-s edit-icon"}
                    onClick={showModal}
                />
            )
        }

        if(props.icon){
            return(
                <IconCommon
                    icon={"xinzeng"}
                    className={"icon-m edit-icon"}
                    onClick={showModal}
                />
            )
        }

        return(
            <Button
                className={"important-btn"}
                onClick={showModal}
                type="primary"
            >
                {props.name}
            </Button>
        )
    }

    return(
        <>
            {showEditView()}
            <Modal
                title={props.type==="edit"?"编辑":"添加"}
                visible={visible}
                onCancel={hideModal}
                destroyOnClose={true}
                onOk={onFinish}
                okText="提交"
                cancelText="取消"
                centered
                maskClosable={false}
            >
                <Form
                    form={form}
                    preserve={false}
                    onFinish={onFinish}
                    layout={"vertical"}
                >
                    <Form.Item
                        label="目录名称"
                        name="name"
                        rules={[{ required: true, message: '请输入目录名称!' }]}
                        placeholder="请输入名称"
                    >
                        <Input autoComplete="off"/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )

}

export default inject('categoryStore')(observer(CategoryEdit));
