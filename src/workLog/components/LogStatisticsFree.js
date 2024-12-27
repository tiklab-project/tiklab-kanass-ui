
/*
 * @Descripttion: 工时统计演示页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-06-01 13:24:51
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 09:55:14
 */
import React, { useState } from "react";
import { Modal, Button } from 'antd';
import "./LogStatisticsFree.scss";
import logprojectuser from "../../assets/images/logprojectuser.jpg";
import logprojectwork from "../../assets/images/logprojectwork.jpg";
import loguserproject from "../../assets/images/loguserproject.jpg";
import {applySubscription} from "tiklab-core-ui"
const LogStatisticsFree = (props) => {
    const { logStatisticsFreeVisable, setLogStatisticsFreeVisable } = props;
    const [imgUrl, setImgUrl] = useState(logprojectuser);
    const [activeImage, setActiveImage] = useState("bulidend");

    // 购买
    const goBuy = () => {
        applySubscription("kanass")
    }
    const list = [
        {
            id: "logprojectuser",
            imgUrl: logprojectuser,
            title: "日志项目成员统计"
        },
        {
            id: "logprojectwork",
            imgUrl: logprojectwork,
            title: "日志项目事项统计"
        },
        {
            id: "loguserproject",
            imgUrl: loguserproject,
            title: "日志成员项目统计"
        }
    ]

    const changeImage = (imgUrl, id) => {
        setImgUrl(imgUrl)
        setActiveImage(id)
    }
    return <Modal
        // title="甘特图"
        width={980}
        height={500}
        footer={null}
        visible={logStatisticsFreeVisable}
        className="statistics-free-modal"
        onCancel={() => setLogStatisticsFreeVisable(false)}
    >
        <div className="statistics-free">
            <div className="statistics-free-introduce">
                <div className="statistics-title">统计</div>
                <div className="statistics-desc">
                    工时统计
                </div>

                <div className="statistics-desc-box">
                    {
                        list.map(item => {
                            return <div 
                                className={`statistics-desc-item ${item.id === activeImage ? 'statistics-desc-active-item' : ''}`}
                                onClick={() => changeImage(item.imgUrl, item.id)}
                                onMouseEnter={() => changeImage(item.imgUrl, item.id)}
                                key={item.id}
                            >
                                <svg className="icon-14" aria-hidden="true">
                                    <use xlinkHref="#icon-radio"></use>
                                </svg>{item.title}
                            </div>
                        })
                    }
                </div>

                <Button type="primary" size={"middle"} block onClick={() => goBuy()}>
                    立即购买
                </Button>
            </div>
            <div className="statistics-free-image">
                <div>
                    <img src={imgUrl} alt="" width={"100%"} />
                </div>
            </div>
        </div>
    </Modal>
}

export default LogStatisticsFree;