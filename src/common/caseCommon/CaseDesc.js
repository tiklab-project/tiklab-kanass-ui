import React, {useState} from "react";
import {Button, Form} from "antd";
import {Input} from "antd";

const { TextArea } = Input;

const CaseDesc = ({form,updateCase}) =>{

    const [isFocus, setIsFocus] = useState(false);


    return(
        <div>
            <div className="title-bold">描述:</div>
            <Form form={form} onValuesChange={updateCase}>
                <Form.Item name='desc'>
                    <TextArea
                        autoSize={{minRows: 4, maxRows: 6 }}
                        onFocus={()=>setIsFocus(true)}
                        bordered={false}
                        style={{background:"var(--pi-bg-grey-100)"}}
                    />
                </Form.Item>
            </Form>
            <div className={` ${isFocus?"testhubo-show":"testhubo-hide"}`}>
                <Button
                    onClick={()=>{
                        updateCase()
                        setIsFocus(false)
                    }}
                    className={"important-btn"}
                    type="primary"
                    style={{marginRight:"10px"}}
                >
                    保存
                </Button>
                <Button onClick={()=>setIsFocus(false)}> 取消</Button>
            </div>
        </div>
    )
}

export default CaseDesc;