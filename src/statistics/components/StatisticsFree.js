
import React, { useState } from "react";
import { Modal, Button } from 'antd';
import "./StatisticsFree.scss";
import bulidend from "../../assets/images/bulidend.jpg";
import newtrend from "../../assets/images/newtrend.jpg";
import endtrend from "../../assets/images/endtrend.jpg";
import newtotaltrend from "../../assets/images/newtotaltrend.jpg";
import endtotaltrend from "../../assets/images/endtotaltrend.jpg";
import logprojectuser from "../../assets/images/logprojectuser.jpg";
import logprojectwork from "../../assets/images/logprojectwork.jpg";
import loguserproject from "../../assets/images/loguserproject.jpg";
// import Button from "../../common/button/Button";
import {applySubscription} from "thoughtware-core-ui"
const StatisticsFree = (props) => {
    const { statisticsFreeVisable, setStatisticsFreeVisable } = props;
    const [imgUrl, setImgUrl] = useState(bulidend);
    const [activeImage, setActiveImage] = useState("bulidend");
    const goBuy = () => {
        applySubscription("kanass")
    }
    const list = [
        {
            id: "bulidend",
            imgUrl: bulidend,
            title: "事项创建与解决统计"
        },
        {
            id: "newtrend",
            imgUrl: newtrend,
            title: "事项新增趋势"
        },
        {
            id: "endtrend",
            imgUrl: endtrend,
            title: "事项完成趋势"
        },
        {
            id: "newtotaltrend",
            imgUrl: newtotaltrend,
            title: "事项累计新建趋势"
        },
        {
            id: "endtotaltrend",
            imgUrl: endtotaltrend,
            title: "事项累计完成趋势"
        },
        {
            id: "logprojectuser",
            imgUrl: logprojectuser,
            title: "日志项目成员统计"
        },
        {
            id: "logprojectwork",
            imgUrl: logprojectwork,
            title: "日志项目事项统计"
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
        visible={statisticsFreeVisable}
        className="statistics-free-modal"
        onCancel={() => setStatisticsFreeVisable(false)}
    >
        <div className="statistics-free">
            <div className="statistics-free-introduce">
                <div className="statistics-title">统计</div>
                <div className="statistics-desc">
                    更多的事项、工时统计
                </div>

                <div className="statistics-desc-box">
                    {
                        list.map(item => {
                            return <div className={`statistics-desc-item ${item.id === activeImage ? 'statistics-desc-active-item' : ''}`}
                                onClick={() => changeImage(item.imgUrl, item.id)}
                                onMouseEnter={() => changeImage(item.imgUrl, item.id)}
                            >
                                <svg className="icon-14" aria-hidden="true">
                                    <use xlinkHref="#icon-radio"></use>
                                </svg>{item.title}
                            </div>
                        })
                    }
                    <div className={`statistics-desc-item ${"loguserproject"=== activeImage ? 'statistics-desc-active-item' : ''}`}
                        onClick={() => changeImage(loguserproject, "loguserproject")}
                        onMouseEnter={() => changeImage(loguserproject, "loguserproject")}
                    >
                        <svg className="icon-14" aria-hidden="true">
                            <use xlinkHref="#icon-radio"></use>
                        </svg>日志成员项目统计
                    </div>
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

export default StatisticsFree;