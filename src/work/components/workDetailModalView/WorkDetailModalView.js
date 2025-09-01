/*
 * @Descripttion: 事项详情抽屉
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-08 17:04:29
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:29
 */
import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Select, Drawer } from 'antd';
import WorkDetail from "../WorkDetail";
import "./WorkDetailModalView.scss"
import { observer, inject } from "mobx-react";

const WorkDetailModalView = (props) => {
    const detailRef = useRef()
    const { isModalVisible, setIsModalVisible, showPage, modelRef, workStore,
        delectCurrentWorkItem, detailWidth } = props;
    const { setWorkId, workShowType } = workStore;

    /**
     * 打开事项详情抽屉
     */
    const showModal = () => {
        setIsModalVisible(true);
    }

    const getModalWidth = () => {
        const width = window.innerWidth;

        if (width >= 1600) {
            return 1000;
        } else if (width < 1600 && width >= 1200) {
            return 900;
        } else if (width < 1200 && width >= 992) {
            return 750;
        } else if (width < 992 && width >= 768) {
            return 650;
        } else if (width < 768 && width >= 576) {
            return 430;
        } else if (width < 576) {
            return 430;
        }
    }

    const getModalHeight = () => {
        const height = window.innerHeight;

        if (height >= 900) {
            return 800;
        } else if (height >= 768) {
            return 700;
        } else if (height >= 576) {
            return 600;
        } else {
            return 500;
        }
    };

    /**
     * 暴露给父组件的方法
     */
    useImperativeHandle(modelRef, () => ({
        showDetail: showModal
    }))

    /**
     * 监听鼠标事件，关闭事项详情抽屉
     */
    useEffect(() => {
        console.log("出发了  父组件effect")
        const handleClickOutside = (event) => {
            if (detailRef.current && !detailRef.current.contains(event.target)) {
                closeDrawer();
            }
        };

        document.addEventListener("mouseup", handleClickOutside, false);
        return () => {
            document.removeEventListener("mouseup", handleClickOutside, false);
        }

    }, [isModalVisible])

    /**
     * 关闭事项详情抽屉
     */
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

        if (!detailRef.current.contains(e.target) && detailRef.current !== e.target && !IsSelectclear && isModalVisible) {
            let pathname = props.location.pathname; // props.location.pathname;
            if(workShowType === "gantt"){
                props.history.replace(`${pathname}`)
            }else {
                const index = pathname.lastIndexOf("\/");
                pathname = pathname.substring(0, index);
                props.history.replace(`${pathname}`)
            }

            setIsModalVisible(false)
            setWorkId(0)
        }
    }

    /**
     * 手动关闭事项详情抽屉
     */
    const closeDrawer = () => {
        let pathname = props.location.pathname;
        const index = pathname.lastIndexOf("\/");
        pathname = pathname.substring(0, index);
        props.history.replace(`${pathname}`)
        setIsModalVisible(false);
        setWorkId(0)
    };

    return (<>
            <Modal
                // title="事项详情"
                placement="right"
                onClose={closeDrawer}
                visible={isModalVisible}
                className={"work-detail-modal-view"}
                closable={false}
                destroyOnClose={true}
                width={getModalWidth()}
                height={getModalHeight()}
                mask={true}
                footer={null}
            >
                <div className="work-detail-drawer" ref={detailRef}>
                    <WorkDetail
                        {...props}
                        showPage={showPage}
                        // deleteWork = {deleteWork}
                        setIsModalVisible={setIsModalVisible}
                        delectCurrentWorkItem = {delectCurrentWorkItem}
                        closeModal = {closeModal}
                        modalView={true}
                    />
                </div>
            </Modal>
        </>


    );
};

export default inject("workStore")(observer(WorkDetailModalView));