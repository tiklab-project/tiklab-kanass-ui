/*
 * @Descripttion: 项目图标上传弹窗，暂时不用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 14:12:19
 */
import React, { useEffect, useState } from "react";
import { Modal, Form, message } from 'antd';
import { withRouter } from "react-router";
import ProjectBasicInfoStore from "../store/ProjectBasicInfoStore";
import {getUser} from "tiklab-core-ui";
import ImgComponent from "../../../../common/imgComponent/ImgComponent";
const ProjectIconChange = (props) => {

    const [form] = Form.useForm();
    
    const { visible, setVisible, updateProject, setIconUrl } = props;

    const {creatIcon, findIconList} = ProjectBasicInfoStore;
    const [projectIconUrl, setProjectIconUrl] = useState("")
    const [iconList, setIconList] = useState()


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
    const upload_url = env === "local" ? base_url : "";

    /**
     * 上传图标，暂时隐藏此功能
     */
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${upload_url}/dfs/upload`,
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
                                        <ImgComponent src={item.iconUrl} alt="" className="icon-40"/>
                                    </div>
                                })
                            }

                            {/* <Upload {...upLoadIcon}>
                                <div className="project-icon">
                                    <ImgComponent src={UploadIcon1} alt="" className="list-img"/>
                                </div>
                            </Upload> */}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default withRouter(ProjectIconChange);