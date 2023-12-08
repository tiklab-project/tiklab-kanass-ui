import React, { useEffect, useState } from "react";
import { Modal, Form, Upload, message } from 'antd';
import { withRouter } from "react-router";
import UploadIcon1 from "../../../../assets/images/uploadIcon.png";
import ProjectBasicInfoStore from "../store/ProjectBasicInfoStore";
import {getUser} from "thoughtware-core-ui"
import setImageUrl from "../../../../common/utils/setImageUrl";
const ProjectIconChange = (props) => {

    const [form] = Form.useForm();
    
    const { visible, setVisible, updateProject, setIconUrl } = props;

    const {creatIcon, findIconList} = ProjectBasicInfoStore;
    const [projectIconUrl, setProjectIconUrl] = useState("")
    const [iconList, setIconList] = useState()
    // const iconList = [
    //     {
    //         iconUrl: "project1.png",
    //         key: "project1"
    //     },
    //     {
    //         iconUrl: "project2.png",
    //         key: "project2"
    //     },
    //     {
    //         iconUrl: "project3.png",
    //         key: "project3"
    //     },
    //     {
    //         iconUrl: "project4.png",
    //         key: "project4"
    //     },
    //     {
    //         iconUrl: "project5.png",
    //         key: "project5"
    //     }
    // ]

    useEffect(() => {
        getIconList()
        return;
    },[])
    const projectId = props.match.params.id;
    const onFinish = () => {
        const data = { id: projectId, iconUrl: projectIconUrl }
        updateProject(data).then(res => {
            setIconUrl(projectIconUrl)
            setVisible(false)
        })
    };

   
    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    const getIconList = () => {
        findIconList({ iconType: "project" }).then((res) => {
            setIconList(res.data)
        })
    }

    // 上传图标
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${base_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                console.log(info.file, info.fileList);
                const res = info.file.response.data;
                const params = {
                    iconName: info.file.name,
                    iconUrl: "/image/" + res,
                    iconType: "project"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    }
                })
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
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
                                    return <div 
                                        className={`project-icon ${item.iconUrl === projectIconUrl ? "icon-select" : null}`} 
                                        key={item.id} onClick={() => { setProjectIconUrl(item.iconUrl) }}
                                    >
                                        <img src={setImageUrl(item.iconUrl)} alt="" className="icon-40"/>
                                    </div>
                                })
                            }

                            <Upload {...upLoadIcon}>
                                <div className="project-icon">
                                    <img src={UploadIcon1} alt="" className="list-img"/>
                                </div>
                            </Upload>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default withRouter(ProjectIconChange);