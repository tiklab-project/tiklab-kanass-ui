import React from "react";

/**
 * 用例中 评审状态显示
 * @param value
 * @returns {Element}
 * @constructor
 */
const ReviewResultDisplay = ({ value }) => {

    const getReviewStatusText = (status) => {
        switch (status) {
            case 1:
                return '通过';
            case 2:
                return '未通过';
            case null:
            default:
                return '未评审';
        }
    };

    return <span style={{margin: "0 10px"}}>{getReviewStatusText(value)}</span>;
};


export default ReviewResultDisplay;