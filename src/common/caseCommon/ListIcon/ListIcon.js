import React, { useMemo } from "react";
import "./ListIcon.scss";

// 将颜色类名定义为常量数组，更易于管理和扩展
const BACKGROUND_COLOR_CLASSES = [
    "mf-icon-bg-pastel-red",
    "mf-icon-bg-pastel-blue",
    "mf-icon-bg-lavender",
    "mf-icon-bg-light-pink",
    "mf-icon-bg-pale-green",
    "mf-icon-bg-powder-blue",
];

const getRandomColorClass = () => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_COLOR_CLASSES.length);
    return BACKGROUND_COLOR_CLASSES[randomIndex];
};

/**
 * ListIcon 组件
 * 显示文本的第一个大写字母，并具有随机或指定的背景颜色。
 *
 * @param {object} props - 组件的 props
 * @param {string} [props.text="M"] - 要提取首字母的文本。
 * @param {number} [props.colorIndex] - 可选的颜色索引，用于从 BACKGROUND_COLOR_CLASSES 中选择特定颜色。
 * @param {boolean} [props.applyMargin=true] - 是否应用右边距。
 * @param {string} [props.className=""] - 应用于容器的额外 CSS 类名。
 */
const ListIcon = ({
                      text,
                      colorIndex,
                      applyMargin = true,
                      className = "",
                  }) => {

    // 使用useMemo来记忆背景颜色类。
    const backgroundColorClass = useMemo(() => {
        if (colorIndex !== undefined && colorIndex >= 0 && colorIndex < BACKGROUND_COLOR_CLASSES.length) {
            return BACKGROUND_COLOR_CLASSES[colorIndex];
        }
        return getRandomColorClass();
    }, [colorIndex]);

    const firstLetter = (typeof text === 'string' && text.length > 0)
        ? text.substring(0, 1).toUpperCase()
        : "M";

    // 使用模板字符串构建类名，更清晰
    const containerClasses = [
        "mf-listname-icon",
        backgroundColorClass,
        applyMargin ? "mf-listname-icon-mar" : "",
        className,
    ].filter(Boolean).join(" ").trim();

    return (
        <div className={containerClasses}>
            {firstLetter}
        </div>
    );
};

export default ListIcon;