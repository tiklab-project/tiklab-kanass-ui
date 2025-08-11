import React, {useState} from "react";
import GideImge from "../../../assets/images/projectGide.png";
import {PrivilegeButton} from "tiklab-privilege-ui";
import Button from "../../../common/button/Button";
import {withRouter} from "react-router";
import {observer} from "mobx-react";
import "./ProductGide.scss"
import ProductAdd from "./ProductAdd";

const ProductGide = (props) => {
    const [name, setName] = useState("添加产品")
    const [productAddVisible, setProductAddVisible] = useState(false);

    return (
        <div className="product-gide">
            <div>
                <img src={GideImge} />
            </div>
            <div className="gide-right">
                <div>
                    您还没有产品
                    {/*<PrivilegeButton code={'ProductAdd'}  {...props}>*/}
                        <span>，请先</span>
                    {/*</PrivilegeButton>*/}
                </div>
                {/*<PrivilegeButton code={'ProductAdd'}  {...props}>*/}
                    <Button
                        style={{ width: "fit-content" }}
                        type="primary" onClick={() => {setProductAddVisible(true)}} buttonText={name} >
                    </Button>
                {/*</PrivilegeButton>*/}

            </div>
            <ProductAdd
                productAddVisible={productAddVisible}
                setProductAddVisible={setProductAddVisible}
            />
        </div>
    )
}
export default withRouter(observer(ProductGide));