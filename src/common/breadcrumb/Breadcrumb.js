import React from "react";
import { withRouter } from "react-router";

import "./Breadcrumb.scss"
const Breadcumb = (props) => {
    const { homeImage, firstText, secondText, firstUrl, children } = props;

    const goUrl = () => {
        if(firstUrl){
            props.history.push(firstUrl)
        }else {
            props.history.goBack()
        }
    }
    return (
        <div className="page-head">
            <div className="page-breadcrumb">
                {/* <svg className="svg-icon" aria-hidden="true">
                    <use xlinkHref="#icon-home"></use>
                </svg> */}
                <span onClick={() => goUrl()} className = {`${secondText ? "page-link" : ""}`}>{firstText}</span>
                {
                    secondText && <>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-rightBlue"></use>
                        </svg>
                        <span>{secondText}</span>
                    </>
                }


            </div>
            {children}
        </div>

    )
}
export default withRouter(Breadcumb);