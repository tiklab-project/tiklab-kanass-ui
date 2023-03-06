import React, { useState } from "react";
import { Modal, Form } from 'antd';
import { withRouter } from "react-router";

const ProjectIconChange = (props) => {

    const [form] = Form.useForm();
    
    const { visible, setVisible, updateProject, setIconUrl } = props;

    const [projectIconUrl, setProjectIconUrl] = useState("")

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

    const projectId = props.match.params.id;
    const onFinish = () => {
        const data = { id: projectId, iconUrl: projectIconUrl }
        updateProject(data).then(res => {
            setIconUrl(projectIconUrl)
            setVisible(false)
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };


    return (
        <>
            <Modal
                title="更改图标"
                visible={visible}
                // footer={null}
                onCancel={onCancel}
                onOk = {onFinish}
                okText = {"确定"}
                cancelText = {"取消"}
                className="project-icon-modal"
                closable = {false}
            >
                <Form >
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="project-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div className={`project-icon ${item.iconUrl === projectIconUrl ? "icon-select" : null}`} key={item.key} onClick={() => { setProjectIconUrl(item.iconUrl) }}>
                                        <img src={('images/' + item.iconUrl)} alt="" className="list-img"/>
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

export default withRouter(ProjectIconChange);