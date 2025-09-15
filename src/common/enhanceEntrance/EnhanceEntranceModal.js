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
import Button from "../button/Button";

const EnhanceEntranceModal = (props) => {

    const {config} = props;

    const disable = disableFunction();

    const bgroup = 'kanass';

    return disable && (
        <div className="security-enhance-entrance-modal">
            <div className='enhance-entrance-modal'>
                <div className='enhance-entrance-modal-content'>
                    <div className='enhance-popup-container'>
                        <div className="enhance-title">
                            {config?.title}
                        </div>
                        <div className='enhance-fea'>
                            企业版专属功能
                        </div>
                        <div className='enhance-desc'>
                            {config?.desc}
                        </div>
                        <div className='enhance-button'>
                            <div
                                className='enhance-button-contact'
                                onClick={()=>window.open('https://tiklab.net/contactus')}
                            >
                                联系客服
                            </div>
                            <div
                                className='enhance-button-update'
                                onClick={()=>applySubscription(bgroup)}
                            >
                                升级版本
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EnhanceEntranceModal
