/**
 * 评审页面左侧导航栏
 */
import React, { Fragment, useState, useEffect, useRef } from 'react';
import "../../../assets/font-icon/iconfont.css";
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";
import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next';
import AppraisedChangeModal from "./AppraisedChangeModal";
import "./appraisedDetailAside.scss";
import ProjectAside from '../../../common/projectAside/ProjectAside';

const { Sider } = Layout;

const AppraisedDetailAside = (props) => {
    const { appraisedDetailStore } = props;
    const { findAppraised, appraised, setAppraisedRouter, appraisedRouter } = appraisedDetailStore;
    //语言包
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default"
    const { t, i18n } = useTranslation();
    // 当前选中路由
    const projectId = props.match.params.id;
    const appraisedId = props.match.params.appraised;
    const setButton = useRef();
    const [isShowText, SetIsShowText] = useState(false)

    const path = props.location.pathname.split("/")[4];
    const [router, setRouter] = useState();
    useEffect(() => {
        findAppraised({ id: appraisedId }).then(res => {
            // if(res.code === 0){
            //     if (res.data.appraisedState.id === "222222") {
            //         setAppraisedRouter(doneRouter)
            //     } else {
            //         setAppraisedRouter(allRouter)
            //     }
            // }
            setAppraisedRouter(allRouter);
        })
        return;
    }, [appraisedId])


    const allRouter = [
        // {
        //     title: `${t('survey')}`,
        //     icon: 'survey-' + theme,
        //     defaultIcon: "survey-default",
        //     id: `/${projectId}/appraised/${appraisedId}/overview`,
        //     key: "overview",
        //     encoded: "Survey",
        // },
        {
            title: "需求",
            icon: 'workitem-' + theme,
            defaultIcon: "workitem-default",
            id: `/${projectId}/appraised/${appraisedId}/workitem`,
            key: "work",
            encoded: "work",
        },
        // {
        //     title: "规划",
        //     icon: 'plan-' + theme,
        //     defaultIcon: "plan-default",
        //     id: `/${projectId}/appraised/${appraisedId}/plan`,
        //     key: "plan",
        //     encoded: "plan",
        // }
    ];

    const doneRouter = [
        // {
        //     title: `${t('survey')}`,
        //     icon: 'survey-' + theme,
        //     defaultIcon: "survey-default",
        //     id: `/${projectId}/appraised/${appraisedId}/overview`,
        //     key: "overview",
        //     encoded: "Survey",
        // },
        {
            title: "需求",
            icon: 'workitem-' + theme,
            defaultIcon: "workitem-default",
            id: `/${projectId}/appraised/${appraisedId}/workitem`,
            key: "work",
            encoded: "work",
        },
    ]

    //点击左侧菜单
    const selectMenu = (key) => {
        props.history.push(key)
    }

    //点击折叠或展开菜单
    const toggleCollapsed = () => {
        SetIsShowText(!isShowText)
    }

    const backProject = () => {
        props.history.push(`/project/${projectId}/appraised`)
    }

    return (
        <Fragment>
            <ProjectAside
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={AppraisedChangeModal}
                initRouters={appraisedRouter}
                path={path}
                backName = {"返回项目"}
                setUrl = {`/${projectId}/appraised/${appraisedId}/setting`}
                backUrl = {`/project/${projectId}/appraised`}
                iconName = "back"
            />
        </Fragment>
    )

}
export default withRouter(inject("appraisedDetailStore")(observer(AppraisedDetailAside)));