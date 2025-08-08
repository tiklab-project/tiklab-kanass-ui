import React from "react";
import {Tag} from "antd";
import {ApiOutlined, AppstoreOutlined, LaptopOutlined, TabletOutlined} from "@ant-design/icons";
import IconCommon from "./IconCommon";

/**
 * 用例状态
 */
export const showStatus = (status)=>{
    switch (status) {
        case 0:
            return <Tag color="#bfc4c6">未开始</Tag>;
        case 1:
            return <Tag color="#76b6f1">进行中</Tag>;
        case 2:
            return <Tag color="#f29e9ee8">结束</Tag>;
        default:
            return <Tag color="#bfc4c6">未开始</Tag>;
    }
}
export const showTextStatus = (status,size)=>{
    switch (status) {
        case 0:
            return <div className="case-status-0" style={{fontSize: size || "12px"}}>未开始</div>
        case 1:
            return <div className="case-status-1" style={{fontSize: size || "12px"}}>进行中</div>
        case 2:
            return <div className="case-status-2" style={{fontSize: size || "12px"}}>已完成</div>
        default:
            return <div className="case-status-0" style={{fontSize: size || "12px"}}>未开始</div>
    }
}



/**
 * 表格中用例类型展示
 */
export const showCaseTypeView = (type,iconSize) => {
    // type 到 icon 名称的映射
    const typeIconMap = {
        "api-unit": "api1",
        "api-scene": "api1",
        "api-perform": "api1",
        "web-scene": "diannao1",
        "app-scene": "diannao1",
    };

    // 获取 icon 名称，找不到用默认
    const iconName = typeIconMap[type] || "gongneng1";

    const icon = iconSize || "icon-x";

    return <IconCommon icon={iconName} className={icon} />;
};

/**
 * 用例详情中面包屑中的类型展示
 */
export const showCaseTypeInList = (type)=>{
    switch (type) {
        case "api-unit":
            return <div className={"case-type-text"}>接口单元</div>
        case "api-scene":
            return <div className={"case-type-text"}>接口场景</div>
        case "api-perform":
            return <div className={"case-type-text"}>接口性能</div>

        case "web-scene":
            return <div className={"case-type-text"}>WEB场景</div>

        case "app-scene":
            return <div className={"case-type-text"}>APP场景</div>

        case "function":
            return <div className={"case-type-text"}>功能用例</div>
        default :
            return ;
    }
}

/**
 * 用例列表中用例类型展示
 */
export const showCaseTypeTable = (type)=>{
    switch (type) {
        case "api-unit":
            return "接口单元"
        case "api-scene":
            return "接口场景"
        case "api-perform":
            return "接口性能"

        case "web-scene":
            return "WEB场景"
        case "web-perform":
            return "WEB性能"

        case "app-scene":
            return "APP场景"
        case "app-perform":
            return "APP性能"
        case "function":
            return "功能用例"
    }
}


//防抖
export const debounce = (fn, ms)=> {
    let timer;
    return function (...args) {
        // e.persist();//不加这个取不到e.target.value 的值
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, ms)
    }
}

/**
 * 将毫秒转换为秒，小于1秒的保持毫秒显示
 * @param {number} ms 毫秒数
 * @returns {string} 格式化后的时间字符串
 */
export const formatElapsedTime = (ms) => {
    if (!ms) return '0ms';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}