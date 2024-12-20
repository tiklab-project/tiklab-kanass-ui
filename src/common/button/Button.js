/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 13:41:33
 * @Description: 自定义按钮
 */

import React from "react";
import "./Button.scss";
import { Spin } from "antd";

const Button = (props) => {
	const { buttonText, children, onClick, type, style, loading } = props;

	return (
		<div onClick={loading ? null : onClick} style = {style} className={` project-botton ${type === "primary" ? "project-primary" : "project-dashed"}`}>
			{
				loading && <Spin size="small"/>
			}
			{children}
			{buttonText}
		</div>

	)
}
export default Button;