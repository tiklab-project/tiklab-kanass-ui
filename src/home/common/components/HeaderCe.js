/*
 * @Descripttion: 系统头部, 弃用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2024-12-27 10:39:11
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:40:32
 * @Description: 
*/
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