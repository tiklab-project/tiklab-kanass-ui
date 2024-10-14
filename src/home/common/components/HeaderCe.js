import React from "react";
import Header from "./Header";
import { AppLink, AvatarLink, HelpLink } from 'tiklab-licence-ui';
import { AppLink as AppLinkCloud, AvatarLink as AvatarLinkCloud, HelpLink as HelpLinkCloud } from 'tiklab-licence-cloud-ui';

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