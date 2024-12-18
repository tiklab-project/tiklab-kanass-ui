/*
 * 按钮
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