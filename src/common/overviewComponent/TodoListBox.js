import React from "react";
import TodoListItem from "./TodoListItem";
import "./TodoListBox.scss";
import { Empty } from "antd";
const TodoListBox = (props) => {
    const {todoTaskList,  goToListPage} = props;
    return (
        <div className="todo-box">
            <div className="todo-box-title">
                <span className="name">待办事项</span>
                {
                    todoTaskList.length > 10 && <div className="more" onClick={() => goToListPage()}>
                        <svg aria-hidden="true" className="svg-icon">
                            <use xlinkHref="#icon-rightjump"></use>
                        </svg>
                    </div>
                }

            </div>
            <div className="todo-list">
                {
                    todoTaskList.length > 0 ? todoTaskList.map((item) => {
                        return <TodoListItem content = {item.data}/>
                    })
                        :
                        <Empty image="/images/nodata.png" description="暂时没有待办~" />
                }
            </div>
        </div>
    )
}
export default TodoListBox;