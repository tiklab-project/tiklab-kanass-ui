import React, {useState} from "react";
import {message, Modal, Spin} from "antd";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import ProductAddInfo from "../../../product/product/components/ProductAddInfo";
import ProductStore from "../store/ProductStore";
import "./ProductAdd.scss";
import {getUser} from "tiklab-core-ui";

const ProductAdd = (props) => {
    const store = {
        productStore: ProductStore
    }
    const [visible, setVisible] = React.useState(false);
    const { setAllProductList, productAddVisible, setProductAddVisible } = props;
    const { addProduct, getProductlist, findAllProduct, creatIcon, findIconList, findProduct } = ProductStore;


    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)


    const getIconList = () => {
        findIconList({ iconType: "product" }).then((res) => {
            // setIconList(res.data)
        })
    }

    /**
     *上传图标
     */
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const upLoadIcon = {
        name: 'uploadFile',
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                const params = {
                    iconName: info.file.name,
                    iconUrl: info.file.response.data.fileName,
                    iconType: "product"
                }
                creatIcon(params).then((res) => {
                    if (res.code === 0) {
                        getIconList()
                    } else {

                    }
                })
                message.success(`${info.file.name} 文件上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 文件上传失败.`);
            }
        },
    };

    const Head = () => {
        return (
            <Breadcumb
                firstText="添加产品"
            >
                <div onClick={() => props.history.goBack()} className="productadd-close">
                    <svg className="svg-icon" aria-hidden="true">
                        <use xlinkHref="#icon-close"></use>
                    </svg>
                </div>
            </Breadcumb>
        )
    }

    const onCancel = () => {
        setProductAddVisible(false)
    }

    return (
        <Modal
            title={"添加产品"}
            visible={productAddVisible}
            height={600}
            width={700}
            footer={null}
            onCancel={onCancel}
        >
            <div className="product-add">
                <Spin spinning={loading} tip="添加中...">
                    <ProductAddInfo
                        findAllProduct={findAllProduct}
                        addProduct={addProduct}
                        setAllProductList={setAllProductList}
                        getProductlist={getProductlist}
                        setVisible={setVisible}
                        setCurrentStep={setCurrentStep}
                        onCancel={onCancel}
                        setLoading={setLoading}
                        findProduct={findProduct}
                    />
                </Spin>
            </div>
        </Modal>

    );
};

export default ProductAdd;