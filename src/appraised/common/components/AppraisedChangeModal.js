/**
 * 评审切换弹窗
 */
import React, { useEffect, useRef, useState } from "react";
import "./AppraisedChangeModal.scss";
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { Tooltip } from "antd";
import ColorIcon from "../../../common/colorIcon/ColorIcon";

const AppraisedChangeModal = (props) => {
    const { isShowText, appraisedDetailStore, theme } = props;
    const { findAppraisedList, findAppraised, appraisedList, appraised } = appraisedDetailStore;
    console.log(appraised)
    const [showMenu, setShowMenu] = useState(false);
    const [selectAppraised, setSelectAppraised] = useState(false)

    const modelRef = useRef()
    const setButton = useRef()
    const appraisedId = props.match.params.appraised;
    const projectId = props.match.params.id;
    const showMoreMenu = () => {
        setShowMenu(!showMenu)
        setSelectAppraised(appraisedId)
        modelRef.current.style.left = setButton.current.clientWidth
    }
    const [showAppraisedList, setShowAppraisedList] = useState()
    useEffect(() => {
        findAppraisedList({ projectId: projectId }).then(res => {
            if (res.code === 0) {
                let list = res.data;
                list = list.filter(item => item.id !== appraisedId)
                if (list.length > 5) {
                    setShowAppraisedList(res.data.slice(0, 6))
                } else {
                    setShowAppraisedList(list)
                }

            }
        });
        return;
    }, [appraisedId])

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
    const selectAppraisedId = (id) => {
        // 切换选中项目，获取项目详情
        findAppraised({ id: id }).then(data => {
            if (data.code === 0) {
                props.history.push(`/${projectId}/appraised/${id}/workitem`)
                localStorage.setItem("appraisedId", id);
                setShowMenu(false)
            }
        });
        // 讲当前项目id存入localStorage
    }

    const handleMouseOver = (id) => {
        setSelectAppraised(id)
    }

    const handleMouseOut = () => {
        setSelectAppraised("")
    }

    return (
        <div className="change-appraised">
            <div className="" ref={setButton}>
                {
                    isShowText ? <div className="appraised-title title" onClick={showMoreMenu}>
                            <ColorIcon name={appraised?.name} className="icon-24" color={appraised?.color} />
                            <div className={`appraised-text `} >
                                <div>
                                    {appraised?.name}
                                </div>
                            </div>
                            <div className={`appraised-toggleCollapsed`}>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref={`${theme === "default" ? "#icon-down-gray" : "#icon-down-white"}`}></use>
                                </svg>
                            </div>
                        </div>
                        :
                        <Tooltip placement="right" title={appraised?.name}>
                            <div className='appraised-title-icon' onClick={showMoreMenu} >
                                <ColorIcon name={appraised?.name} className="img-32" color={appraised?.color} />
                            </div>
                        </Tooltip>

                }
            </div>

            <div
                className={`change-appraised-box ${showMenu ? "menu-show" : "menu-hidden"}`}
                ref={modelRef}
                style={{}}
            >
                <div className="change-appraised-head">切换版本</div>
                <div className={`change-appraised-item change-appraised-selectName`}
                     key={appraisedId}

                >
                    <ColorIcon name={appraised?.name} className="icon-32" color={appraised?.color} />
                    <div className="change-appraised-info">
                        <div className="change-appraised-name">{appraised?.name}</div>
                        <div className="change-appraised-state">{appraised?.appraisedState?.name}</div>
                    </div>
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-selected"></use>
                    </svg>
                </div>
                {
                    showAppraisedList && showAppraisedList.map((item) => {
                        if (item.id !== appraisedId) {
                            return <div className={`change-appraised-item ${item.id === selectAppraised ? "change-appraised-selectName" : ""}`}
                                        onClick={() => selectAppraisedId(item.id)}
                                        key={item.id}
                                        onMouseOver={() => handleMouseOver(item.id)}
                                        onMouseOut={handleMouseOut}
                            >
                                <img
                                    className="icon-32"
                                    src={('images/appraised.png')}
                                    title={item.name}
                                    alt=""
                                />
                                <div className="change-appraised-info">
                                    <div className="change-appraised-name">{item.name}</div>
                                    <div className="change-appraised-state">{item.appraisedState.name}</div>
                                </div>
                            </div>
                        }

                    })
                }

                {
                    appraisedList.length > 6 &&
                    <div className="change-appraised-more" onClick={() => props.history.push(`/project/${projectId}/appraised`)}>查看更多</div>
                }
            </div>
        </div>
    )
}
export default withRouter(inject("appraisedDetailStore")(observer(AppraisedChangeModal)));