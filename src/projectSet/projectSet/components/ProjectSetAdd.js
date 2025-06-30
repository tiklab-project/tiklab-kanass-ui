/*
 * @Descripttion: 项目集添加弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:51:03
 */
import React, { useState } from "react";
import {message, Row, Col, Modal, Spin} from 'antd';
import 'moment/locale/zh-cn';
import { getUser } from 'tiklab-core-ui';
import { Provider } from "mobx-react";
import "./ProjectSetAdd.scss";

import ProjectSetAddInfo from "./ProjectSetAddInfo";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import ProjectSetStore from "../store/ProjectSetStore";


const ProjectSetAdd = (props) => {
    const store = {
        projectSetStore: ProjectSetStore
    }
    const [visible, setVisible] = React.useState(false);
    const { setAllProjectSetList, projectSetAddVisible, setProjectSetAddVisible } = props;
    const { addProjectSetSet, getProjectSetlist, findAllProjectSet, creatIcon, findIconList } = ProjectSetStore;


    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)


    const getIconList = () => {
        findIconList({ iconType: "projectSet" }).then((res) => {
            // setIconList(res.data)
        })
    }

    /**
    *上传图标 
    */
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
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
                const params = {
                    iconName: info.file.name,
                    iconUrl: info.file.response.data.fileName,
                    iconType: "projectSet"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    } else {

                    }
                })
                message.success(`${info.file.name} 文件上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 文件上传失败.`);
            }
        },
    };

    const Head = () => {
        return (
            <Breadcumb
                firstText="添加项目集"
            >
                <div onClick={() => props.history.goBack()} className="projectSetadd-close">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-close"></use>
                    </svg>
                </div>
            </Breadcumb>
        )
    }

    const onCancel = () => {
        setProjectSetAddVisible(false)
    }

    return (
        <Modal
            title={"添加项目集"}
            visible={projectSetAddVisible}
            height={600}
            width={700}
            footer={null}
            onCancel={onCancel}
        >
            <div className="projectSet-add">
                <Spin spinning={loading} tip="添加中...">
                    <ProjectSetAddInfo
                        findAllProjectSet={findAllProjectSet}
                        addProjectSetSet={addProjectSetSet}
                        setAllProjectSetList={setAllProjectSetList}
                        getProjectSetlist={getProjectSetlist}
                        setVisible={setVisible}
                        setCurrentStep={setCurrentStep}
                        onCancel={onCancel}
                        setLoading={setLoading}
                    />
                </Spin>
            </div>
        </Modal>
       
    );
};

export default ProjectSetAdd;