/*
 * @Descripttion: customLogo弹窗
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:40:42
 */

import React from "react";
import {  Modal, Button } from 'antd';
import "./CustomLogoFree.scss";
import gantt from "../../../assets/images/customLogo.jpg";
import {applySubscription} from "tiklab-core-ui";

const WorkGanttFree = (props) => {
    const { visible,  setVisible } = props;

    /**
     * 购买订阅
     */
    const goBuy = () => {
        window.open('https://tiklab.net/contactus', '_blank');
    }
    const goBuyNow = () => {
        applySubscription("kanass")
    }
    return <Modal
        // title="甘特图"
        width={980}
        height={570}
        footer={null}
        visible={visible}
        className="work-gantt-free-modal"
        onCancel={() => setVisible(false)}
    >
        <div className="work-gantt-free">
            <div className="work-gantt-free-introduce">
                <div className="work-gantt-title">统计</div>
                <div className="statistics-text">
                    付费版本专属功能
                </div>
                <div className="work-gantt-desc">
                    自定义Logo
                </div>

                <div className="work-gantt-desc-box">
                    <div className="work-gantt-desc-item">
                        <svg className="icon-14" aria-hidden="true">
                            <use xlinkHref="#icon-radio"></use>
                        </svg>
                        支持自定义项目Logo
                    </div>
                </div>

                <Button type="primary" size={"middle"} block onClick={() => goBuy()}>
                    咨询购买
                </Button>
                <Button type="default" size={"middle"} block onClick={() => goBuyNow()}>
                    立即购买
                </Button>
            </div>
            <div className="work-gantt-free-image">
                <div>
                    <img src={gantt} alt="" width={"100%"} />
                </div>
            </div>
        </div>
    </Modal>
}

export default WorkGanttFree;