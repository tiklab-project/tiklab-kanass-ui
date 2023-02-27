import React, { useEffect, useRef, useState } from "react";
import "./ProjectSetChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

const ProjectSetChangeModal = (props) => {
    const { projectSetStore, isShowText } = props;
    const { findAllProjectSet, projectSetAllList, findProjectSet } = projectSetStore;
    const setButton = useRef()


    const [showMenu, setShowMenu] = useState(false);
    const [selectProject, setSelectProject] = useState(false)

    const modelRef = useRef()

    const projectSet = JSON.parse(localStorage.getItem("projectSet"));


    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showMenu])

    useEffect(() => {
        findAllProjectSet().then(res => {
            console.log(projectSetAllList)
        })
        return
    }, [])

    const showDropDown = () => {
        setShowMenu(!showMenu)
        modelRef.current.style.left = setButton.current.clientWidth
    }

    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }


    const selectKeyFun = (item) => {
        setSelectKey(item.key)
        props.history.push(item.key)
        setProjectSetBreadcumbText(item)
        setShowMenu(false)

    }

    /**
     * 切换项目
     * @param {id} id 
     */
    const selectProjectSetId = (record) => {
        // 切换选中项目，获取项目详情
        findProjectSet(record.id).then(data => {
            if (data.code === 0) {
                props.history.push(`/index/projectSetdetail/${record.id}/survey`);
                localStorage.setItem("projectSet", JSON.stringify(record))
                location.reload();
                setShowMenu(false)
            }
        });

    }

    const handleMouseOver = (id) => {
        setSelectProject(id)
    }

    const handleMouseOut = () => {
        setSelectProject("")
    }

    return (
        <div className="change-projectSet">
                <div  onClick={() =>showDropDown()} ref = {setButton}>
                    {
                        isShowText ? <div className="projectSet-change-title">
                           <svg className="list-img" aria-hidden="true">
                                <use xlinkHref="#icon-program"></use>
                            </svg>
                            <div className={`projectSet-text `} >
                                <div>
                                    {projectSet.name}
                                </div>
                                {/* <div className='type'>
                                    {projectType}
                                </div> */}
                            </div>
                            <div className={`projectSet-toggleCollapsed`}>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref="#icon-down"></use>
                                </svg>
                            </div>
                        </div>
                        :
                        <div className="projectSet-change-icon">
                            <svg className="list-img" aria-hidden="true">
                                <use xlinkHref="#icon-program"></use>
                            </svg>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    }

                </div>

            <div
                className={`change-projectSet-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
            >
                <div className="change-projectSet-head">切换项目集</div>
                {
                    projectSetAllList && projectSetAllList.map((item) => {
                        return <div className={`change-projectSet-name ${item.id === selectProject ? "change-projectSet-selectName" : ""}`}
                            onClick={() => selectProjectSetId(item)}
                            key={item.id}
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseOut={handleMouseOut}

                        >
                            {
                                item.iconUrl ?
                                    <img
                                        src={('images/' + item.iconUrl)}
                                        className="img-icon"
                                        title={item.name}
                                        alt=""
                                    />
                                    :
                                    <img
                                        className="img-icon"
                                        src={('images/project1.png')}
                                        title={item.name}
                                        alt=""
                                    />
                            }
                            {item.name}
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject("projectSetStore")(observer(ProjectSetChangeModal)));