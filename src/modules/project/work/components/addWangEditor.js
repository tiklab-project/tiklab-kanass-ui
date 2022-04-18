/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 13:40:55
 */
import React, { forwardRef,useEffect,useImperativeHandle,useRef } from 'react';
import E from 'wangeditor';
import {getUser,getDomainTenant} from 'doublekit-core-ui'

const Editor =(props,ref)=>{
    const {setEditorContent}=props
    const editorElemMenu= useRef();
    const editorElemBody= useRef();
    let editor;

    const ticket = getUser().ticket;
    const tenant = getDomainTenant();

    useImperativeHandle(ref, () => {
        return {
            changeEditor(value){
                editor = new E(editorElemMenu.current,editorElemBody.current)
                editor.config.onchange = html => {
                    setEditorContent(editor.txt.html())
                }
                editor.config.menus = [
                    'head',  // 标题
                    'bold',  // 粗体
                    'fontSize',  // 字号
                    'fontName',  // 字体
                    'italic',  // 斜体
                    'underline',  // 下划线
                    'strikeThrough',  // 删除线
                    'foreColor',  // 文字颜色
                    'backColor',  // 背景颜色
                    'link',  // 插入链接
                    'list',  // 列表
                    'justify',  // 对齐方式
                    'quote',  // 引用
                    'emoticon',  // 表情
                    'image',  // 插入图片
                    'table',  // 表格
                    'video',  // 插入视频
                    'code',  // 插入代码
                    'undo',  // 撤销
                    'redo'  // 重复
                ]
                editor.config.colors = [
                    '#000000',
                    '#eeece0',
                    '#1c487f',
                    '#4d80bf'
                ]
                // editor.config.uploadImgShowBase64 = true
                editor.config.uploadFileName = "uploadFile"
                editor.config.uploadImgServer = `${img_url}/dfs/upload`;
                editor.config.uploadImgHeaders = {
                    ticket: ticket,
                    tenant: tenant
                }
                editor.config.debug = true
                editor.config.zIndex = 0
                editor.config.uploadImgHooks = {
                    // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
                    customInsert: function(insertImgFn, result) {
                        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                        insertImgFn(`${img_url}/file/${result.data.fileName}?tenant=${tenant}`)
                    }
                }
                editor.create()
                editor.txt.html(value)
            }
        }
        
    });

    return (
        <div className="shop">
            <div className="text-area" >
                <div ref={editorElemMenu}
                    className="editorElem-menu">
                </div>
                <div
                    style={{
                        height:300,
                        border:"1px solid #ccc",
                        borderTop:"none"
                    }}
                    ref={editorElemBody} className="editorElem-body">
                </div>
            </div>
        </div>
    )
}

export default forwardRef(Editor);

