import React, { useState,useEffect,useRef } from "react";
import "./ProjectSetBreadcumb.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { inject,observer } from "mobx-react";

const ProjectSetBreadcumb = (props) => {
    const {projectDetailStore} = props;
    const {projectSetBreadcumbText,setProjectSetBreadcumbText} = projectDetailStore;
    const { t } = useTranslation();
    const projectId = props.match.params.id;
    const [showMenu, setShowMenu] = useState(false);
    const modelRef = useRef();
    const projectType = props.match.path.split("/")[2]

    useEffect(() => {
        window.addEventListener("mousedown",closeModal,false);
        return ()=> {
            window.removeEventListener("mousedown",closeModal,false);
        }
    },[projectSetBreadcumbText])

    const closeModal = (e) => {
        if(!modelRef.current){
            return;
        }
        if(!modelRef.current.contains(e.target) && modelRef.current !== e.target){
            setShowMenu(false)
        }
    }

    return (
         <div className="projectset-breadcrumb">
            <svg className="svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-home"></use>
            </svg>
            <span>设置</span>
        </div>
    )
}
export default withRouter(inject("projectDetailStore")(observer(ProjectSetBreadcumb)));