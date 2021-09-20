
import { useState } from 'react';
export default function MultipleAnswersForm (props) {

      let [currentEventNumber,setCurrentEventNumber]=useState(props.location.state.nextEvent)
      
      let apiData=props.location.state.apiData
      let apiContent=apiData.events[currentEventNumber].content
      let actionNumber=0

      function updateEventNumber(nextEvent){
        setCurrentEventNumber(nextEvent) 
      }

      function getNextEventNumber(action){
        if(typeof(apiData.events[currentEventNumber+1].dependencies[0].availability.eventEndIdx)==="undefined")
          return currentEventNumber+1;

        for(let i=0;i<apiData.events[currentEventNumber+1].dependencies.length;i++){
          if(apiData.events[currentEventNumber]._id===apiData.events[currentEventNumber+1].dependencies[i].availability.afterEvents[0]
            && Number(action)=== apiData.events[currentEventNumber+1].dependencies[i].availability.eventEndIdx)
            return currentEventNumber+1;
          if(apiData.events[currentEventNumber]._id===apiData.events[currentEventNumber+1].dependencies[i].availability.afterEvents[0]
            && apiContent.type===2)
            return currentEventNumber+1;
        }
          
        
        return currentEventNumber+2
      } 

    function toNextSlide(event){
      event.preventDefault();
      let action=event.target.id
      const nextEventNumber=getNextEventNumber(action)
      updateEventNumber(nextEventNumber)
   }


  return (
    <div className="mt-5">
          <h4 style={{color:"white"}}>{apiData.events[currentEventNumber].title}</h4>
          <h3>{apiContent.message!=='.' && apiContent.message}</h3>

        {/* <form onSubmit={(event)=>toNextSlide(event)}> */}
            {apiContent.type===2 && apiContent.form.map((input)=>
            <div key={input.key}>
              <label htmlFor={input.key}>{input.key}</label>
              <input type={input.type} name={input.key} placeholder={input.key} required={input.required}/>
              <br/>
            </div>
            )}

            {apiContent.actions.map((action)=>
            <div key={action.end}>
              {action.link?
              <a href={`${action.link}`} className="btn btn-info btn-lg mb-3" id={actionNumber++}> {action.label}</a>
              :
              <button className="btn btn-info btn-lg mb-3" id={actionNumber++} onClick={(event)=>toNextSlide(event)}> {action.label}</button>
              }

            </div>
            )}
        {/* </form> */}

    </div>
  );
}
