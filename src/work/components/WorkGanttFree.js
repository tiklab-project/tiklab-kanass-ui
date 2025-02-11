/*
 * @Descripttion: 事项详情页面的甘特图演示组件
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:40:42
 */

import React from "react";
import {  Modal, Button } from 'antd';
import "./WorkGanttFree.scss";
import gantt from "../../assets/images/gantt.jpg";
import {applySubscription} from "tiklab-core-ui";

const WorkGanttFree = (props) => {
    const { workGanttFreeVisable, setWorkGanttFreeVisable } = props;

    /**
     * 购买订阅
     */
    const goBuy = () => {
        applySubscription("kanass")
    }
    return <Modal
        // title="甘特图"
        width={980}
        height={470}
        footer={null}
        visible={workGanttFreeVisable}
        className="work-gantt-free-modal"
        onCancel={() => setWorkGanttFreeVisable(false)}
    >
        <div className="work-gantt-free">
            <div className="work-gantt-free-introduce">
                <div className="work-gantt-title">事项甘特图</div>
                <div className="work-gantt-desc">
                    事项甘特图以路线图的形式显示项目的进度、开始和结束时间
                </div>

                <div className="work-gantt-desc-box">
                    <div className= "work-gantt-desc-item">
                        <svg className="icon-14" aria-hidden="true">
                            <use xlinkHref="#icon-radio"></use>
                        </svg>支持多条件筛选，排序
                    </div>
                    <div className= "work-gantt-desc-item">
                        <svg className="icon-14" aria-hidden="true">
                            <use xlinkHref="#icon-radio"></use>
                        </svg>支持树状，平铺两种数据结构
                    </div>
                </div>

                <Button type="primary" size = {"middle"} block onClick={() => goBuy()}>
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