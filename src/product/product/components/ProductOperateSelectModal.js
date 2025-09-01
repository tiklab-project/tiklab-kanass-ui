import {Dropdown, Form, Menu} from "antd";
import React, {useEffect, useState} from "react";
import moment from "moment";
import DeleteProductModal from "../../../product/product/components/DeleteProductModal";
import EditProductModal from "../../../product/product/components/EditProductModal";
import {withRouter} from "react-router";
import {PrivilegeButton} from "tiklab-privilege-ui";

const ProductOperateSelectModal = (props) => {

    const { getPopupContainer, productInfo, productStore  } = props
    const { deleProduct, updateProduct, findProductPage, getUseList, uselist } = productStore

    const [confirmForm] = Form.useForm();// 删除
    const [form] = Form.useForm();// 修改
    const [deleteModalVisible, setDeleteModalVisible] = useState( false)
    const [editModalVisible, setEditModalVisible] = useState( false)
    const dateFormat = 'YYYY/MM/DD';


    useEffect(() => {
        info()
        getUseList().then(res => {
            if (res.code === 0) {
                console.log(uselist)
            }

        })
        return;
    }, [])

    const info = () => {
        form.setFieldsValue({
            name: productInfo.name,
            remark: productInfo.remark,
            master: productInfo.master.id,
            productLimits: productInfo.productLimits,
            startTime: [moment(productInfo.startTime, dateFormat), moment(productInfo.endTime, dateFormat)]
        })
    };

    const cancel = () => {
        form.setFieldsValue({
            name: productInfo.name,
            remark: productInfo.remark,
            master: productInfo.master.id,
            productLimits: productInfo.productLimits,
            startTime: [moment(productInfo.startTime, dateFormat), moment(productInfo.endTime, dateFormat)]
        })
        setEditModalVisible(false)
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: { id: values.master },
                productLimits: values.productLimits,
                id: productInfo.id
            }

            updateProduct(data).then(res => {
                if (res.code === 0) {
                    findProductPage()
                }
                setEditModalVisible(false)
            })

        })
    }


    // 删除确认
    const handleOk = () => {
        deleProduct(productInfo.id).then(response => {
            if (response.code === 0) {
                findProductPage()
            }
        })
        setDeleteModalVisible(false);
    };
    // 删除取消
    const handleCancel = () => {
        setDeleteModalVisible(false);
    };

    const selectAction = (value) => {

        if(value.key === "delete"){
            setDeleteModalVisible(true);
        }else if(value.key === "edit") {
            setEditModalVisible(true)
        }

    }

    const moreMenu = () => {
        return <Menu onClick={(value) => selectAction(value)}>
            <PrivilegeButton code={"product_update"}>
                <Menu.Item key="edit">
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <span>编辑</span>
                </Menu.Item>
            </PrivilegeButton>
            <PrivilegeButton code={"product_delete"}>
                <Menu.Item key="delete">
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                    <span>删除</span>
                </Menu.Item>
            </PrivilegeButton>
        </Menu>
    };

    return (

        <>
            <Dropdown
                overlay={() => moreMenu()}
                placement="bottomLeft"
                trigger="click"
                getPopupContainer = {getPopupContainer ? () => getPopupContainer.current : null}
            >
                <svg style={{
                    width: "22px",
                    height: "22px"
                }} className="product-action-icon" aria-hidden="true">
                    <use xlinkHref="#icon-more-default"></use>
                </svg>

            </Dropdown>

            <DeleteProductModal
                isModalVisible={deleteModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />

            <EditProductModal
                form={form}
                editModalVisible={editModalVisible}
                onFinish={onFinish}
                cancel={cancel}
                useList={uselist}
            />

        </>



    );
};
export default withRouter(ProductOperateSelectModal);