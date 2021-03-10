import React,{useState,useEffect} from "react";
import { useHistory } from "react-router-dom";
import parse from 'html-react-parser';
import '../App.css';


const Published = (props) => {

  const history = useHistory();

  const [state,setState] = useState({
    loadingStatus:true,
    frontValue:"",
    backValue:"",
    frontColor:"#ffdcb8",
    backColor:"#ffdcb8"
  });

  const {loadingStatus,frontValue,backValue,frontColor,backColor} = state;


  useEffect(() => {
    fetchData()
  }, []);


  const fetchData = () =>{

    let pathname = history.location.pathname;
    pathname = pathname.split("published/")[1];

    fetch(`/api/v1/url/${pathname}`).then(response=> response.json()).then(data =>{
        if (data.status === 200){
          // Set State
          setState({...state, frontValue:data.data.Front, backValue:data.data.Back, frontColor:data.data.frontColor, backColor:data.data.backColor, loadingStatus:false })
        }

        else if (data.status === 400){
          history.push(`/`);
        }
    })
    
  }


  const displayFront = () =>{
    return(
      <div className="card-container" style={{fontFamily: "URW Chancery L, cursive", overflowWrap: "break-word", backgroundColor:frontColor }}>
        <div style={{padding:"10px 20px"}}>
          {parse(frontValue)}
        </div>
      </div>
    )
  }


  const displayBack = () =>{
    return(
      <div className="card-container" style={{fontFamily: "URW Chancery L, cursive", overflowWrap: "break-word", backgroundColor:backColor }}>
        <div style={{padding:"10px 20px"}}>
          {parse(backValue)}
        </div>
      </div>
    )
  }


  const display = () =>{

    if (loadingStatus === true){
      return(
        <div style={{margin:"0 auto"}}>
          Loading.....
        </div>
      )
    }

    else{
      return(
        <div className="App">

        <div className="centered-custom-width-container">
          <div className="two-horizontal-column-container">
            
            <div className="overall-card-container">
              <div className="card-title-container">
                  <h2 className="card-titles" style={{color:frontColor}}>Front</h2>
              </div>
              {displayFront()}
            </div>
  
            <div className="overall-card-container">
              <div className="card-title-container">
                  <h2 className="card-titles" style={{color:backColor}}>Back</h2>
              </div>
              {displayBack()}
            </div>
  
          </div>

        </div>
  
      </div>
      )
    }
  }







  return (
    <div className="App">
          {display()}
    </div>

  );
}

export default Published;
