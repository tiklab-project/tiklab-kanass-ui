/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-18 13:32:42
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-22 15:44:02
 */
import React, { useState } from 'react';
import { Badge, TabBar,Popup } from 'antd-mobile';
import { renderRoutes } from "react-router-config";
import { useLocation} from 'react-router-dom'
import "../components/projectTabBar.scss";
import {verifyUserHoc} from "tiklab-eam-saas-ui";
// import {verifyUserHoc} from "tiklab-eam-ui";
import SystemSet from "../../systemSet/components/systemSet";
import { inject, observer } from 'mobx-react';

const ProjectTabBar = (props) => {
    const route = props.route;
    const {homeStore} = props;
    const { setSystemSetVisible, systemSetVisible } = homeStore;
    const location = useLocation()
    const { pathname } = location
    const setRouteActive = (value) => {
        props.history.push(value)
    }
    const tabs = [
        {
            key: '/index/home',
            title: '首页',
            icon:   <svg className="tabbar-icon" aria-hidden="true">
                <use xlinkHref="#icon-home"></use>
            </svg>,
            badge: Badge.dot,
        },
        {
            key: '/index/project',
            title: '项目',
            icon: <svg className="tabbar-icon" aria-hidden="true">
                <use xlinkHref="#icon-wiki"></use>
            </svg>,
        },
        {
            key: '/index/projectSet',
            title: '项目集',
            icon: <svg className="tabbar-icon" aria-hidden="true">
                <use xlinkHref="#icon-templateList"></use>
            </svg>,
        },
        {
            key: '/index/log',
            title: '日志',
            icon:  <svg className="tabbar-icon" aria-hidden="true">
                <use xlinkHref="#icon-file"></use>
            </svg>,
        }
    ]

    return (
        <div>
            <Popup
              visible={systemSetVisible}
              onMaskClick={() => {
                setSystemSetVisible(false)
              }}
              position='left'
              bodyStyle={{ width: '80vw' }}
            >
              <SystemSet />
            </Popup>
            <div>
                {renderRoutes(route.routes)}
            </div>
            <div className='bottom'>
                <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} title={item.title} icon={item.icon}/>
                    ))}
                </TabBar>
            </div>

        </div>

    )
}
const IndexSaasHoc = verifyUserHoc(inject("homeStore")(observer(ProjectTabBar)), "teamwire")
export default IndexSaasHoc;
