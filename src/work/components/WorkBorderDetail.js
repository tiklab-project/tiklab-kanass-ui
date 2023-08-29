/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 17:04:29
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 11:38:24
 */
import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Button, Drawer } from 'antd';
import WorkDetail from "./WorkDetail";
import "./WorkDetail.scss"
import { observer, inject } from "mobx-react";

const WorkBorderDetail = (props) => {
    const detailRef = useRef()
    const { isModalVisible, setIsModalVisible, showPage, modelRef } = props;
    const path = props.match.path;
    const projectId = props.match.params.id;
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
        console.log(isModalVisible)
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
        if (!detailRef.current.contains(e.target) && detailRef.current !== e.target) {
            if (path === `/index/projectDetail/:id/workTable`) {
                console.log(props.history)
                props.history.replace(`/index/projectDetail/${projectId}/workTable`)
            }
            if (path === `/index/projectDetail/:id/workBodar`) {
                console.log(props.history)
                props.history.replace(`/index/projectDetail/${projectId}/workBodar`)
            }

            if (path === `/index/workTable`) {
                console.log(props.history)
                props.history.replace(`/index/workTable`)
            }
            if (path === `/index/workBodar`) {
                console.log(props.history)
                props.history.replace(`/index/workBodar`)
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
    return (<>
        <Drawer
            placement="right"
            onClose={closeDrawer}
            // title={"事项详情"}
            visible={isModalVisible}
            className={`${isModalVisible ?  "work-table-detail" : ''} `}
            // width={drawerWidth}
            closable={false}
            destroyOnClose={true}
            mask={false}
        // getContainer={false}
        >
            <div ref={detailRef}>
                <WorkDetail {...props} showPage={showPage} setIsModalVisible={setIsModalVisible} />
            </div>

        </Drawer>
    </>


    );
};

export default inject("workStore")(observer(WorkBorderDetail));