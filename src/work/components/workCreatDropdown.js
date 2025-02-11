/*
 * @Descripttion: 创建事项下拉选择框
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 09:20:04
 */
import React, { useState, useRef, useEffect } from "react";
import WorkAddModel from "./WorkAddModel";
import "./workCreatDropdown.scss";
import Button from "../../common/button/Button";
import ImgComponent from "../../common/imgComponent/ImgComponent";

const WorkCreatDropdown = (props) => {
    const { workTypeList, buttonType, modelStyle, stageList } = props;
    const modelRef = useRef()
    const [stateType, setState] = useState();
    const workAddModel = useRef()
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
    const selectAddType = (workType) => {
        setState(workType)
        workAddModel.current.setShowAddModel(true)
        setShowModal(false)
    }

    return (
        <div className="work-creat">
            {
                buttonType === "svg" ? <div onClick={() => setShowModal(true)} className={`work-button-icon ${showModal ? 'work-button-active' : ''}`}>
                    <svg className="icon-20" aria-hidden="true">
                        <use xlinkHref="#icon-add2"></use>
                    </svg>
                </div>
                    :
                    <Button type="primary" onClick={() => setShowModal(true)}>
                        添加事项
                    </Button>
            }

            <div
                className={`work-type-box ${showModal ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={modelStyle}
            >
                {
                    workTypeList && workTypeList.map((item) => {
                        return <div className={`work-type-item`}
                            onClick={() => selectAddType(item)}
                            key={item.id}
                        >
                            {/* <div> */}
                                <ImgComponent
                                    src = {item.workType?.iconUrl}
                                    alt=""
                                    className="img-icon-right"
                                />
                                <div className="work-type-item-name">添加{item.workType.name}</div>
                            {/* </div> */}
                        </div>

                    })
                }

            </div>
            <WorkAddModel workAddModel={workAddModel} workType={stateType} stageList = {stageList} {...props} />
        </div>

    )
}

export default WorkCreatDropdown;