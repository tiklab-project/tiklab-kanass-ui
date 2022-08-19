/*
 * @Descripttion: 
 * @module: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 19:14:48
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-21 09:11:10
 */
/*
 * @Descripttion: 
 * @module: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 17:06:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:07:05
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "../components/module.scss";
import { withRouter } from 'react-router';

const ModuleList = (props) => {
    const { moduleStore } = props;
    const { findModuleList } = moduleStore;
    const [moduleList, setModuleList] = useState();
    const projectId = localStorage.getItem("projectId");
    useEffect(() => {
        findModuleList({ projectId: projectId }).then((data) => {
            if (data.code === 0) {
                setModuleList(data.data)
            }
        })
    }, [])

    const statusSet = (value) => {
        let data = ""
        switch (value) {
            case "1":
                data = "未开始";
                break;
            case "2":
                data = "已启动";
                break;
            case "3":
                data = "已结束";
                break;
            default:
                data = "未知";
                break;

        }
        return data;
    }

    return (
        <div className="home">
            <div className='module'>
                <div className='module-search'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                            'width': "100%"
                        }}
                    />
                    {/* <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            props.history.push("/moduleAdd")
                        }}
                    >
                        添加里程碑
                    </Button> */}
                </div>
                {
                    moduleList && moduleList.length > 0 && moduleList.map(item => {
                        return <div className="module-list">
                            <div className='module-left'>
                                <div className='module-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div >
                                        <span className='module-title'>{item.name}</span>
                                        <span onClick={() => props.history.push({ pathname: "/project/projectDetail" })}>
                                            {item.master ? item.master.name : "admin"}
                                        </span>
                                    </div>
                                    <div>
                                        {item.moduleTime}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <EyeOutline />
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default withRouter(inject("moduleStore")(observer(ModuleList)));