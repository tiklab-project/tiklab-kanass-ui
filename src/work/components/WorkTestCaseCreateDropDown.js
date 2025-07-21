import React, {useEffect, useRef, useState} from "react";
import WorkTestCaseCreateModal from "./WorkTestCaseCreateModal";
import "./WorkTestCaseCreateDropDown.scss"
import {Button} from "antd";

const WorkTestCaseCreateDropDown = (props) => {
    //
    // const { workTypeList, buttonType, modelStyle, stageList } = props;
    const modelRef = useRef()
    const [caseType, setCaseType] = useState();
    const testCaseAddModel = useRef()
    const [showModal, setShowModal] = useState(false);

    /**
     * 监听切换弹窗的显示与不显示
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showModal])

    const testCaseList = [
        {
            id: 1,
            name: "功能用例",
        },
        {
            id: 2,
            name: "接口用例",
        },
        {
            id: 3,
            name: "性能用例",
        }
    ]

    /**
     * 关闭弹窗
     * @param {点击的位置} e
     * @returns
     */
    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowModal(false)
        }
    }

    /**
     * 选择事项类型
     */
    const selectAddType = (caseType) => {
        setCaseType(caseType)
        testCaseAddModel.current.setShowCreateModel(true)
        setShowModal(false)
    }

    return (
        <div className="work-creat">

            <Button
                style={{
                    display: "flex",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                type="text"
                onClick={() => { setShowModal(true) }}>
                <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }}>
                    <use xlinkHref="#icon-add2"></use>
                </svg>
                创建用例
            </Button>

            <div
                className={`work-type-box ${showModal ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                {
                    testCaseList && testCaseList.map((item) => {
                        return <div className={`work-type-item`}
                                    onClick={() => selectAddType(item)}
                                    key={item.id}
                        >
                            {/* <div> */}
                            <div className="work-type-item-name">{item.name}</div>
                            {/* </div> */}
                        </div>

                    })
                }

            </div>
            <WorkTestCaseCreateModal testCaseAddModel={testCaseAddModel} caseType={caseType} {...props} />
        </div>

    )
};

export default WorkTestCaseCreateDropDown;