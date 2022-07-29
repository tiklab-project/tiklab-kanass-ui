/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-18 13:32:42
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-22 15:44:02
 */
import React, { useState } from 'react';
import { Badge, TabBar } from 'antd-mobile';
import { renderRoutes } from "react-router-config";
import {
    useLocation,
} from 'react-router-dom'
import {
    AppOutline,
    UserOutline,
} from 'antd-mobile-icons';
import "../components/projectTabBar.scss"
import { verifyUserHOC } from "doublekit-eam-ui";
const ProjectTabBar = (props) => {
    const route = props.route;
    // const history = useHistory()
    const location = useLocation()
    const { pathname } = location
    const setRouteActive = (value) => {
        props.history.push(value)
    }
    const tabs = [
        {
            key: '/index/home',
            title: '首页',
            icon: <AppOutline />,
            badge: Badge.dot,
        },
        {
            key: '/index/set',
            title: '设置',
            icon: <UserOutline />,
        },
    ]

    const [activeKey, setActiveKey] = useState('todo')

    return (
        <div>
            <div>
                {renderRoutes(route.routes)}
            </div>
            <div className='bottom'>
                <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} title={item.title} />
                    ))}
                </TabBar>
            </div>

        </div>

    )
}

const IndexSaasHoc = verifyUserHOC(ProjectTabBar, "project")
export default IndexSaasHoc;