import {Progress} from "antd"
import React from "react";
import "./CircleProgress.scss"

const CircleProgress = (props) => {
    const {percent, size} = props

    // 尺寸
    const getSize = (size) => {
        switch (size) {
            case "small":
                return 25
            case "default":
                return 35
            case "large":
                return 45
            default:
                return 25
        }
    }
    return(
        <div className={"circle-progress"}>
            <Progress
                type="circle"
                width={getSize(size)}
                percent={percent}
                strokeColor={"#1890ff"}  // 进度条颜色
                strokeWidth={8}          // 加粗线条
                trailColor={"#d5d5d5"}   // 背景颜色
                format={(percent) => {
                    return Math.round(percent);  // 只保留整数部分，隐藏圆圈内的百分比符号
                }}
                status={"normal"}
            />
        </div>
    )
};
export default CircleProgress;