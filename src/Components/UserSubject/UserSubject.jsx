import { useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import './UserSubject.css';
import { db} from "../../config/firebase";
import {ref,child,get } from "firebase/database"

// export interface UserDetailsProps {
//     match:any;
//     apiData:object;
    
//     paths:Array<object>;
//     title:object
// }

export default function UserSubject (props) {
  
    const [apiData,setApiData]=useState(null)
    
    let history =useHistory()

    useEffect(()=>{
        get(child(ref(db),props.match.params.id)).then((snapshot) => {
            if (snapshot.exists()) {
                setApiData(snapshot.val())
            }
            else
                history.push("/Registration")
          }).catch((error) => {
            console.error(error);
          });

    },[history,props.match.params.id])
    
    function isFormOrMUltipleAnswers(userChoice,nextEvent){
      if(apiData.paths[userChoice].events[nextEvent].content.form){
          history.push({
          pathname:`${props.match.params.id}/ContactDetailsForm`,
          state: { 
            apiData: apiData.paths[userChoice],
            nextEvent:nextEvent
          }
        })
      }
      else
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
      if(event.target.id==="ייעוץ פרטני")
        isFormOrMUltipleAnswers(2,0)    
      else if(event.target.id==="סדנת הורים")
        isFormOrMUltipleAnswers(1,0) 
      else if(event.target.id==="הכשרה")
        isFormOrMUltipleAnswers(0,1)

   }
    
  return (
   
    <div className="mt-5">
        {apiData&& <h1>{apiData.paths[0].events[0].title}</h1>}
        {apiData&& 
          apiData.paths[0].events[0].content.actions.map((action)=>
          <button className="btn btn-info btn-lg me-3" id={action.end} key={action.end} onClick={(event)=>toNextSlide(event)}> {action.label}</button>
          )}

    </div>
  )
}
