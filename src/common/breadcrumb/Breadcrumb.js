/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 13:41:04
 * @Description: 面包屑
 */

import React from "react";
import { withRouter } from "react-router";

import "./Breadcrumb.scss"
const Breadcumb = (props) => {
    const { firstText, secondText, firstUrl, children } = props;

    /**
     * 返回页面
     */
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