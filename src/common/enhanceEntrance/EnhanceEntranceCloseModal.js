/**
 * @Description:
 * @Author: gaomengyuan
 * @Date: 2025/8/8
 * @LastEditors: gaomengyuan
 * @LastEditTime: 2025/8/8
 */
import React, {useEffect, useRef, useState} from "react";
import "./EnhanceEntranceCloseModal.scss";
import {applySubscription,disableFunction} from "tiklab-core-ui";
import Button from "../button/Button";

const EnhanceEntranceCloseModal = (props) => {

    const {config, enhanceModal, setEnhanceModal} = props;
    const bgroup = 'kanass';
    const disable = disableFunction();
    // const [enhanceModal ,setEnhanceModal] = useState(false)
    const modalRef = useRef();

    const handleClickOutside = (e) => {
        if (!modalRef.current?.contains(e.target)) {
            setEnhanceModal(false);
        }
    };

    return disable && enhanceModal && (
        <div className="security-enhance-entrance-close-modal" onClick={handleClickOutside}>
            <div className='enhance-entrance-modal' ref={modalRef}>
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

export default EnhanceEntranceCloseModal
