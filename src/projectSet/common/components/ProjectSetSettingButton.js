import React, { useEffect, useRef, useState } from "react";
import "./projectSetSettingButton.scss";
import { withRouter } from "react-router";

const ProjectSetSettingButton = (props) => {
    const { isShowText } = props;
    const [showMenu, setShowMenu] = useState(false);
    const modelRef = useRef()
    const setButton = useRef()
    const projectgramId = props.match.params.projectSetId;

    const goProjectSetSet = () => {
        props.history.push(`/index/projectSetdetail/${projectgramId}/projectSetset/basicInfo`)
    }

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

   

    return (
        <div className="menu-model">
            {
                isShowText ? <div onClick={() => goProjectSetSet()} ref={setButton} className="project-title setting">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
                :
                <div onClick={() => goProjectSetSet()} ref={setButton} className = "project-set-icon setting">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
            }
        </div>
    )
}
export default withRouter(ProjectSetSettingButton);