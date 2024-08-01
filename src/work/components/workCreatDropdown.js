import React, { useState, useRef, useEffect } from "react";
import WorkAddModel from "./WorkAddModel";
import "./workCreatDropdown.scss";
import Button from "../../common/button/Button";
import { getUser } from "thoughtware-core-ui";
import setImageUrl from "../../common/utils/setImageUrl";
const WorkCreatDropdown = (props) => {
    const { workTypeList, buttonType, modelStyle, stageList } = props;
    const modelRef = useRef()
    const [stateType, setState] = useState();
    const workAddModel = useRef()
    const [showModal, setShowModal] = useState(false);
    const tenant = getUser().tenant;
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
                                <img
                                    src = {setImageUrl(item.workType?.iconUrl)}
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