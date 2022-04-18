/*
 * @Descripttion: 页面头部
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-01-08 10:44:07
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-12 11:08:35
 */
import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {Col, Row, Dropdown, Menu, Button} from "antd";
import WorkMenu from './workMenu';
import { withRouter } from 'react-router';
import { Badge,Avatar } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
const Header = props => {
    const {
        logo,
        AppConfigComponent,
        languageSelectData = [], // 切换语言包的数据
        projectLogout,
        routers
    } = props;
    const [currentLink, setCurrentLink] = useState(props.location.pathname);

    const { i18n } = useTranslation();
    
    const [lan, setLan] = useState(i18n.language);
    

    const onClickLan = ({ key }) => {
        i18n.changeLanguage(languageSelectData[key].value)
        setLan(languageSelectData[key].value)
    };

    const changeCurrentLink = item => {
        setCurrentLink(item.to)
        props.history.push(item.to)
    }

    const renderRouter = () => {
        if (routers) {
            return (
                <div className={'frame-header-link'}>
                    <div key='home' onClick={ () => changeCurrentLink(routers[0])} className={currentLink === routers[0].to ? 'frame-header-link-active' : null}> {routers[0].title}</div>
                    <div key='project' onClick={ () => changeCurrentLink(routers[1])} className={currentLink === routers[1].to ? 'frame-header-link-active' : null}> {routers[1].title}</div>
                    <div key='workItem' onClick={ () => changeCurrentLink(routers[2])} className={currentLink === routers[2].to ? 'frame-header-link-active' : null}> {routers[2].title}</div>
                    {/* <WorkMenu setCurrentLink = {setCurrentLink} currentLink ={currentLink}/> */}
                    <div key='programs' onClick={ () => changeCurrentLink(routers[3])} className={currentLink === routers[3].to ? 'frame-header-link-active' : null}> {routers[3].title}</div>
                    <div key='system' onClick={ () => changeCurrentLink(routers[4])} className={currentLink === routers[4].to ? 'frame-header-link-active' : null}> {routers[4].title}</div>
                </div>
            )
        }
    }

    const menu = (
        <Menu onClick={onClickLan}>
            {
                languageSelectData.map((item, index) => {
                    return <Menu.Item key={index} value={item.value}>{item.label}</Menu.Item>
                })
            }
        </Menu>
    );
    
    return(
        <Row className="frame-header">
            <Col span={12}>
                <div className={'frame-header-right'}>
                    {AppConfigComponent}
                    {logo && <div className={'frame-header-logo'}><img src={logo} alt={'logo'} /></div> }
                    {renderRouter()}
                </div>
            </Col>
            <Col span={12}>
                <div className={'frame-header-right'}>
                    <div className='frame-header-right-search-wrap'>
                        {props.search}
                    </div>
                    <div className={'frame-header-right-text'}>
                        {/* {
                            MessageIconComponent
                        } */}
                        <a href="#/index/userMessage">
                            <Badge count={5}>
                                <Avatar style={{ background: "#fff" }} icon={<MessageOutlined style={{color: "#999",fontSize: "30px"}}/>} />
                            </Badge>
                        </a>
                        <Dropdown overlay={menu} className={'frame-header-dropdown'}>
                            <Button>{lan}</Button>
                        </Dropdown>
                        <span onClick={projectLogout}>退出</span>
                    </div>
                </div>
            </Col>
        </Row>
    )
}
export default withRouter(Header);