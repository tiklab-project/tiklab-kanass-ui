/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/8
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/8
 */
import React from "react";
import "./EnhanceEntranceModal.scss";
import {applySubscription,disableFunction} from "tiklab-core-ui";
import Button from "../../../common/button/Button";

const EnhanceEntranceModal = (props) => {

    const {config} = props;

    const disable = disableFunction();

    return disable && (
        <div className="arbess-enhance-entrance-modal">
            <div className='enhance-entrance-modal'>
                <div className='enhance-entrance-modal-content'>
                    <div className='enhance-popup-container'>
                        <div className="enhance-title">
                            {config?.title}
                        </div>
                        <div className='enhance-desc'>付费版专属功能</div>
                        <div className='enhance-button'>
                            <Button
                                type={'primary'}
                                onClick={()=>window.open('https://tiklab.net/contactus')}
                            >
                                咨询购买
                            </Button>
                            <Button
                                onClick={()=>applySubscription('kanass')}
                            >
                                立即购买
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EnhanceEntranceModal
