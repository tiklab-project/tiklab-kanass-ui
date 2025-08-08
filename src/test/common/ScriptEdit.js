import React from "react";
import ReactMonacoEditor from "../../common/ReactMonacoEditor";


const ScriptEdit = (props) =>{
    const {script,changeScript} = props

    return(
        <div style={{height: "calc(100% - 280px)"}}>
            <ReactMonacoEditor
                editorChange={changeScript}
                value={script}
                language={"javascript"}
                height={"100%"}
                width={"100%"}
            />
        </div>
    )
}

export default ScriptEdit;