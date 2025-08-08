import React from 'react';
import {inject, observer} from "mobx-react";
import {Form, Input, Modal} from 'antd';
import funcUnitStepStore from "../store/funcUnitStepStore";
import IconBtn from "../../../common/iconBtn/IconBtn";

const { TextArea } = Input;

/**
 * 添加
 */
const FunctionStepEdit = (props) => {
    const {findList,type,funcUnitStore} = props
    const {createFuncUnitStep} = funcUnitStepStore;
    const {findFuncUnit} = funcUnitStore

    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const functionId = sessionStorage.getItem('functionId')

    /**
     * 展示添加项
     */
    const showModal = async () => {
        setVisible(true)
    };

    /**
     * 提交
     */
    const onFinish =async () => {
        let values =  await form.validateFields();
        values.funcUnitId=functionId

        await createFuncUnitStep(values)
        await findList();
        await findFuncUnit(functionId)

        setVisible(false)
    };

    const onCancel = () => { setVisible(false) };

    return (
        <>
            <IconBtn
                className="pi-icon-btn-grey"
                name={"添加步骤"}
                onClick={showModal}
            />
            <Modal
                destroyOnClose={true}
                title={type==="add"?"添加步骤":"编辑步骤"}
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                okText="提交"
                cancelText="取消"
                centered
                width={400}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    preserve={false}
                    layout={"vertical"}
                >
                    <Form.Item
                        label="描述"
                        rules={[{ required: true, message:"请添加名称" }]}
                        name="described"
                    >
                        <TextArea
                            placeholder="描述"
                            autoSize={{minRows:2,maxRows:4}}
                        />
                    </Form.Item>
                    <Form.Item
                        label="预期结果"
                        name="expect"
                    >
                        <TextArea
                            placeholder="预期结果"
                            autoSize={{minRows:2,maxRows:4}}
                        />
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label="实际结果"*/}
                    {/*    name="actual"*/}
                    {/*>*/}
                    {/*    <TextArea*/}
                    {/*        placeholder="预期结果"*/}
                    {/*        autoSize={{minRows:2,maxRows:4}}*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}
                </Form>
            </Modal>
        </>

    );
};

export default inject("funcUnitStore")(observer(FunctionStepEdit));
