
import { inject, observer } from "mobx-react";
import { Dropdown, Menu, Modal } from "antd";
import React, { useEffect, useState } from "react";
import Button from "../../common/button/Button";
import "./WorkDeleteSelectModal.scss"
const WorkDeleteSelectModal = (props) => {
    const { getPopupContainer, delectCurrentWorkItem, setDeleteSelectModal, 
        deleteSelectModal, haveChildren, workId } = props;
    
    const [buttonText, setButtonText] = useState("删除")
    useEffect(()=> {
        if(deleteSelectModal){
            getHaveChildren()
        }
    }, [deleteSelectModal])

    const getHaveChildren = () => {
        haveChildren({ id: workId }).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    setButtonText("删除事项和下级事项")
                } else {
                    setButtonText("删除")
                }
            }
        })
    }

    const closeDeleteSelectModal = () => {
        setDeleteSelectModal(false)
    }
    
    const selectAction = (value) => {
        if(value.key === "delete"){
            Modal.confirm({
                title: '确定删除事项?',
                content: content,
                centered: true,
                okText: buttonText,
                cancelText: "取消",
                getContainer: getPopupContainer,
                onOk() { delectCurrentWorkItem },
                onCancel() { closeDeleteSelectModal},
            });
        }
    }

    return (<>
        {/* <Modal
            visible={deleteSelectModal}
            title="删除事项"
            // onOk={handleOk}
            onCancel={closeDeleteSelectModal}
            getContainer={() => getPopupContainer.current}
            footer={null}
        >
            <div>
                确定删除事项？
            </div>
            <div className="delete-button-group">
                <Button onClick={closeDeleteSelectModal}>
                    取消
                </Button>

                <Button type="primary" onClick={() => delectCurrentWorkItem()}>
                    {buttonText}
                </Button>
            </div>
        </Modal> */}
    </>


    )
}

export default inject("workStore")(observer(WorkDeleteSelectModal));