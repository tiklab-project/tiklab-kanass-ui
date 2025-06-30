import React, {useEffect, useRef, useState} from "react";
import {Drawer, Form, Radio, Input, Button} from "antd";
import { observer, inject } from "mobx-react";
import WorkDetail from "../../../work/components/WorkDetail";
const AppraisedWorkItemStatusDrawer = (props) => {
    const {visible, setVisible, appraisedWorkItemStore, searchTable} = props;
    const {getRecordId, setRecordId, updateAppraisedWorkItem, recordId, findAppraisedWorkItemById} = appraisedWorkItemStore;
    const detailRef = useRef();

    const {TextArea} = Input

    const [selectedValue, setSelectedValue] = useState();
    const [form] = Form.useForm();
    const [appraisedFormData, setAppraisedFormData] = useState({
        workItemAppraisedState:"",
        advice:""
    })
    /**
     * 更新评审事项
     * @param formData
     */
    const updateItem = (formData) => {
        const recordId = getRecordId();
        const param = {
            id:recordId,
            workItemAppraisedState:formData.workItemAppraisedState,
            advice:formData.advice
        }
        console.log(JSON.stringify(param));
        updateAppraisedWorkItem(param).then(() => {
            setVisible(false)
            searchTable();
        })
    }


    useEffect(() => {
        findAppraisedWorkItemById(getRecordId()).then(data => {
            if (data.code === 0){
                form.setFieldsValue({
                    workItemAppraisedState:data.data.workItemAppraisedState,
                    advice:data.data.advice,
                })
            }
            setSelectedValue(data.data.workItemAppraisedState)
        })

        // setSelectedValue()
    },[recordId])

    /**
     * 关闭详情抽屉
     */
    const closeModal = (e) => {

        let pathname = props.location.pathname; // props.location.pathname;
        const index = pathname.lastIndexOf("\/");
        pathname = pathname.substring(0, index);
        props.history.replace(`${pathname}`)
        setVisible(false)
        form.resetFields()
        setRecordId(0)
    }

    return  (
        <Drawer
            title={"评审意见"}
            placement="right"
            onClose={closeModal}
            visible={visible}
            destroyOnClose={true}
            width={"42%"}
            style={{ display: "flex", flexDirection: "column" }}
            bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: 0 }}
        >
                <div>
                    <Form
                        title="开始评审"
                        form={form}
                        layout="vertical"
                        style={{
                            padding: '20px',
                        }}
                        onFinish={updateItem}>
                        <Form.Item name="workItemAppraisedState" label="评审意见">
                            <Radio.Group onChange={(e) => setSelectedValue(e.target.value)}>
                                <Radio value="1">通过</Radio>
                                <Radio value="2">不通过</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {/*{(['1', '2'].includes(selectedValue)) && (*/}
                        {/*    <Form.Item name="advice" label="建议">*/}
                        {/*        <Input.TextArea rows={4} placeholder="请输入评审建议..." />*/}
                        {/*    </Form.Item>*/}
                        {/*)}*/}
                        <Form.Item name="advice" label="建议">
                            <Input.TextArea rows={4} placeholder="请输入评审建议..." />
                        </Form.Item>
                        <Form.Item>
                            <div  style={{ textAlign: 'right' }}>
                                <Button type={"primary"} htmlType={"submit"} >确认</Button>
                                <Button onClick={(e) => closeModal(e)}>取消</Button>
                            </div>
                        </Form.Item>

                    </Form>
                </div>
        </Drawer>
    )
}
export default inject("appraisedWorkItemStore")(observer(AppraisedWorkItemStatusDrawer));