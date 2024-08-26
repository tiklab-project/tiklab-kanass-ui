import React from "react";
import { withRouter } from "react-router";

const SetingMenu = (props) => {
    const {isShowText, theme} = props;
    const goSet = () => {
        if(version === "cloud"){
            props.history.push('/setting/home')
        }else {
            props.history.push('/setting/home')
        }
    }
    return (
        <div>
            {
                isShowText ?
                    <div className="search-text first-menu-text-item" onClick={() => goSet()}>
                        <svg className="icon-15" aria-hidden="true">
                            <use xlinkHref={`#icon-set-${theme}`} ></use>
                        </svg>
                        <div>设置</div>
                    </div>

                    :
                    <div className="first-menu-link-item" data-title-right="设置" onClick={() => goSet()}>
                        <svg className="icon-15" aria-hidden="true">
                            <use xlinkHref={`#icon-set-${theme}`} ></use>
                        </svg>
                    </div>

            }
            </div>
    )
}
export default withRouter(SetingMenu);