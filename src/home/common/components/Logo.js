/*
 * @Author: 袁婕轩
 * @Date: 2024-07-31 15:27:49
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:00:05
 * @Description: 系统log
 */

import React, {useEffect} from "react";
import { withRouter } from "react-router";
import { productImg, productWhiteImg } from "tiklab-core-ui";
import "./Logo.scss";

const Logo = (props) => {
    const { isShowText, theme , customLogo } = props;

    const goHomePage = (router) => {
        props.history.push("/index/overview")
        sessionStorage.setItem("menuKey", "home")
    }


    // 如果有自定义图片则使用自定义的，否则使用默认的
    const getLogoImage = () => {
        if (customLogo) return customLogo?.image;
        return theme === "default" ? productImg.kanass : productWhiteImg.kanass;
    };

    const getLogoName = () => {
        if (customLogo) return customLogo?.name;
        return "Kanass";
    };
    return <>
        {
            isShowText ? <div className='kanass-logo-text' onClick={() => goHomePage()}>
                <img src={getLogoImage()}
                     // src={ theme === "default" ? productImg.kanass :  productWhiteImg.kanass}
                     alt={'logo'}
                     className="logo-img" />
                <div className='logo-text' >{getLogoName()}</div>
            </div>
                :
                <div className='kanass-logo' onClick={() => goHomePage()}>
                    <img src={getLogoImage()}
                         // src={theme === "default" ? productImg.kanass :  productWhiteImg.kanass}
                         alt={'logo'}
                         className="logo-img" />
                </div>
        }
    </>


}

export default withRouter(Logo);