import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject, Provider } from "mobx-react";
import WorkStore from '../store/WorkStore';
const WorkDetailPage = (props) => {
    const { deleteWorkItem, workId, setWorkShowType } = WorkStore;
    const store = {
        workStore: WorkStore
    }
    const detailRef = useRef()
    const projectId = props.match.params.id;
    useEffect(() => {
        setWorkShowType("list")
        return;
    }, [])
    const rowSpan = {
        sm: 24,
        md: 24,
        lg: { span: 24 },
        xl: { span: "22", offset: "1" },
        xxl: { span: "18", offset: "3" }
    }
    const goWorkList = () => {
        if (props.match.path === "/projectDetail/:id/work/:workId") {
            props.history.push(`/projectDetail/${projectId}/workTable`)
        }
        if (props.match.path === "/:id/versiondetail/:version/work/:workId") {
            props.history.push(`/${projectId}/versiondetail/${versionId}/workTable`)
        }
        if (props.match.path === "/:id/sprintdetail/:sprint/work/:workId") {
            props.history.push(`/${projectId}/sprintdetail/${sprintId}/workTable`)
        }
    }

    const deleteWork = () => {
        deleteWorkItem(workId).then((res) => {
            // 当第当前页被删完, 总页数大于当前页
            if (res.code === 0) {
                goWorkList()
            }

        })
    }
    return (<Provider {...store}>
        <WorkDetail
            delectCurrentWorkItem={deleteWork}
            detailRef={detailRef}
            showPage={true}
            rowSpan = {rowSpan}
            {...props}
        />
    </Provider>

    );
};

export default observer(WorkDetailPage);