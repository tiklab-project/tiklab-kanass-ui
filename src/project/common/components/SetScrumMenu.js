import React, { useEffect, useRef, useState } from "react";
import "./setMenu.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

const SetScrumMenu = (props) => {
    const { isShowText, projectDetailStore } = props;
    const { setProjectSetBreadcumbText, projectSetBreadcumbText } = projectDetailStore;
    const [showMenu, setShowMenu] = useState(false);
    const modelRef = useRef()
    const setButton = useRef()
    const { t } = useTranslation();
    const projectId = props.match.params.id;
    const showMoreMenu = () => {
        // setShowMenu(!showMenu)
        // modelRef.current.style.left = setButton.current.clientWidth
        props.history.push(`/index/projectScrumDetail/${projectId}/projectSetDetail/basicInfo`)
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

    // useEffect(() => {
    //     console.log(projectSetBreadcumbText)
    //     setProjectSetBreadcumbText(
    //         {
    //             title: `${t('survey')}`,
    //             icon: 'survey',
    //             key: `/index/projectScrumDetail/${projectId}/basicInfo`,
    //             encoded: "basicInfo",
    //         }
    //     )
    // }, [])

    const prorouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/basicInfo`,
            encoded: "basicInfo",
        },
        {
            title: `${t('module')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/module`,
            encoded: "module"
        },
        {
            title: `${t('user')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/user`,
            encoded: "user",
        },
        {
            title: `${t('privilege')}`,
            icon: 'survey',
            key: `/index/projectScrumDetail/${projectId}/projectDomainRole`,
            encoded: "projectDomainRole",
        }
    ];

    const [selectKey, setSelectKey] = useState(`/index/projectScrumDetail/${projectId}/basicInfo`);

    const selectKeyFun = (item) => {
        setSelectKey(item.key)
        props.history.push(item.key)
        setProjectSetBreadcumbText(item)
        setShowMenu(false)

    }

    return (
        <div className="menu-model">
            {
                isShowText ? <div onClick={() => showMoreMenu()} ref={setButton} className="project-set-title setting">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-set"></use>
                    </svg>
                    <span>
                        设置
                    </span>
                </div>
                :
                <div onClick={() => showMoreMenu()} ref={setButton} className = "project-set-icon setting">
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
export default withRouter(inject("projectDetailStore")(observer(SetScrumMenu)));