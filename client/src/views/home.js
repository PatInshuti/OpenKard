import React,{useState,useEffect} from "react";
import ReactQuill from 'react-quill';
import parse from 'html-react-parser';
import { useHistory } from "react-router-dom";
import { TwitterPicker } from 'react-color';

import '../card.css';
import '../App.css';
import 'react-quill/dist/quill.snow.css';

const Home = () => {
  const history = useHistory();

  const [state,setState] = useState({
    previewMode:false,
    publishStatus:false,
    frontValue:"",
    backValue:"",
    frontColor:"#ffdcb8",
    backColor:"#ffdcb8"
  });

  const {previewMode,frontValue,backValue,frontColor,backColor} = state;

  useEffect(()=>{

    let frontColorInput = document.getElementById("rc-editable-input-2");
    let backColorInput  = document.getElementById("rc-editable-input-4");
    let frontColorDiv = document.getElementsByClassName("front-color")[0];
    let backColorDiv = document.getElementsByClassName("back-color")[0];
  

    window.addEventListener("keydown", function(event) {

      if (event.key === "Enter") {
          event.preventDefault();

          if (event.target === frontColorInput){
            setState({...state, frontColor:`#${event.target.value}`})
            frontColorInput.value = event.target.value;
            backColorInput.value = backColor;
          }

          else if (event.target === backColorInput){
            setState({...state,backColor:`#${event.target.value}`})
            frontColorInput.value = frontColor;
            backColorInput.value = event.target.value;
          }
      }
    });

    window.addEventListener("click",(event)=>{
      event.preventDefault();

      let path = event.path || (event.composedPath && event.composedPath());

      if(path !== undefined){
        if(path[3] === frontColorDiv){
          setState({...state, frontColor:`${event.target.title}`})
        }
  
        if(path[3] === backColorDiv){
          setState({...state, backColor:`${event.target.title}`})
        }
      }

    });

  },[frontColor,backColor,frontValue,backValue])


  const toggleViewOption = () =>{
    setState({...state,previewMode:!previewMode})
  }

  const pulishCard = () =>{

    let data = {}
    data["Front"] = frontValue;
    data["Back"] = backValue;
    data["frontColor"] = frontColor;
    data["backColor"] = backColor;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
  
    fetch('api/v1/publish', requestOptions)
        .then(response => response.json())
        .then(data => {

          if (data.status === 200){
                history.push(`/published/${data.viewUrl}`);
            }

            else if (data.status === 400){
                alert("There was an error :( Try to submit again")
            }
      })

  }

  const handleFrontChange = (value) =>{
    setState({...state, frontValue: value.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') });
  }

  const handleBackChange = (value) =>{
    setState({...state, backValue: value.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') });
  }


  const modules = {
      toolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{'font':[]}],
        [{ 'color': [] }, { 'background': [] }],
        ['bold', 'italic', 'underline','strike', 'blockquote','image'],
        [{'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        [{ 'direction': 'rtl' }],     
      ],
  } 

const displayFront = () =>{

    if(previewMode === true){
        return(
            <div id="front-card-container" className="card-container" style={{fontFamily: "URW Chancery L, cursive", overflowWrap: "break-word", backgroundColor:frontColor }}>
                <div style={{padding:"10px 20px"}}>
                    {parse(frontValue)}
                </div>
            </div>
        )
    }

    else{
        return(
            <div id="front-card-container-editor" className="card-container" style={{backgroundColor:frontColor}}>
                <ReactQuill theme="snow" modules={modules} name="frontValue" value={frontValue} onChange={(value) => handleFrontChange(value)}/>
            </div>
        )
    }

}


const displayBack = () =>{

  if(previewMode === true){
      return(
          <div id="back-card-container" className="card-container" style={{fontFamily: "URW Chancery L, cursive",   overflowWrap: "break-word", backgroundColor:backColor }}>
              <div style={{padding:"10px 20px"}}>
                  {parse(backValue)}
              </div>
          </div>
      )
  }

  else{
      return(
          <div id="back-card-container-editor" className="card-container" style={{backgroundColor:backColor}}>
              <ReactQuill theme="snow" modules={modules} value={backValue} onChange={(value) => handleBackChange(value)}/>
          </div>
      )
  }

}



  return (
    <div className="App">
      
      <div className="centered-custom-width-container">
        <div className="two-horizontal-column-container">
          
          <div className="overall-card-container">
            <TwitterPicker className="front-color"/>

            <div className="card-title-container">
                <h2 className="card-titles" style={{color:frontColor}}>Front</h2>
            </div>
            {displayFront()}
          </div>

          <div className="overall-card-container">
            
            <div className="back-picker">
              <TwitterPicker className="back-color"/>
            </div>

            <div className="card-title-container">
                <h2 className="card-titles" style={{color:backColor}}>Back</h2>
            </div>
            {displayBack()}
          </div>

        </div>

        <div className="centered-container" style={{marginTop:"5px"}}>
          <button className="general-button mode-button" onClick={toggleViewOption}>{ previewMode === true? "Edit mode":"Preview mode"}</button>
          <button className="general-button pubilsh-button" onClick={pulishCard}>Publish</button>
        </div>
      </div>

    </div>

  );
}

export default Home;
