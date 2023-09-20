/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 17:04:29
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:38:24
 */
import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Select, Drawer } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject } from "mobx-react";

const WorkBorderDetail = (props) => {
    const detailRef = useRef()
    const { isModalVisible, setIsModalVisible, showPage, modelRef } = props;
    const path = props.match.path;
    const projectId = props.match.params.id;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const bodyWidth = document.querySelector('body').offsetWidth;
    const [drawerWidth, setDrawerWidth] = useState()
    const showModal = () => {
        setIsModalVisible(true);

    }

    useImperativeHandle(modelRef, () => ({
        showDetail: showModal
    }))

    useEffect(() => {
        const width = document.querySelector('body').offsetWidth;
        if (isModalVisible) {
            if (width > 1400) {
                setDrawerWidth("60vw")
            }
            if (width <= 768 && width > 1280) {
                setDrawerWidth("70vw")
            }
            if (width < 768) {
                setDrawerWidth("80vw")
            }
        }

        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }

    }, [isModalVisible])


    const closeModal = (e) => {
        if (!detailRef.current) {
            return;
        }
        let IsSelectclear = false;
        if (e.target.localName === "path") {
            const classList = e.target.parentElement.parentElement.classList;
            if (classList.value === "anticon anticon-close-circle") {
                IsSelectclear = true
            }
        }else {
            IsSelectclear = false
        }
        if (!detailRef.current.contains(e.target) && detailRef.current !== e.target && !IsSelectclear) {
            if (path === `/index/projectDetail/:id/workTable`) {
                props.history.replace(`/index/projectDetail/${projectId}/workTable`)
            }
            if (path === `/index/projectDetail/:id/workBodar`) {
                props.history.replace(`/index/projectDetail/${projectId}/workBodar`)
            }

            if (path === `/index/workTable`) {
                props.history.replace(`/index/workTable`)
            }
            if (path === `/index/workBodar`) {
                props.history.replace(`/index/workBodar`)
            }

            if (path === `/index/:id/sprintdetail/:sprint/workTable`) {
                props.history.replace(`/index/${projectId}/sprintdetail/${sprintId}/workTable`)
            }
            if (path === `/index/:id/sprintdetail/:sprint/workBodar`) {
                props.history.replace(`/index/${projectId}/sprintdetail/${sprintId}/workBodar`)
            }

            if (path === `/index/:id/versiondetail/:version/workTable`) {
                props.history.replace(`/index/${projectId}/versiondetail/${versionId}/workTable`)
            }
            if (path === `/index/:id/versiondetail/:version/workBodar`) {
                props.history.replace(`/index/${projectId}/versiondetail/${versionId}/workBodar`)
            }



            if (path === `/index/projectDetail/:id/linemap`) {
                console.log(props.history)
                props.history.replace(`/index/projectDetail/${projectId}/linemap`)
            }
            setIsModalVisible(false)
        }
    }

    const closeDrawer = () => {
        if (path === `/index/projectDetail/:id/workTable`) {
            console.log(props.history)
            props.history.replace(`/index/projectDetail/${projectId}/workTable`)
        }
        setIsModalVisible(false);
    };

    const test = [
        {
            value: 'jack',
            label: 'Jack',
        },
        {
            value: 'lucy',
            label: 'Lucy',
        },
        {
            value: 'Yiminghe',
            label: 'yiminghe',
        },
        {
            value: 'disabled',
            label: 'Disabled',
            disabled: true,
        },
    ];
    return (<>
        <Drawer
            placement="right"
            onClose={closeDrawer}
            // title={"事项详情"}
            visible={isModalVisible}
            className={`${isModalVisible ? "work-table-detail" : ''} `}
            // width={drawerWidth}
            closable={false}
            destroyOnClose={true}
            mask={false}
        // getContainer={false}
        >
            <div ref={detailRef}>
                <WorkDetail {...props} showPage={showPage} setIsModalVisible={setIsModalVisible} />
            </div>
            {/* <div ref={detailRef}>
               
                <Select
                    defaultValue="lucy"
                    style={{
                        width: 120,
                    }}
                    allowClear
                >
                    {
                        test && test.map((item) => {
                            return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
                        })
                    }
                </Select>
            </div> */}



        </Drawer>
    </>


    );
};

export default inject("workStore")(observer(WorkBorderDetail));