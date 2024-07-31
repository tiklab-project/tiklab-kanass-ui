import React from "react";
import Header from "./Header";
import { AppLink, AvatarLink, HelpLink} from 'thoughtware-licence-ui';

const HeaderCe = (props) => {
    return <Header AppLink = {AppLink} AvatarLink = {AvatarLink} HelpLink = {HelpLink} {...props} />
}

export default HeaderCe;