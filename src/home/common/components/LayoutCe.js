import React from "react";
import {UserVerify} from "tiklab-eam-ui";
import Layout from "./Layout";
import { AppLink, AvatarLink, HelpLink } from 'tiklab-licence-ui';

const LayoutPro = props => {
    return (
        <Layout
            AppLink={AppLink}
            AvatarLink={AvatarLink}
            HelpLink={HelpLink}
            {...props}
        />
    )
}


export default UserVerify(LayoutPro,"/noAuth", "kanass")