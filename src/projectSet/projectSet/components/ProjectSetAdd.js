import React, { useState } from "react";
import { Modal, Form, Select, DatePicker, message, Row, Col, Steps, Breadcrumb } from 'antd';
import 'moment/locale/zh-cn';
import { getUser } from 'tiklab-core-ui';
import { observer, inject } from "mobx-react";
import "./ProjectSetAdd.scss";
import Button from "../../../common/button/Button";
import ProjectSetAddInfo from "./ProjectSetAddInfo";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";


const ProjectSetAdd = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const { projectStore, name, projectSetStore } = props;
    const {  getUseList, creatIcon, findIconList } = projectStore;
        
    const { addProjectSetSet, getProjectSetlist } = projectSetStore;


    const [currentStep, setCurrentStep] = useState(1)


    const getIconList = () => {
        findIconList({ iconType: "projectSet" }).then((res) => {
            // setIconList(res.data)
        })
    }
    const showModal = () => {
        setVisible(true);
        getUseList()
        getIconList()
    };


    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };


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
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const Head = () => {
        return (
            <Breadcumb
                firstText="添加项目集"
            >
                <div onClick={() => setVisible(false)} className = "projectSetadd-close">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-close"></use>
                    </svg>
                </div>
            </Breadcumb>
        )
    }


    return (
        <>
            <div >
                <Button 
                style={{ width: "fit-content" }}
                    type="primary" onClick={showModal} buttonText={name} >
                </Button>
                <Modal
                    visible={visible}
                    onCancel={onCancel}
                    cancelText="取消"
                    okText="确定"
                    footer={false}
                    className="projectSet-addmodel"
                    mask={false}
                    closable={false}
                    width={"100vw"}
                >
                    <Row>
                        <Col 
                            className="projectSet-type-col"
                            lg={{ span: "18", offset: "3" }} 
                            xl={{ span: "14", offset: "5" }} 
                            xxl={{ span: "10", offset: "7" }} 
                            style={{ height: "100%" }}
                        >
                            <Head />
                            {/* <Steps /> */}
                            <div>

                                <ProjectSetAddInfo addProjectSetSet={addProjectSetSet} getProjectSetlist = {getProjectSetlist} setVisible={setVisible} setCurrentStep={setCurrentStep} />
                            </div>
                        </Col>
                    </Row>


                </Modal>
            </div>
        </>
    );
};

export default inject('projectStore', "projectSetStore")(observer(ProjectSetAdd));