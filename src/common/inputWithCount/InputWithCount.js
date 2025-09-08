import { Input, Space, Typography } from 'antd';
import React, { useState, useRef, useEffect } from "react";

const InputWithCount = ({ value, onChange, maxLength, ...props }) => {
    const [count, setCount] = React.useState( 0);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setCount(newValue.length);
        onChange?.(newValue); // 将值传递给父组件
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <Input
                {...props}
                value={value}
                onChange={handleInputChange}
                maxLength={maxLength}
                style={{ paddingRight: 50 }} // 预留计数器空间
            />
            <div
                style={{
                    position: 'absolute',
                    right: 12,
                    bottom: 6,
                    fontSize: 12,
                    color: count >= maxLength ? '#ff4d4f' : 'rgba(0, 0, 0, 0.45)',
                    backgroundColor: 'white',
                    padding: '0 4px',
                    borderRadius: 2,
                    lineHeight: '20px',
                }}
            >
                {count}/{maxLength}
            </div>
        </div>
    );
};

export default InputWithCount;
