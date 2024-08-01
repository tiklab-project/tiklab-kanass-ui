import React, { Component } from "react";
import { AppLink, AvatarLink, HelpLink } from 'thoughtware-licence-ui';
import { AppLink as AppLinkCloud, AvatarLink as AvatarLinkCloud, HelpLink as HelpLinkCloud } from 'thoughtware-licence-cloud-ui';
import Search from "../../search/components/Search";
import MessageList from "./MessageList";
import ProjectFeature from '../../../setting/version/ProjectFeature';
import UserIcon from "../../../common/UserIcon/UserIcon"
import "./FirstMenuButtom.scss"
import { getUser } from "thoughtware-core-ui";
import Theme from "./Theme";
const FirstMenuButtom = (props) => {
    const { isShowText, SetIsShowText, theme } = props;
    const nickname = getUser().nickname;
    return <>
        {
            version === "cloud" ?
                <>
                 {
                        isShowText ?
                            <div className="first-menu-bottom-text ">
                                <Search isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLinkCloud
                                    iconComponent={
                                        <div className="first-menu-bottom-item">
                                            <svg className="icon-20" aria-hidden="true">
                                                <use xlinkHref={`${theme === "gray" ? "#icon-help" : "#icon-help-white"}`}></use>
                                            </svg>
                                            <div>帮助</div>
                                        </div>

                                    }
                                />
                                <Theme theme = {theme} isShowText = {isShowText}/>
                                <AppLinkCloud
                                    iconComponent={
                                        <div className="first-menu-bottom-item">
                                            <svg className="icon-20" aria-hidden="true">
                                                <use xlinkHref={`${theme === "gray" ? "#icon-application" : "#icon-application-white"}`}></use>
                                            </svg>
                                            <div>切换应用</div>
                                        </div>

                                    }
                                />
                                <AvatarLinkCloud
                                    iconComponent={
                                        <div className="first-menu-bottom-item">
                                            <UserIcon name={nickname} />
                                            <div>个人中心</div>
                                        </div>
                                    }
                                    {...props}
                                />

                            </div>

                            :
                            <div className="first-menu-bottom-icon">
                                <Search isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLinkCloud
                                    iconComponent={
                                        <svg className="icon-20" aria-hidden="true">
                                            <use xlinkHref={`${theme === "gray" ? "#icon-help" : "#icon-help-white"}`}></use>
                                        </svg>
                                    }
                                />
                                <Theme theme = {theme} isShowText = {isShowText}/>
                                <AppLinkCloud
                                    iconComponent={
                                        <svg className="icon-20" aria-hidden="true">
                                            <use xlinkHref={`${theme === "gray" ? "#icon-application" : "#icon-application-white"}`}></use>
                                        </svg>
                                    }
                                />
                                <AvatarLinkCloud
                                    iconComponent={
                                        <UserIcon name={nickname} />
                                    }
                                    {...props}
                                />
                            </div>
                    }
                </>
                :
                <>
                    {
                        isShowText ?
                            <div className="first-menu-bottom-text ">
                                <Search isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLink
                                    iconComponent={
                                        <div className="first-menu-bottom-item">
                                            <svg className="icon-20" aria-hidden="true">
                                                <use xlinkHref={`${theme === "gray" ? "#icon-help" : "#icon-help-white"}`}></use>
                                            </svg>
                                            <div>帮助</div>
                                        </div>

                                    }
                                />
                                <Theme theme = {theme} isShowText = {isShowText}/>
                                <AppLink
                                    iconComponent={
                                        <div className="first-menu-bottom-item">
                                            <svg className="icon-20" aria-hidden="true">
                                                <use xlinkHref={`${theme === "gray" ? "#icon-application" : "#icon-application-white"}`}></use>
                                            </svg>
                                            <div>切换应用</div>
                                        </div>

                                    }
                                />
                                <AvatarLink
                                    iconComponent={
                                        <div className="first-menu-bottom-item">
                                            <UserIcon name={nickname} />
                                            <div>个人中心</div>
                                        </div>
                                    }
                                    {...props}
                                />

                            </div>

                            :
                            <div className="first-menu-bottom-icon">
                                <Search isShowText={isShowText} theme={theme} />
                                <MessageList isShowText={isShowText} theme={theme} />
                                <HelpLink
                                    iconComponent={
                                        <svg className="icon-20" aria-hidden="true">
                                            <use xlinkHref={`${theme === "gray" ? "#icon-help" : "#icon-help-white"}`}></use>
                                        </svg>
                                    }
                                />
                                <Theme theme = {theme} isShowText = {isShowText}/>
                                <AppLink
                                    iconComponent={
                                        <svg className="icon-20" aria-hidden="true">
                                            <use xlinkHref={`${theme === "gray" ? "#icon-application" : "#icon-application-white"}`}></use>
                                        </svg>
                                    }
                                />
                                <AvatarLink
                                    iconComponent={
                                        <UserIcon name={nickname} />
                                    }
                                    {...props}
                                />
                            </div>
                    }
                </>


        }

    </>


}

export default FirstMenuButtom;