import React, { useState,useEffect,useRef } from "react";
import "./ProjectSetBreadcumb.scss";
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { inject,observer } from "mobx-react";

const ProjectSetBreadcumb = (props) => {

    return (
         <div className="projectset-breadcrumb">
            <svg className="svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-home"></use>
            </svg>
            <span>设置</span>
        </div>
    )
}
export default withRouter(ProjectSetBreadcumb);