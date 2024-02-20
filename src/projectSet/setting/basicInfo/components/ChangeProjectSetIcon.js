import React, { useState } from "react";
import { Modal, Button, Form, Input, Upload, Select, message } from 'antd';
import { withRouter } from "react-router";


const ChangeProjectSetIcon = (props) => {

    const [form] = Form.useForm();
    
    const { visible, setVisible, updateprojectSet, setIconUrl } = props;

    const [projectSetIconUrl, setprojectSetIconUrl] = useState("")

    const iconList = [
        {
            iconUrl: "project1.png",
            key: "project1"
        },
        {
            iconUrl: "project2.png",
            key: "project2"
        },
        {
            iconUrl: "project3.png",
            key: "project3"
        },
        {
            iconUrl: "project4.png",
            key: "project4"
        },
        {
            iconUrl: "project5.png",
            key: "project5"
        }
    ]

    const projectSetId = props.match.params.projectSetId;
    const onFinish = () => {
        const data = { id: projectSetId, iconUrl: projectSetIconUrl }
        updateprojectSet(data).then(res => {
            setIconUrl(projectSetIconUrl)
            setVisible(false)
        })
    };


    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };


    return (
        <>
            <Modal
                title="Title"
                visible={visible}
                // footer={null}
                onCancel={onCancel}
                onOk = {onFinish}
                okText = {"确定"}
                cancelText = {"取消"}
                className="projectSet-icon-modal"
                closable = {false}
            >
                <Form >
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="projectSet-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div 
                                        className={`projectSet-icon ${item.iconUrl === projectSetIconUrl ? "icon-select" : null}`} 
                                        key={item.id} 
                                        onClick={() => { setprojectSetIconUrl(item.iconUrl) }}
                                    >
                                        <img src={('images/' + item.iconUrl)} alt="" className="img-icon-right"/>
                                    </div>
                                })
                            }
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default withRouter(ChangeProjectSetIcon);