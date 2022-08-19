/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 19:14:48
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-21 09:11:10
 */
/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 17:06:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:07:05
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "../components/version.scss";
import { withRouter } from 'react-router';

const VersionList = (props) => {
    const { versionStore } = props;
    const { findVersionList } = versionStore;
    const [versionList, setVersionList] = useState();
    const projectId = localStorage.getItem("projectId");
    useEffect(() => {
        findVersionList({ projectId: projectId }).then((data) => {
            if (data.code === 0) {
                setVersionList(data.data)
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
            <div className='version'>
                <div className='version-search'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                    />
                    <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            props.history.push("/versionAdd")
                        }}
                    >
                        添加版本
                    </Button>
                </div>
                {
                    versionList && versionList.length > 0 && versionList.map(item => {
                        return <div className="version-list">
                            <div className='version-left'>
                                <div className='version-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div >
                                        <span className='version-title'>{item.name}</span>
                                        <span onClick={() => props.history.push({ pathname: "/project/projectDetail" })}>
                                            {item.master ? item.master.name : "admin"}
                                        </span>
                                    </div>
                                    <div>
                                        {item.startTime} ~ {item.publishDate}
                                    </div>
                                </div>
                            </div>
                            <div>
                                
                                <span>
                                    {statusSet(item.versionState)}
                                </span>

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
export default withRouter(inject("versionStore")(observer(VersionList)));