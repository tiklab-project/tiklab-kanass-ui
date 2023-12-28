
import React from "react";
import { observer, inject } from "mobx-react";
import Button from "../../common/button/Button";
import "./StatisticsMore.scss";

const StatisticsMore = (props) => {
    const goPlugin = () => {
        window.open('http://thoughtware.cn/produce/kanass')
    }
    return (
        <div className="statistics-advert" onClick={() => goPlugin()}>
            <div className="statistics-advert-title">高级统计筛选</div>
            <svg className="statistics-advert-icon" aria-hidden="true">
                <use xlinkHref="#icon-staticticsAdvert"></use>
            </svg>
            <div>更多统计需要升级企业版</div>
            <Button type="primary">升级企业版</Button>
        </div>
    )

}
export default StatisticsMore;