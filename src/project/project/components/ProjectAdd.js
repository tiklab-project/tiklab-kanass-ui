import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, message, Row, Col, Steps, Breadcrumb } from 'antd';
import 'moment/locale/zh-cn';
import { observer, inject } from "mobx-react";
import "./ProjectAdd.scss";
import ProjectAddInfo from "./ProjectAddInfo";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";


const ProjectAdd = (props) => {
    const [visible, setVisible] = React.useState(false);
    const { projectStore, name, type, id } = props;
    const { searchpro, projectTypelist, getProjectTypeList, getUseList, uselist,
        creatIcon, findIconList, updateProject, addProlist } = projectStore;
    const [currentStep, setCurrentStep] = useState(0)
    const [workType, setWorkType] = useState()


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
                                <img src={`/images/${item.iconUrl}`} alt="" className="project-type-icon" />
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
        <div className="project-add">
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
                    {
                        console.log(steps[currentStep].content)
                    }
                    {steps[currentStep].content}
                    {/* <step1 /> */}
                </Col>
            </Row>
        </div>
    );
};

export default inject('projectStore')(observer(ProjectAdd));