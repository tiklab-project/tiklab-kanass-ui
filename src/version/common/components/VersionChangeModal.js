import React, { useEffect, useRef, useState } from "react";
import "./VersionChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { Tooltip } from "antd";
import ColorIcon from "../../../common/colorIcon/ColorIcon";

const VersionChangeModal = (props) => {
    const { isShowText, versionDetailStore, theme } = props;
    const { findVersionList, findVersion, versionList, version } = versionDetailStore;
    console.log(version)
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
    const [showVersionList, setShowVersionList] = useState()
    useEffect(() => {
        findVersionList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                let list = res.data;
                list = list.filter(item => item.id !== versionId)
                if (list.length > 5) {
                    setShowVersionList(res.data.slice(0, 6))
                } else {
                    setShowVersionList(list)
                }

            }
        });
        return;
    }, [versionId])

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
        findVersion({ id: id }).then(data => {
            if (data.code === 0) {
                props.history.push(`/${projectId}/versiondetail/${id}/workTable`)
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
            <div className="" ref={setButton}>
                {
                    isShowText ? <div className="version-title title" onClick={showMoreMenu}>
                        <ColorIcon name={version?.name} className="icon-24" color={version?.color} />
                        <div className={`version-text `} >
                            <div>
                                {version?.name}
                            </div>
                        </div>
                        <div className={`version-toggleCollapsed`}>
                            <svg className="svg-icon" aria-hidden="true">
                                <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                            </svg>
                        </div>
                    </div>
                        :
                        <Tooltip placement="right" title={version?.name}>
                            <div className='version-title-icon' onClick={showMoreMenu} >
                                
                                <ColorIcon name={version?.name} className="img-32" color={version?.color} />
                                <div className={`version-toggleCollapsed`}>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                    </svg>
                                </div>
                            </div>
                        </Tooltip>

                }
            </div>

            <div
                className={`change-version-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                <div className="change-version-head">切换版本</div>
                <div className={`change-version-item change-version-selectName`}
                    key={versionId}

                >
                    <ColorIcon name={version?.name} className="icon-32" color={version?.color} />
                    <div className="change-version-info">
                        <div className="change-version-name">{version?.name}</div>
                        <div className="change-version-state">{version?.versionState?.name}</div>
                    </div>
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-selected"></use>
                    </svg>
                </div>
                {
                    showVersionList && showVersionList.map((item) => {
                        if (item.id !== versionId) {
                            return <div className={`change-version-item ${item.id === selectVersion ? "change-version-selectName" : ""}`}
                                onClick={() => selectVersionId(item.id)}
                                key={item.id}
                                onMouseOver={() => handleMouseOver(item.id)}
                                onMouseOut={handleMouseOut}
                            >
                                <img
                                    className="icon-32"
                                    src={('images/version.png')}
                                    title={item.name}
                                    alt=""
                                />
                                <div className="change-version-info">
                                    <div className="change-version-name">{item.name}</div>
                                    <div className="change-version-state">{item.versionState.name}</div>
                                </div>
                            </div>
                        }

                    })
                }

                {
                    versionList.length > 6 &&
                    <div className="change-version-more" onClick={() => props.history.push(`/projectDetail/${projectId}/version`)}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(inject("versionDetailStore")(observer(VersionChangeModal)));