/**
 * @name: DraggableBodyRow
 * @author mahai
 * @date 2022/10/11 3:30 PM
 * @description DraggableBodyRow
 */
import React, { useRef} from 'react';
import {useDrag, useDrop} from "react-dnd";
const type = 'DraggableFeatureBodyRow';

const DraggableFeatureBodyRow = (
    {
        record,
        data,
        index,
        moveRow,
        className,
        style,
        ...restProps
    }
) => {
    if (!record) return null;
    let itemObj = {...record, index};
    const ref = useRef(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: (monitor) => {
            const { index: dragIndex, sort: dragSort } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: (item) => {
            let opt = {
                dragId: item.id, // 拖拽id
                drag:item,
                dropId: record.id, // 要放置位置行的id
                drop: {...record}
            };
            moveRow(opt);
        },
    });
    const [, drag] = useDrag({
        type,
        item: itemObj,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));
    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{
                cursor: 'move',
                ...style,
            }}
            {...restProps}
        />
    );
};
export default DraggableFeatureBodyRow