import React, { useState } from "react";
import { Modal, Form, Select, DatePicker, message, Row, Col, Steps, Breadcrumb } from 'antd';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import { getUser } from 'tiklab-core-ui';
import { observer, inject } from "mobx-react";
import "./ProjectAdd.scss";
import Button from "../../../common/button/Button";
import ProjectAddInfo from "./ProjectAddInfo";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
const { Step } = Steps;


const ProjectAddModal = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const { projectStore, name, type, id } = props;
    const { searchpro, projectTypelist, getProjectTypeList, getUseList, uselist,
        creatIcon, findIconList, updateProject, addProlist } = projectStore;
    const [projectId, setProjectId] = useState("");
    const dateFormat = 'YYYY/MM/DD';
    const [currentStep, setCurrentStep] = useState(0)
    const [workType, setWorkType] = useState()

    const [iconUrl, setIconUrl] = useState("")

    const getIconList = () => {
        findIconList({ iconType: "project" }).then((res) => {
            // setIconList(res.data)
        })
    }
    const showModal = () => {
        setVisible(true);
        getProjectTypeList()
        getUseList()
        getIconList()
        if (type !== "add") {
            searchpro(id).then((response) => {
                form.setFieldsValue({
                    projectName: response.data.projectName,
                    projectType: response.data.projectType.id,
                    projectKey: response.data.projectKey,
                    projectLimits: response.data.projectLimits,
                    desc: response.data.desc,
                    projectState: response.data.projectState,
                    startTime: [moment(response.data.startTime, dateFormat), moment(response.data.endTime, dateFormat)]
                })
                setProjectId(response.data.id)
                setIconUrl(response.data.iconUrl)
                if (response.data.master) {
                    form.setFieldsValue({
                        master: response.data.master.id,
                    })
                }

            })
        }
    };


    const onCancel = () => {
        form.resetFields();
        setVisible(false);
    };

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                id: projectId,
                projectName: values.projectName,
                projectKey: values.projectKey,
                projectType: {
                    id: values.projectType
                },
                master: {
                    id: getUser().userId
                },
                desc: values.desc,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                projectState: values.projectState,
                projectLimits: values.projectLimits,
                iconUrl: iconUrl
            }
            if (type === "add") {
                addProlist(data).then(res => {
                    if (res.code === 40000) {
                        message.error(res.msg);
                    }
                    if (res.code === 0) {
                        message.success('添加成功');
                    }
                })
            } else {
                updateProject(data)
            }
            setVisible(false);
        })
    }

    // 周期
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: 'Please select time!',
            }
        ]
    };

    // 状态类型
    const status = [
        {
            name: "未开始",
            id: "1"
        },
        {
            name: "进行中",
            id: "2"
        },
        {
            name: "已结束",
            id: "3"
        }
    ]

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
                    iconType: "project"
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
            // <div className="project-add-page">
            //     <div className="project-add-title">添加项目</div>
            //     <div onClick={() => setVisible(false)}>
            //         <svg className="icon" aria-hidden="true">
            //             <use xlinkHref="#icon-close"></use>
            //         </svg>
            //     </div>
            // </div>
            <Breadcumb
                firstText="添加项目"
            >
                <div onClick={() => setVisible(false)} className = "projectadd-close">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-close"></use>
                    </svg>
                </div>
            </Breadcumb>
        )
    }

    const Steps = () => {
        return <div className="add-step">
            <div className={`step-common ${currentStep === 0 ? "step-select" : "step-nomal"}`}>
                <div className="step-number">1</div>
                <div className="step-title">选择项目模板</div>
            </div>
            <div className="step-line">

            </div>
            <div className={`step-common ${currentStep === 1 ? "step-select" : "step-nomal"}`}>
                <div className="step-number">2</div>
                <div className="step-title">填写信息</div>
            </div>
        </div>
    }

    const step1 = (
        <div className="add-model-page">

            <div className="project-type-list">
                {
                    projectTypelist && projectTypelist.map(item => {
                        return <div key={item.id} className={`add-model ${workType === item.id ? "add-model-select" : ""}`} onClick={() => selectProjectType(item)}>
                            <div className="type-icon">
                                <img src={`/images/${item.iconUrl}`} alt="" className="project-type-icon"/>
                            </div>
                            <div className="type-info">
                                <div className="type-name">{item.name}</div>
                                <div className="type-desc">{item.desc}</div>
                            </div>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-rightsimple"></use>
                            </svg>
                        </div>
                    })
                }
            </div>

            {/* </Col>
            </Row> */}


        </div>
    )

    const step2 = (
        <div>

            <ProjectAddInfo addProlist={addProlist} workType={workType} setVisible={setVisible} setCurrentStep={setCurrentStep} />
        </div>

    )

    const steps = [
        {
            title: "first",
            content: step1
        },
        {
            title: "second",
            content: step2
        }
    ]

    const selectProjectType = (workType) => {
        setWorkType(workType)
        setCurrentStep(1)
    }

    return (
        <>
            <div >
                <Button type="primary" onClick={showModal} buttonText={name} >
                </Button>
                <Modal
                    visible={visible}
                    onOk={onFinish}
                    onCancel={onCancel}
                    cancelText="取消"
                    okText="确定"
                    footer={false}
                    className="project-addmodel"
                    mask={false}
                    closable={false}
                    width={"100vw"}
                >
                    <Row>
                        <Col 
                            className="project-type-col"
                            lg={{ span: "18", offset: "3" }} 
                            xl={{ span: "14", offset: "5" }} 
                            xxl={{ span: "10", offset: "7" }} 
                            style={{ height: "100%" }}
                        >
                            <Head />
                            <Steps />
                            {steps[currentStep].content}
                        </Col>
                    </Row>


                </Modal>
            </div>
        </>
    );
};

export default inject('projectStore')(observer(ProjectAddModal));