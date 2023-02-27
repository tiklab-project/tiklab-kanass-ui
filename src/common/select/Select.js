import React, { useEffect, useState, useRef, Fragment } from "react";
import "./Select.scss"
const SelectSimple = (props) => {
    const { onChange, ismult, title,children, selectValue,className } = props;
    const [showDropDown, setShowDropDown] = useState(false);
    const dropDown = useRef();

    let [selectData, setSelectData] = useState(selectValue ? selectValue : [])
    const [selectLength, setSelectLength] = useState(0)
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showDropDown])

    useEffect(() => {
        if(selectValue){
           setSelectLength(selectValue.length) 
           setSelectData(selectValue)
        }
        
    },[selectValue])


    const closeModal = (e) => {
        if (!dropDown.current) {
            return;
        }
        if (!dropDown.current.contains(e.target) && dropDown.current !== e.target) {
            setShowDropDown(false)
        }
    }

    
    const getValue = (e) => {
    
        if(ismult){
            const value = e.value;
            const checked = e.checked;
            const isIn = selectData.indexOf(value);
            if(isIn === -1 && checked === true){
                selectData.push(value)
                setSelectData(selectData)
            }
            if(isIn !== -1 && checked === false){
                selectData.splice(isIn, 1)
                setSelectData(selectData)
            }
            setSelectLength(selectData.length)
            onChange(selectData)
        }else {
            setSelectData(e)
            onChange(e.value)
        }
       
    }

    const clear = () => {
        setSelectData([])
        setSelectLength(0)
        onChange(null)
    }
    return <div className="select-view">
        <div onClick={() => setShowDropDown(true)} className="select-content">
            {
                ismult ?
                <div >
                    {title}
                </div>
                :
                <div className={className}>
                    {selectData.label ? selectData.label : title}
                </div>
            }
            <div className="select-view-icon">
                {
                    ismult && selectLength > 0 &&  <div className="select-number">{selectLength}</div>
                }
                <svg className="svg-icon" aria-hidden="true" >
                    <use xlinkHref={`#icon-downdrop`}></use>
                </svg>
            </div>
            
        </div>
        {
            showDropDown ? <div className="select-dropdown" ref={dropDown}>
                {
                   React.Children.map(children, (children,i) => {
                        return React.cloneElement(children, {onChange: getValue, selectData: selectData,setShowDropDown: setShowDropDown, ismult: ismult})
                    })
                }
                {
                    ismult && <div onClick={() => clear()} className = "select-dropdown-bottom">
                        <div className="clear-botton">清空</div>
                    </div>
                }
                
            </div>
            :
            <></>
        }

       
    </div>
}

export default SelectSimple;