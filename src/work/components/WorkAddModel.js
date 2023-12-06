/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-15 14:34:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-01 15:42:05
 */
import React, { useImperativeHandle, useState, useRef, useEffect } from "react";
import { Modal, message } from 'antd';
// import "../../common/components/projectDetail.scss";
import WorkAddPage from "./WorkAddPage";
import "./WorkAddModel.scss"
import { observer, inject } from "mobx-react";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const WorkAddModel = (props) => {

    const { workAddModel, workType, getWorkDetail, setChildWorkList, workTypeId } = props
    const workAddPageRef = useRef()
    const [showAddModel, setShowAddModel] = useState(false)

    const [isEditStart, setIsEditStart] = useState(false);

    // 关闭详情弹窗,提交数据
    const handleOk = () => {
        workAddPageRef.current.submit(setShowAddModel)
    };


    // 点击取消按钮
    const handleCancel = () => {
        if (isEditStart === true) {
            Modal.confirm({
                title: '您的更改将不会保存',
                icon: <ExclamationCircleOutlined />,
                content: '如果您离开此页面，我们将无法保存您的数据',
                className: "work-addmodel-close-cinfirm",
                onOk() {
                    setShowAddModel(false);
                }
            });
        }else {
            setShowAddModel(false);
        }
        setIsEditStart(false)
    };


    // 暴露方法给父组件
    useImperativeHandle(workAddModel, () => ({
        setShowAddModel: setShowAddModel
    }))


    return (
        <Modal
            // title= {"添加事项"} 
            visible={showAddModel}
            // visible = {true}
            className="work-addmodel"
            width={970}
            destroyOnClose={true}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText="取消"
            okText="确定"
            closable={false}
            footer={null}
            maskClosable={false}
        >
            <WorkAddPage
                workType={workType}
                workAddPageRef={workAddPageRef}
                getWorkDetail={getWorkDetail}
                setChildWorkList={setChildWorkList}
                setShowAddModel={setShowAddModel}
                handleCancel = {handleCancel}
                {...props}
                workTypeId={workTypeId}
                setIsEditStart={setIsEditStart}
            ></WorkAddPage>
        </Modal>
    )
}
export default inject("workStore")(observer(WorkAddModel));