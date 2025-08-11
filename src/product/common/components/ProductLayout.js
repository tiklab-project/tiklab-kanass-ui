import React, {useState} from "react";
import {Provider} from "mobx-react";
import {Layout} from "antd";
import {renderRoutes} from "react-router-config";
import ProductStore from "../../product/store/ProductStore";
import ProductAside from "./ProductAside";
import "./ProductLayout.scss"

const ProductDetailLayout = (props) => {
    const store = {
        productStore: ProductStore
    }
    const { route } = props;
    const [isShowText, SetIsShowText] = useState(false)
    return (<Provider {...store}>
            <Layout className="product-detail">
                <ProductAside
                    isShowText = {isShowText}
                    SetIsShowText = {SetIsShowText}
                    {...props}
                />
                <Layout className="prodetail-content">
                    {renderRoutes(route.routes)}
                </Layout>
            </Layout >
        </Provider>




    )
}
export default ProductDetailLayout;