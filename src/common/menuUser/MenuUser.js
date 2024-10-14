/*
 * @Descripttion: 敏捷开发项目详情页面左侧设置按钮
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-16 10:58:01
 */

import React, { useEffect, useRef, useState } from "react";
import "./MenuUser.scss";
import { AvatarLink } from "tiklab-licence-ui";
import { AvatarLink as AvatarLinkCloud } from "tiklab-licence-cloud-ui";
import UserIcon from "../UserIcon/UserIcon";
import { getUser } from "tiklab-core-ui";
const MenuUser = (props) => {
    const { isShowText } = props;
    const nickname = getUser().nickname;


    return (
        <div className="menu-user">
            {
                !isShowText ?
                    <div className="menu-user-icon">
                        {
                            version === "cloud" ?
                                <AvatarLinkCloud
                                    iconComponent={
                                        <UserIcon name={nickname} />
                                    }
                                    {...props}
                                />
                                :
                                <AvatarLink
                                    iconComponent={
                                        <UserIcon name={nickname} />
                                    }
                                    {...props}
                                />
                        }
                    </div>

                    :
                    <>
                        {
                            version === "cloud" ?
                                <AvatarLinkCloud
                                    iconComponent={
                                        <div className="menu-user-text">
                                            <UserIcon name={nickname} />
                                            <div>个人中心</div>
                                        </div>
                                    }
                                    {...props}
                                />
                                :
                                <AvatarLink
                                    iconComponent={
                                        <div className="menu-user-text">
                                            <UserIcon name={nickname} />
                                            <div>个人中心</div>
                                        </div>
                                    }
                                    {...props}
                                />
                        }
                    </>

            }
        </div>
    )
}
export default MenuUser;