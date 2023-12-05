import React, { useEffect, useRef, useState } from "react";
import "./VersionChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";

const VersionChangeModal = (props) => {
    // console.log(props)
    const { isShowText, versionDetailStore } = props;
    const { findVersionList,findVersion, versionList, version } = versionDetailStore;
    const [showMenu, setShowMenu] = useState(false);
    const [selectVersion, setSelectVersion] = useState(false)

    const modelRef = useRef()
    const setButton = useRef()
    const versionId = props.match.params.version;
    const projectId = props.match.params.id;
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        setSelectVersion(versionId)
        modelRef.current.style.left = setButton.current.clientWidth
    }
    useEffect(() => {
        findVersionList({projectId: projectId});
        return;
    },[])

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

    /**
     * 切换项目
     * @param {id} id 
     */
    const selectVersionId = (id) => {
        // 切换选中项目，获取项目详情
        findVersion({id: id}).then(data => {
            if (data.code === 0) {
                props.history.push(`/${projectId}/versiondetail/${id}/survey`)
                localStorage.setItem("versionId", id);
                setShowMenu(false)
            }
        });
        // 讲当前项目id存入localStorage
    }

    const handleMouseOver = (id) => {
        setSelectVersion(id)
    }

    const handleMouseOut = () => {
        setSelectVersion("")
    }

    return (
        <div className="change-version">
            <div ref={setButton}>
                {
                    isShowText ? <div className="version-title title" onClick={showMoreMenu}>
                        <img 
                            src={('/images/version.png')} 
                            className="icon-32"
                            alt=""
                        />

                        <div className={`version-text `} >
                            <div>
                                {version?.versionName}
                            </div>
                        </div>
                        <div className={`version-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    </div>
                    :
                    <div className='version-title-icon' onClick={showMoreMenu} >
                       <img 
                            src={('/images/version.png')} 
                            className="icon-32"
                            alt=""
                        />
                        <div className={`version-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref="#icon-down"></use>
                            </svg>
                        </div>
                    </div>
                }
            </div>

            <div
                className={`change-version-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                <div className="change-version-head">切换版本</div>
                {
                    versionList && versionList.map((item) => {
                        if(item.id !== versionId){
                            return <div className={`change-version-name ${item.id === selectVersion ? "change-version-selectName" : ""}`}
                                onClick={() => selectVersionId(item.id)}
                                key={item.id}
                                onMouseOver={() => handleMouseOver(item.id)}
                                onMouseOut={handleMouseOut}

                            >
                                <img
                                    className="img-icon-right"
                                    src={('images/version.png')}
                                    title={item.name}
                                    alt=""
                                />
                                {item.name}
                            </div>
                        }
                        
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject("versionDetailStore")(observer(VersionChangeModal)));