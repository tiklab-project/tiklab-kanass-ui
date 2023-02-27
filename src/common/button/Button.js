import React from "react";

import "./button.scss"
const Button = (props) => {
	const { buttonText, children, onClick, type, style } = props;

	return (
		<div onClick={onClick} style = {style} className={` project-botton ${type === "primary" ? "project-primary" : "project-dashed"}`}>
			{children}
			{buttonText}
		</div>

	)
}
export default Button;