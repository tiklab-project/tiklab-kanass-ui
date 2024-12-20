/*
 * @Author: 袁婕轩
 * @Date: 2024-07-31 15:27:49
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 15:00:05
 * @Description: 系统log
 */

import React from "react";
import { withRouter } from "react-router";
import { productImg, productWhiteImg } from "tiklab-core-ui";
import "./Logo.scss";

const Logo = (props) => {
    const { isShowText, theme } = props;
    const goHomePage = (router) => {
        props.history.push("/index/overview")
        sessionStorage.setItem("menuKey", "home")
    }
    return <>
        {
            isShowText ? <div className='kanass-logo-text' onClick={() => goHomePage()}>
                <img src={ theme === "default" ? productImg.kanass :  productWhiteImg.kanass} alt={'logo'} className="logo-img" />
                <div className='logo-text' >Kanass</div>
            </div>
                :
                <div className='kanass-logo' onClick={() => goHomePage()}>
                    <img src={theme === "default" ? productImg.kanass :  productWhiteImg.kanass} alt={'logo'} className="logo-img" />
                </div>
        }
    </>


}

export default withRouter(Logo);