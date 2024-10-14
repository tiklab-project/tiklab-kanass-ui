import React from "react";
import {UserVerify} from "tiklab-user-extension-ui";
import Layout from "./Layout";

const LayoutPro = props => {
    return (
        <Layout
            {...props}
        />
    )
}


export default UserVerify(LayoutPro,"/noAuth", "kanass")