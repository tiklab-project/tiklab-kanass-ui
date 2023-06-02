
import React from "react";
import { observer, inject } from "mobx-react";
import Button from "../../common/button/Button";
import "./StatisticsMore.scss";

const StatisticsMore = (props) => {
    const goPlugin = () => {
        window.open(`${homes_url}/account/subscribe/subscribeList`)
    }
    return (
        <div className="statistics-more" onClick={() => goPlugin()}>
            付费插件需要 <Button type="primary">升级企业版</Button>
        </div>
    )

}
export default StatisticsMore;