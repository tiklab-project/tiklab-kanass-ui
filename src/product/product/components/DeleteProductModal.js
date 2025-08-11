import {Modal} from "antd";
import {withRouter} from "react-router";
import React from "react";

const DeleteProductModal = (props) => {

    const {isModalVisible, handleOk, handleCancel} = props;

    return(
        <Modal
            title="是否删除"
            visible={isModalVisible}
            closable={false}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={"确定"}
            cancelText={"取消"}
            okType="danger"
            okButtonProps={{ type: "primary" }}
        >
            此产品及其关联的项目都将被删除。
        </Modal>
    )
};
export default withRouter(DeleteProductModal)