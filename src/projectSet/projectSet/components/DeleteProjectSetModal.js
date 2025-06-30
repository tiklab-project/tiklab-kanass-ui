import {withRouter} from "react-router";
import {Modal} from "antd";
import React from "react";

const DeleteProjectSetModal = (props) => {

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
            此项目集与项目的关联关系将被解除。
        </Modal>
    )
};

export default withRouter(DeleteProjectSetModal)