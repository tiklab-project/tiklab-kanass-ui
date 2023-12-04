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

const WorkDetailDrawer = (props) => {
    const detailRef = useRef()
    const { isModalVisible, setIsModalVisible, showPage, modelRef, workStore } = props;
    const { setWorkId } = workStore;

    const showModal = () => {
        setIsModalVisible(true);
    }

    useImperativeHandle(modelRef, () => ({
        showDetail: showModal
    }))

    useEffect(() => {
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
        } else {
            IsSelectclear = false
        }

        if (!detailRef.current.contains(e.target) && detailRef.current !== e.target && !IsSelectclear) {
            let pathname = props.location.pathname;
            const index = pathname.lastIndexOf("\/");
            pathname = pathname.substring(0, index);
            console.log(pathname);
            props.history.replace(`${pathname}`)
            setIsModalVisible(false)
            setWorkId(0)
        }
    }

    const closeDrawer = () => {
        console.log("关闭")
        let pathname = props.location.pathname;
        const index = pathname.lastIndexOf("\/");
        pathname = pathname.substring(0, index);
        console.log(pathname);
        props.history.replace(`${pathname}`)
        setIsModalVisible(false);
        setWorkId(0)
    };

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
        >
            <div ref={detailRef}>
                <WorkDetail {...props} showPage={showPage} setIsModalVisible={setIsModalVisible} />
            </div>
        </Drawer>
    </>


    );
};

export default inject("workStore")(observer(WorkDetailDrawer));