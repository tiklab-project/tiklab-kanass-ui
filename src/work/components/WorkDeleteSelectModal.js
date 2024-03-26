
import { inject, observer } from "mobx-react";
import { Dropdown, Menu, Modal } from "antd";
import React from "react";
import Button from "../../common/button/Button";
import "./WorkDeleteSelectModal.scss"
const WorkDeleteSelectModal = (props) => {
    const { getPopupContainer, delectCurrentWorkItem, delectWorkItemAndChildren, setDeleteSelectModal, deleteSelectModal } = props;

    const closeDeleteSelectModal = () => {
        setDeleteSelectModal(false)
    }

    const delectWorkItem = (value) => {
        switch (value) {
            case "ones":
                delectCurrentWorkItem();
                break;
            case "all":
                delectWorkItemAndChildren();
                break
            default:
                break;
        }
        setDeleteSelectModal(false)
    }

    const moreMenu = () => {
        return <Menu onClick={() => setDeleteSelectModal(true)}>
            <Menu.Item key="delete">
                <div>删除</div>
            </Menu.Item>
        </Menu>
    };

    return (<>
        {/* <Dropdown
            overlay={() => moreMenu()}
            placement="bottomLeft"
            trigger="click"
            getPopupContainer = {getPopupContainer ? () => getPopupContainer.current : null}
        >
            <svg className="svg-icon" aria-hidden="true" style={{ cursor: "pointer" }}>
                <use xlinkHref="#icon-more"></use>
            </svg>

        </Dropdown> */}
        <Modal
            visible={deleteSelectModal}
            title="删除事项"
            // onOk={handleOk}
            onCancel={closeDeleteSelectModal}
            // getContainer={() => getPopupContainer.current}
            footer={null}
        >
            <div>
                选择删除当前事项还是当前事项和所有下级事项？
            </div>
            <div className="delete-button-group">
                <Button onClick={closeDeleteSelectModal}>
                    取消
                </Button>
                <Button type="primary" onClick={() => delectWorkItem("ones")}>
                    删除当前事项
                </Button>
                <Button type="primary" onClick={() => delectWorkItem("all")}>
                    删除当前事项以及所有下级
                </Button>
            </div>
        </Modal>
    </>


    )
}

export default inject("workStore")(observer(WorkDeleteSelectModal));