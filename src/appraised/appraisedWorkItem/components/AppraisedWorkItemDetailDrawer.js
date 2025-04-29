import React, {useEffect, useRef, useState} from "react";
import {Drawer, Form, Radio, Input, Button} from "antd";
import { observer, inject } from "mobx-react";
import WorkDetail from "../../../work/components/WorkDetail";
const AppraisedWorkItemDetailDrawer = (props) => {
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
        console.log("重新渲染抽屉的id：  "+recordId)
        findAppraisedWorkItemById(getRecordId()).then(data => {
            console.log("返回值：   "+JSON.stringify(data))
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
        if (!detailRef.current) {
            return;
        }
        let IsSelectclear = false;
        if (e.target.localName === "path") {
            const classList = e.target.parentElement.parentElement.classList;
            if (classList.value === "anticon anticon-close-circle") {
                IsSelectclear = true
            }
        } else {
            IsSelectclear = false
        }

        if (!detailRef.current.contains(e.target) && detailRef.current !== e.target && !IsSelectclear && visible) {
            let pathname = props.location.pathname; // props.location.pathname;
            const index = pathname.lastIndexOf("\/");
            pathname = pathname.substring(0, index);
            props.history.replace(`${pathname}`)

            setVisible(false)
            setRecordId(0)
        }
    }

    return  (
        <Drawer
            placement="right"
            onClose={closeModal}
            visible={visible}
            closable={false}
            destroyOnClose={true}
            width={"68%"}
            style={{ display: "flex", flexDirection: "column" }}
            bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: 0 }}
        >

                <div className="work-detail-drawer" ref={detailRef} >
                    <WorkDetail
                        {...props}
                        showPage={true}
                        // deleteWork = {deleteWork}
                        setIsModalVisible={setVisible}
                        delectCurrentWorkItem = {null}
                        closeModal = {closeModal}
                        showAppraised ={true}
                        // appraisedFormData = {appraisedFormData}
                        // setAppraisedFormData = {setAppraisedFormData}
                        // updateItem = {updateItem}
                    />
                </div>
                <div>
                    <Form
                        title="开始评审"
                        form={form}
                        layout="vertical"
                        style={{
                            // padding: '20px', background: '#fdfdfd', borderTop: '3px solid #e8e8e8'
                            background: '#fafafa', // 比默认(#fff)稍深的浅灰
                            padding: '20px',
                            borderRadius: '4px',
                            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.5)', // 极浅阴影
                        }}
                        onFinish={updateItem}>
                        <Form.Item name="workItemAppraisedState" label="评审状态">
                            <Radio.Group onChange={(e) => setSelectedValue(e.target.value)}>
                                <Radio value="1">通过</Radio>
                                <Radio value="2">未通过</Radio>
                                <Radio value="3">建议</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {(['3', '2'].includes(selectedValue)) && (
                            <Form.Item name="advice" label="建议">
                                <Input.TextArea rows={4} placeholder="请输入评审建议..." />
                            </Form.Item>
                        )}
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
export default inject("appraisedWorkItemStore")(observer(AppraisedWorkItemDetailDrawer));