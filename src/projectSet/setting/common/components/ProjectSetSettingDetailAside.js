/*
 * @Descripttion: 项目详情页面左侧导航栏
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 13:13:36
 */

import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Layout, Button } from "antd";

import { useTranslation } from 'react-i18next';
import "./ProjectSetSettingDetailAside.scss"
const { Sider } = Layout;

const ProjectSetSettingDetailAside = (props) => {
    //语言包
    const { t } = useTranslation();
    const projectSetId = JSON.parse(localStorage.getItem("projectSet")).id;
    // 路由
    const prorouter = [
        {
            title: "项目集信息",
            icon: 'survey',
            key: `/projectSet/${projectSetId}/set/basicInfo`,
            encoded: "Survey",
        },
        {
            title: `${t('user')}`,
            icon: 'survey',
            key: `/projectSet/${projectSetId}/set/user`,
            encoded: "DominRole",
        },
        {
            title: `${t('privilege')}`,
            icon: 'survey',
            key: `/projectSet/${projectSetId}/set/dominRole`,
            encoded: "User",
        }
    ];
    // 当前选中路由
    const [selectKey, setSelectKey] = useState(`/projectScrumDetail/${projectSetId}/set/basicInfo`);

    // 菜单是否折叠
    const [isShowText, SetIsShowText] = useState(true)



    useEffect(() => {
        // 初次进入激活导航菜单
        setSelectKey(props.location.pathname)
        return
    }, [projectSetId])


    /**
     * 点击左侧菜单
     * @param {*} key 
     */
    const selectKeyFun = (key) => {
        setSelectKey(key)
        props.history.push(key)

    }

    const backProject = () => {
        props.history.push("/prodetail/overview")
    }


    return (
        <Fragment>
            <Sider trigger={null} width="200">
                <div className="projectSet-aside">

                    <div className="projectSet-title title">
                        {/* <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-program"></use>
                        </svg> */}
                        项目集设置
                    </div>
                    <ul className="projectSet-menu">
                        {
                            prorouter && prorouter.map(Item => {
                                return <div className={`projectSet-menu-submenu ${Item.key === selectKey ? "projectSet-menu-select" : ""}`}
                                    key={Item.key}
                                    onClick={() => selectKeyFun(Item.key)}
                                >
                                    {/* <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref={`#icon-${Item.icon}`}></use>
                                    </svg> */}
                                    <span className={`${isShowText ? "" : "projectSet-notext"}`}>
                                        {Item.title}
                                    </span>
                                </div>
                            })
                        }
                    </ul>
                </div>
            </Sider>
        </Fragment>
    )

}
export default withRouter(ProjectSetSettingDetailAside);