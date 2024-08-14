import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, message, Row, Col, Steps, Breadcrumb, Spin } from 'antd';
import 'moment/locale/zh-cn';
import { observer, inject } from "mobx-react";
import "./ProjectAdd.scss";
import ProjectAddInfo from "./ProjectAddInfo";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import ProjectStore from "../store/ProjectStore";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const ProjectAdd = (props) => {
    const [visible, setVisible] = React.useState(false);
    const { projectStore } = props;
    const { projectTypelist, getProjectTypeList, getUseList, findIconList, createProject } = ProjectStore;
    const [currentStep, setCurrentStep] = useState(0)
    const [workType, setWorkType] = useState()
    const [loading, setLoading] = useState(false)

    const getIconList = () => {
        findIconList({ iconType: "project" })
    }

    useEffect(() => {
        showModal();
        return
    }, [])

    const showModal = () => {
        setVisible(true);
        getProjectTypeList()
        getUseList()
        getIconList()
    };


    const Head = () => {
        return (
            <Breadcumb
                firstText="添加项目"
            >
                <div onClick={() => props.history.goBack()} className="projectadd-close">
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
                                <ImgComponent src={`${item.iconUrl}`} alt="" className="project-type-icon" />
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

            <ProjectAddInfo createProject={createProject} workType={workType} setVisible={setVisible} setCurrentStep={setCurrentStep} setLoading = {setLoading}/>
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
        <div className="project-add">
            <Spin spinning={loading} delay={500} tip = "添加中...">
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
                        {/* <step1 /> */}
                    </Col>
                </Row>
            </Spin>
            
        </div>
    );
};

export default observer(ProjectAdd);