import React, {Fragment, useEffect, useState} from "react";
import ProjectAside from "../../../common/projectAside/ProjectAside";
import ProductChangeModal from "../../../product/common/components/ProductChangeModal";
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import { getUser } from 'tiklab-core-ui'
import "./ProductAside.scss"

const ProductDetailAside = (props) => {
    const { systemRoleStore, isShowText, SetIsShowText } = props;
    const theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "default"
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/prodetail/overview`);
    const path = props.location.pathname.split("/")[3];
    console.log(props.location.pathname.split("/"), path)
    // 项目集id
    const productId = props.match.params.productId;
    // 路由
    const productRouter = [
        // {
        //     title: `概览`,
        //     icon: 'survey-' + theme,
        //     defaultIcon: "survey-default",
        //     key: "overview",
        //     id: `/product/${productId}/overview`,
        //     encoded: "Survey",
        // },
        {
            title: `项目`,
            icon: 'project-' + theme,
            defaultIcon: "project-default",
            key: "project",
            id: `/product/${productId}/project`,
            encoded: "project",
        },
        {
            title: `事项`,
            icon: 'workitem-' + theme,
            defaultIcon: "workitem-default",
            id: `/product/${productId}/workitem`,
            key: "workitem",
            encoded: "workitem",
        },
        {
            title: `路线图`,
            icon: 'line-' + theme,
            defaultIcon: "line-default",
            id: `/product/${productId}/linemap`,
            key: "linemap",
            encoded: "Pannel",
        },
        {
            title: `模块`,
            icon: 'module-' + theme,
            defaultIcon: "module-default",
            key: "module",
            id: `/product/${productId}/module`,
            encoded: "module",
        },
        {
            title: "设置",
            icon: 'set-' + theme,
            defaultIcon: "set-default",
            id: `/product/${productId}/set/basicInfo`,
            key: "set",
            encoded: "set",
        }
    ];

    /**
     * 初次进入设置激活导航菜单样式
     */
    useEffect(() => {
        // 初次进入激活导航菜单
        // setSelectKey(props.location.pathname)
        // 获取项目集权限
        systemRoleStore.getInitProjectPermissions(getUser().userId, productId)
        return
    }, [productId, props.location.pathname])





    return (
        <Fragment>
            <ProjectAside
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                ChangeModal={ProductChangeModal}
                initRouters={productRouter}
                backName = {"返回首页"}
                path={path}
                setUrl={`/product/${productId}/set/basicInfo`}
                unNeedBottomSet = {true}// 不显示底部的设置
                backUrl={`/product`}
                iconName = "home"
            />

        </Fragment>
    )

}
export default withRouter(inject("systemRoleStore")(observer(ProductDetailAside)));