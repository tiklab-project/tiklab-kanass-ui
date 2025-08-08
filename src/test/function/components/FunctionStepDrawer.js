import React, {useEffect, useState} from "react";
import {Button, Drawer, Form, Space,Input} from "antd";
import {observer} from "mobx-react";
import IconBtn from "../../../common/iconBtn/IconBtn";
import funcUnitStepStore from "../store/funcUnitStepStore";
import IconCommon from "../../../common/IconCommon";
import {messageFn} from "../../../common/messageCommon/MessageCommon";

const {TextArea} = Input

const tailLayout = {
    wrapperCol: {
        offset: 0,
        span: 24,
    },
};

const FunctionStepDrawer = ({name,stepId,findList,type,functionId,funcUnitStore}) =>{
    const {updateFuncUnitStep,findFuncUnitStep,createFuncUnitStep} = funcUnitStepStore;
    const {findFuncUnit} = funcUnitStore
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const showDrawer = async () => {
        if(type==="edit"){
            let info = await findFuncUnitStep(stepId)
            form.setFieldsValue(info)
        }

        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const save = async () =>{
        let values =  await form.validateFields();

        if(type==="add"){
            values.funcUnitId=functionId
            createFuncUnitStep(values).then( (res)=>{
                if(res.code===0){
                     findList();
                     findFuncUnit(functionId)
                     messageFn("success","添加成功")
                     //清空
                     form.resetFields();
                }else {
                    messageFn("error","添加失败")
                }
            })
        }else {
            values.id=stepId
            updateFuncUnitStep(values).then((res)=>{
                if(res.code===0){
                    findList();
                    messageFn("success","保存成功")
                }else {
                    messageFn("error","保存失败")
                }
            })

            onClose();
        }

    }

    return(
        <>
            {
                type === "add"
                    ? <Button onClick={showDrawer} style={{backgroundColor: "#f3f3f3"}}>{name}</Button>
                    : <div
                        className={"link-text"}
                        onClick={showDrawer}
                        style={{flexGrow: 1}}
                    >
                        {name}
                    </div>
            }

            <Drawer
                placement="right"
                onClose={onClose}
                visible={open}
                width={700}
                destroyOnClose={true}
                //contentWrapperStyle={{top:48,height:"calc(100% - 50px)"}}
                // closable={false}
                className={"drawer-content-main"}
                title={type==="add"?"添加步骤":"编辑步骤"}
            >
                <div style={{padding:"0 10px"}}>
                    <div className={"case-detail_right_box"} style={{ padding:" 10px 5px"}}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={save}
                            preserve={false}
                            {...tailLayout}
                        >
                            <Form.Item label="步骤描述" name="described">
                                <TextArea
                                    placeholder="步骤描述"
                                    autoSize={{minRows:2,maxRows:4}}
                                />
                            </Form.Item>
                            <Form.Item  label="预期结果"  name="expect">
                                <TextArea
                                    placeholder="预期结果"
                                    autoSize={{minRows:2,maxRows:4}}
                                />
                            </Form.Item>
                            <div className={"case-save-cancel-btn"}>
                                <Form.Item>
                                    <Space>
                                        <Button
                                            className={"important-btn"}
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            保存
                                        </Button>
                                        <IconBtn
                                            className="pi-icon-btn-grey"
                                            onClick={onClose}
                                            name={"取消"}
                                        />
                                    </Space>
                                </Form.Item>
                            </div>

                        </Form>
                    </div>
                </div>

            </Drawer>
        </>
    )
}


export default observer(FunctionStepDrawer);