import React from "react";
import { withRouter } from "react-router";
import { productImg, productFrameImg } from "thoughtware-core-ui";
import "./Logo.scss";

const Logo = (props) => {
    const { isShowText, theme } = props;
    const goHomePage = (router) => {
        props.history.push("/home/survey")
        sessionStorage.setItem("menuKey", "home")
    }
    return <>
        {
            isShowText ? <div className='kanass-logo-text' onClick={() => goHomePage()}>
                <img src={ theme === "default" ? productImg.kanass :  productFrameImg.kanass} alt={'logo'} className="logo-img" />
                <div className='logo-text' >Kanass</div>
            </div>
                :
                <div className='kanass-logo' onClick={() => goHomePage()}>
                    <img src={theme === "default" ? productImg.kanass :  productFrameImg.kanass} alt={'logo'} className="logo-img" />
                </div>
        }
    </>


}

export default withRouter(Logo);