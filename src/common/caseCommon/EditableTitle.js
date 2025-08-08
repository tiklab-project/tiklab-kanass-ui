import React, {useState, useRef, useEffect} from 'react';
import {Typography, Input, message} from 'antd';

const {Title} = Typography;

/**
 * 通用可编辑标题组件
 * @param {Object} props
 * @param {string} props.value - 标题值
 * @param {function} props.onSave - 保存回调函数，参数为新的标题值
 * @param {number} props.level - 标题级别，默认5
 * @param {string} props.placeholder - 输入框占位符
 * @param {boolean} props.disabled - 是否禁用编辑
 * @param {Object} props.style - 自定义样式
 * @param {string} props.className - 自定义类名
 */
const EditableTitle = ({
    value = '',
    onSave,
    level = 5,
    placeholder = '标题',
    disabled = false,
    style = {},
    className = '',
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const [titleValue, setTitleValue] = useState(value);
    const [saving, setSaving] = useState(false);
    const [hovered, setHovered] = useState(false);
    const inputRef = useRef();

    // 当外部value更新时，同步内部状态
    useEffect(() => {
        setTitleValue(value);
    }, [value]);

    // 开始编辑
    const handleEdit = () => {
        if (disabled) return;
        setEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select(); // 选中全部文本
        }, 0);
    };

    // 保存编辑
    const handleSave = async () => {
        const trimmedValue = titleValue.trim();
        if (trimmedValue === '') {
            message.error('标题不能为空');
            return;
        }

        // 如果正在保存中，直接返回
        if (saving) return;

        setSaving(true);
        try {
            if (onSave && typeof onSave === 'function') {
                await onSave(trimmedValue);
            }
            setEditing(false);
            setHovered(false); // 退出编辑时重置悬浮状态
        } catch (error) {
            console.error('保存标题失败:', error);
            message.error('保存失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    // 取消编辑
    const handleCancel = () => {
        // 如果正在保存中，不执行取消操作
        if (saving) return;
        
        setEditing(false);
        setTitleValue(value); // 恢复到原始值
        setHovered(false); // 取消编辑时重置悬浮状态
    };

    // 处理键盘事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    // 处理输入框变化
    const handleInputChange = (e) => {
        setTitleValue(e.target.value);
    };

    // 处理失焦事件
    const handleBlur = () => {
        // 延迟执行，避免与保存操作冲突
        setTimeout(() => {
            if (!saving) {
                handleSave();
            }
        }, 100);
    };

    return (
        <>
            {editing ? (
                <Input
                    ref={inputRef}
                    value={titleValue}
                    onChange={handleInputChange}
                    onPressEnter={handleSave}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={saving}
                    style={{
                        fontSize: level === 1 ? '38px' : 
                                level === 2 ? '30px' : 
                                level === 3 ? '24px' : 
                                level === 4 ? '20px' : 
                                level === 5 ? '16px' : '14px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        ...style
                    }}
                    className={className}
                    {...restProps}
                />
            ) : (
                <Title 
                    level={level}
                    style={{
                        cursor: disabled ? 'default' : 'pointer',
                        // marginBottom: '10px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: hovered && !disabled ? '#e3e8f0' : 'transparent',
                        ...style
                    }}
                    className={className}
                    onClick={handleEdit}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    {...restProps}
                >
                    {value || placeholder}
                </Title>
            )}
        </>
    );
};

export default EditableTitle; 