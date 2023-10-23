import React from "react";
import { withRouter } from "react-router";

import "./Breadcrumb.scss"
const Breadcumb = (props) => {
    const { homeImage, firstText, secondText, firstUrl, children } = props;

    const goUrl = () => {
        if (firstUrl) {
            props.history.push(firstUrl)
        } else {
            props.history.goBack()
        }
    }
    return (
        <div className="page-head">
            <div className="page-breadcrumb">
                {
                    secondText &&
                    <svg className="svg-icon page-back" aria-hidden="true" onClick={() => goUrl()}>
                        <use xlinkHref="#icon-pageLeft"></use>
                    </svg>
                }
                <span className={`${secondText ? "page-link" : ""}`}>{firstText}</span>
                {
                    secondText && <> &nbsp; / &nbsp; <span>{secondText}</span>
                    </>
                }


            </div>
            {children}
        </div>

    )
}
export default withRouter(Breadcumb);