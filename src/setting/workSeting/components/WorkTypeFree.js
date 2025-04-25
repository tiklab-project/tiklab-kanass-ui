import React, { useState } from "react";
import { Modal, Button } from 'antd';
import "./WorkTypeFree.scss";
import customWorkType from "../../../assets/images/customWorkType.jpg";
import customFlowProcess from "../../../assets/images/customFlowProcess.jpg";
import customForm from "../../../assets/images/customForm.jpg";
import {applySubscription} from "tiklab-core-ui"
import {observer} from "mobx-react";
const WorkTypeFree = (props) => {
    const { visible, setVisible } = props;
    const [imgUrl, setImgUrl] = useState(customWorkType);
    const [activeImage, setActiveImage] = useState("customWorkType");

    // 购买
    const goBuy = () => {
        window.open('https://tiklab.net/contactus', '_blank');
    }
    const goBuyNow = () => {
        applySubscription("kanass")
    }
    const list = [
        {
            id: "customWorkType",
            imgUrl: customWorkType,
            title: "自定义事项类型"
        },
        {
            id: "customFlowProcess",
            imgUrl: customFlowProcess,
            title: "配置事项流程"
        },
        {
            id: "customForm",
            imgUrl: customForm,
            title: "配置事项表单"
        }
    ]

    const changeImage = (imgUrl, id) => {
        setImgUrl(imgUrl)
        setActiveImage(id)
    }
    return <Modal
        width={980}
        height={500}
        footer={null}
        visible={visible}
        className="work-type-free-modal"
        onCancel={() => setVisible(false)}
    >
        <div className="work-type-free">
            <div className="work-type-free-introduce">
                <div className="work-type-title">事项类型</div>
                <div className="work-type-text">
                    付费版本专属功能
                </div>
                <div className="work-type-desc">
                    自定义你的事项，以及响应的流程和表单
                </div>

                <div className="work-type-desc-box">
                    {
                        list.map(item => {
                            return <div
                                className={`work-type-desc-item ${item.id === activeImage ? 'work-type-desc-active-item' : ''}`}
                                onClick={() => changeImage(item.imgUrl, item.id)}
                                onMouseEnter={() => changeImage(item.imgUrl, item.id)}
                                key={item.id}
                            >
                                <svg className="icon-14" aria-hidden="true">
                                    <use xlinkHref="#icon-radio"></use>
                                </svg>
                                {item.title}
                            </div>
                        })
                    }
                </div>

                <Button type="primary" size={"middle"} block onClick={() => goBuy()}>
                    咨询购买
                </Button>
                <Button type="default" size={"middle"} block onClick={() => goBuyNow()}>
                    立即购买
                </Button>
            </div>
            <div className="work-type-free-image">
                <img src={imgUrl} alt="" />
            </div>
        </div>
    </Modal>
}

export default observer(WorkTypeFree)