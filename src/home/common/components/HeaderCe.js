import React from "react";
import Header from "./Header";
import { AppLink, AvatarLink, HelpLink } from 'thoughtware-licence-ui';
import { AppLink as AppLinkCloud, AvatarLink as AvatarLinkCloud, HelpLink as HelpLinkCloud } from 'thoughtware-licence-cloud-ui';

const HeaderCe = (props) => {
    const { isShowText, SetIsShowText } = props;
    return <>
        {
            version === "cloud" ? <Header
                AppLink={AppLinkCloud}
                AvatarLink={AvatarLinkCloud}
                HelpLink={HelpLinkCloud}
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                {...props}
            />
            :
            <Header
                AppLink={AppLink}
                AvatarLink={AvatarLink}
                HelpLink={HelpLink}
                isShowText={isShowText}
                SetIsShowText={SetIsShowText}
                {...props}
            />
        }

    </>


}

export default HeaderCe;