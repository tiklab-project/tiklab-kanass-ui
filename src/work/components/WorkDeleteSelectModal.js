
import { inject, observer } from "mobx-react";
import { Dropdown, Menu, Modal } from "antd";
import React, { useEffect, useState } from "react";
import "./WorkDeleteSelectModal.scss"
const WorkDeleteSelectModal = (props) => {
    const { getPopupContainer, delectCurrentWorkItem, setDeleteSelectModal, 
        deleteSelectModal, haveChildren, workId, setWorkId } = props;
    console.log(workId)
    const [buttonText, setButtonText] = useState("删除")
    useEffect(()=> {
        if(deleteSelectModal){
            getHaveChildren()
        }
    }, [deleteSelectModal])

    const getHaveChildren = () => {
        
    }

    const closeDeleteSelectModal = () => {
        setDeleteSelectModal(false)
    }
    
    const selectAction = (value) => {
        setWorkId(workId)
        haveChildren({ id: workId }).then(res => {
            if (res.code === 0) {
                let buttonText = "删除"
                if (res.data) {
                    buttonText = "删除事项和下级事项";
                } else {
                    buttonText = "删除"
                }
                if(value.key === "delete"){
                    Modal.confirm({
                        title: '删除事项?',
                        content: "确定删除事项",
                        centered: true,
                        okText: buttonText,
                        cancelText: "取消",
                        className: "delete-modal",
                        getContainer: getPopupContainer ? () => getPopupContainer.current : null,
                        onOk() { delectCurrentWorkItem(workId) },
                        // onCancel() { closeDeleteSelectModal(workId)},
                    });
                }
            }
        })
       
    }
    const moreMenu = () => {
        return <Menu onClick={(value) => selectAction(value)}>
            <Menu.Item key="delete">
                <div>删除</div>
            </Menu.Item>
        </Menu>
    };
    return (<>
        <Dropdown
            overlay={() => moreMenu()}
            placement="bottomLeft"
            trigger="click"
            getPopupContainer = {getPopupContainer ? () => getPopupContainer.current : null}
        >
            <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                <use xlinkHref="#icon-more"></use>
            </svg>

        </Dropdown> 
    </>


    )
}

export default inject("workStore")(observer(WorkDeleteSelectModal));