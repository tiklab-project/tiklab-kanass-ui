/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-09 16:39:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 19:09:13
 */
import React, { Fragment, useEffect, useState, useRef } from "react";
import { observer, inject } from "mobx-react";
import { DatePicker, Select, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./versionDetail.scss";
import VersionPlan from "./VersionPlan"
import { withRouter } from "react-router";
import Button from "../../../common/button/Button";

const VersionDetail = (props) => {
    const { versionStore } = props;
    const { findVersion, versionList, getVersionList, deleVersion, editVersion } = versionStore;
    const [planInfo, setPlanInfo] = useState()
    const actionPlanId = props.match.params.versionId;
    const path = props.match.path.split("/")[2];
    const [showMenu, setShowMenu] = useState(false);

    const [dropDown, showDropdown] = useState(false);
    const modelRef = useRef();
    // 项目id
    const projectId = props.match.params.id;
    const inputRef = useRef();

    useEffect(() => {
        if (actionPlanId !== "") {
            findVersion(actionPlanId).then(data => {
                setPlanInfo(data.data)
            })
        }
        getVersionList({ projectId: projectId }).then((res) => {
            console.log(res)
            // if(res.code === 0){
            //     this.versionList = res.data.dataList
            // }
            // setLoading(false)
        })

        return;
    }, [actionPlanId])


    
    const setStatusName = (value) => {
        let name = ""
        switch (value) {
            case "0":
                name = "未开始"
                break;
            case "1":
                name = "进行中"
                break;
            case "2":
                name = "已结束"
                break;
            default:
                name = "未开始"
                break;
        }
        return name;
    }
    const [fieldName, setFieldName] = useState("")
    const changeStyle = (value) => {
        setFieldName(value)
    }
    const dateFormat = 'YYYY-MM-DD';

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [])


    const closeModal = (e) => {
        if (!modelRef.current) {
            return;
        }
        if (!modelRef.current.contains(e.target) && modelRef.current !== e.target) {
            setShowMenu(false)
        }
    }

    const selectKeyFun = (item) => {
        props.history.push(`/index/${path}/${projectId}/versionDetail/${item.id}`)
        setShowMenu(false)
    }

    const [editName, setEditName] = useState(false)
    const updateNameByBlur = (event, id) => {
        event.stopPropagation();
        event.preventDefault()
        updateTitle()
    }

    const updateNameByKey = (event) => {
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault()
            updateTitle()
        }
    }

    const updateTitle = () => {
        const name = inputRef.current.textContent;
        const params = {
            name: name,
            id: actionPlanId
        }

        if (inputRef.current.textContent !== planInfo.title) {
            editVersion(params).then(res => {
                if (res.code === 0) {
                    planInfo.epicName = inputRef.current.textContent;
                }
            })
        }
        inputRef.current.blur()
        setEditName(false)
    }

    const updateVersion = (key, value, dateString) => {
        const params = {
            id: actionPlanId,
            [key]: dateString
        }
        editVersion(params)
    }

    const deleVersionById = () => {
        deleVersion(actionPlanId)
    }
    return (
        <Row >
            <Col lg={{ span: "22", offset: "1" }} xxl={{ span: "18", offset: "3" }}>
                <div className="version-detail">
                    {
                        planInfo && <Fragment>
                            <div className="version-top">
                                <div className="version-breadcrumb">
                                    <span className="version-breadcrumb-first" onClick={() => props.history.push(`/index/projectScrumDetail/${projectId}/version`)}>版本</span>
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-right1"></use>
                                    </svg>
                                    <div className="version-breadcrumb-dropdown" onMouseEnter={() => showDropdown(true)}
                                        onMouseLeave={() => showDropdown(false)}>
                                        <div
                                            onClick={() => setShowMenu(true)}
                                            style={{ cursor: "pointer" }}
                                            className="version-breadcrumb-text"

                                        >
                                            {planInfo?.name}
                                            <DownOutlined style={{ fontSize: '12px', marginLeft: "10px" }} />
                                        </div>
                                        <div
                                            className={`version-breadcrumb-dropdown-modal ${showMenu ? "version-menu-show" : "version-menu-hidden"}`}
                                            ref={modelRef}
                                        >
                                            <ul className="version-menu">
                                                {
                                                    versionList && versionList.map(item => {
                                                        return <div className={`version-menu-submenu ${item.id === planInfo?.id ? "version-menu-select" : ""}`}
                                                            key={item.key}
                                                            onClick={() => selectKeyFun(item)}
                                                        >
                                                            {/* <svg className="icon" aria-hidden="true">
                                                                <use xlinkHref={`#icon-${item.icon}`}></use>
                                                            </svg> */}
                                                            <span>
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick = {() => deleVersionById()}>删除</Button>
                            </div>
                            <div className="version-title">
                                <div className={`${editName ? "version-name-edit" : "version-name"}`}
                                    onBlur={() => updateNameByBlur(event, "blur")}
                                    onKeyDown={() => updateNameByKey(event, "enter")}
                                    onClick={() => setEditName(true)}
                                    contentEditable={editName}
                                    suppressContentEditableWarning
                                    ref={inputRef}
                                >
                                    {planInfo?.name}
                                </div>
                            </div>
                            <div className="version-info">
                                <div className="version-date">
                                    <div className="version-lable">开始日期：</div>
                                    <DatePicker
                                        locale={locale}
                                        format={dateFormat}
                                        allowClear={false}
                                        className="work-select"
                                        bordered={fieldName === "planStartTime" ? true : false}
                                        showarrow={fieldName === "planStartTime" ? "true" : "false"}
                                        onFocus={() => changeStyle("planStartTime")}
                                        onBlur={() => setFieldName("")}
                                        suffixIcon={false}
                                        defaultValue={moment(planInfo.startTime, dateFormat)}
                                        // onChange = {(value) => updateVersion("startTime", value)}
                                        onChange={(data, dateString) => updateVersion("startTime", data, dateString)}
                                    />
                                </div>
                                <div className="version-date">
                                    <div className="version-lable">发布日期：</div>
                                    <DatePicker
                                        locale={locale}
                                        format={dateFormat}
                                        allowClear={false}
                                        className="work-select"
                                        bordered={fieldName === "planPublishTime" ? true : false}
                                        showarrow={fieldName === "planPublishTime" ? "true" : "false"}
                                        onFocus={() => changeStyle("planPublishTime")}
                                        onBlur={() => setFieldName("")}
                                        suffixIcon={false}
                                        defaultValue={moment(planInfo.publishDate, dateFormat)}
                                        onChange={(data, dateString) => updateVersion("publishDate", data, dateString)}
                                    />
                                </div>
                            </div>
                            <VersionPlan actionPlanId={actionPlanId} />

                        </Fragment>
                    }

                </div>
            </Col>
        </Row>
    )

}
export default withRouter(inject("versionStore")(observer(VersionDetail)));