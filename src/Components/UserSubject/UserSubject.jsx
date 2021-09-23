import { useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import './UserSubject.scss';
import { db} from "../../config/firebase";
// import { db2} from "../../config/firestore";
import {ref,child,get } from "firebase/database"
// import { collection, getDocs } from "firebase/firestore"; 

export default function UserSubject (props) {

    const [apiData,setApiData]=useState(null)
    const defaultColors = {
      main: '#44a785',
      title: '#ffffff',
      background: '#ffffff',
      description: '#000000'
    }
    let [apiColors,setApiColors]=useState(defaultColors)

    let history =useHistory()
    let actionNumber=0

    useEffect(()=>{

        get(child(ref(db),props.match.params.id)).then((snapshot) => {
            if (snapshot.exists()) {
                setApiData(snapshot.val())
                setApiColors(apiData.colors)
            }
            else
                history.push(`${props.match.params.id}/Registration`)
          }).catch((error) => {
            console.error(error);
          });
          
    },[history,props.match.params.id,apiData])
    
    function isFormOrMUltipleAnswers(userChoice,nextEvent){
      history.push({
        pathname:`${props.match.params.id}/MultipleAnswersForm`,
        state: { 
          apiData: apiData.paths[userChoice],
          nextEvent:nextEvent
        }
      })   
    }


   function toNextSlide(event){
      event.preventDefault();
      if(Number(event.target.id)===apiData.paths[2].events[0].dependencies[0].availability.eventEndIdx)
        isFormOrMUltipleAnswers(2,0)    
      else if(Number(event.target.id)===apiData.paths[1].events[0].dependencies[0].availability.eventEndIdx)
        isFormOrMUltipleAnswers(1,0) 
      else if(Number(event.target.id)===apiData.paths[0].events[1].dependencies[0].availability.eventEndIdx)
        isFormOrMUltipleAnswers(0,1)

   }

   document.body.style.background=apiColors.main
  return (
    
    <div className="mt-5">
        {apiData && <h1 style={{color:apiColors.title}}>{apiData.paths[0].events[0].title}</h1>}
        {apiData && 
          apiData.paths[0].events[0].content.actions.map((action)=>
          <button className="btn btn-info btn-lg me-3" id={actionNumber++} key={action.end} onClick={(event)=>toNextSlide(event)}> {action.label}</button>
          )}

    </div>
  )
}
