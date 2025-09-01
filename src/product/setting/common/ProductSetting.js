/*
 * @Descripttion: 产品设置页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 15:09:09
 */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from 'antd';
import "./ProductSettingDetailAside.scss";
import { renderRoutes } from "react-router-config";
import { observer, inject } from "mobx-react";
import ProductSetDetailAdide from "./ProductSettingDetailAside"
import { ProjectNav, SystemNav } from "tiklab-privilege-ui";
import { useTranslation } from "react-i18next";
import { getUser } from "tiklab-core-ui";

const Productting = (props) => {
    const { route, systemRoleStore } = props;
    const { t } = useTranslation();

    // 获取当前项目id
    const productId = props.match.params.productId;


    useEffect(() => {
        // 从信息页面跳入项目详情页面时，获取项目id
        let search = props.location.search;
        if (search !== "") {
            search = search.split("=")
            localStorage.setItem("projectId", search[1]);
        }
        // 初始化权限
        systemRoleStore.getInitProjectPermissions(getUser().userId, productId)
        return
    }, [productId])

    const prorouter = [
        {
            title: "产品信息",
            icon: 'survey',
            id: `/product/${productId}/set/basicInfo`,
            encoded: "Survey",
        },
        {
            title: `${t('user')}`,
            icon: 'survey',
            id: `/product/${productId}/set/user`,
            encoded: "DominRole",
            // purviewCode: "ProductUser",
        },
        {
            title: `${t('privilege')}`,
            icon: 'survey',
            id: `/product/${productId}/set/dominRole`,
            encoded: "User",
            // purviewCode: "ProductPrivilege",
        }
    ];

    return (
        <Layout className="product-set">
            <ProjectNav
                {...props}
                projectRouters={prorouter}
                domainId = {productId}
                outerPath={`/product/${productId}/set`}
                noAccessPath={`/product/${productId}/set/noaccess`} //没有资源访问权限页面的路由参数
            >
                <ProductSetDetailAdide
                    {...props}
                    prorouter ={prorouter}
                />
                <Layout>
                    {renderRoutes(route.routes)}
                </Layout>
            </ProjectNav>


        </Layout>
    )

}
export default inject("systemRoleStore")(observer(Productting));