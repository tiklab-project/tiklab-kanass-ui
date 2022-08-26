import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import Dynamic from '../../../common/dynamic/dynamic';
import "./systemDynamic.scss"
import { getUser } from 'tiklab-core-ui';
const SystemDynamic = (props) => {
    const { homeStore } = props;
    const { findDynamicPage } = homeStore;

    const [dynamicList, setDynamicList] = useState([]);

    useEffect(() => {
        findDynamicPage().then((data) => {
            if (data.code === 0) {
                // setProjectList(data.data)
                setDynamicList(data.data.dataList)
            }
        })
    }, [])

    const goProdetail = (id, projectTypeId) => {
        localStorage.setItem("projectId", id);
        localStorage.setItem("projectTypeId", projectTypeId);
        // workStore.setWorkId("")
        props.history.push({ pathname: "/project/projectDetail" })
    }

    const [visible, setVisible] = useState(false);

    const status =  {
        1: "未开始",
        2: "已启动",
        3: "已结束",
    }

    const searchProject = (value) => {
       
    }
    return (
        <div className="system-dynamic">
            <div className='system-dynamic-content'>
                {/* <div className='title'>
                    <SearchBar
                        placeholder='请输入内容'
                        style={{
                            '--border-radius': '100px',
                        }}
                        onChange = {(value) => searchProject(value)}
                    />
                    <Button
                        size='mini'
                        color='primary'
                        onClick={() => {
                            setVisible(true)
                        }}
                    >
                        添加项目
                    </Button>
                </div> */}
                <div className="system-dynamic-box">
                    {
                        dynamicList && dynamicList.length > 0 && dynamicList.map(item => {
                            return <Dynamic  dynamicData = {item} {...props} key = {item.id}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default inject("homeStore")(observer(SystemDynamic));