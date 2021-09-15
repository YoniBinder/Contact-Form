import { useHistory } from 'react-router-dom';
// import { useState } from 'react';

export default function ContactDetailsForm (props) {

    let history =useHistory()
    let apiData=props.location.state.apiData
    let currentEventNumber=props.location.state.nextEvent;
    let apiContent=apiData.events[currentEventNumber].content

  //   const data={
  //     fullName: "",
  //     phone:"",
  //     email: "",
  // }
  //   const [inputs,setInputs]=useState(data)
 
    // function handleChange(event){
    // const {name,value}=event.target
    // setInputs(prev=>({...prev,[name]:value}))
    // } 

    function checkEventNumber(){
      if(!apiData.events[currentEventNumber+1].dependencies[0].availability.eventEndIdx)
        return currentEventNumber+1;
      for(let i=0;i<apiData.events[currentEventNumber+1].dependencies.length;i++)
        if(apiData.events[currentEventNumber]._id===apiData.events[currentEventNumber+1].dependencies[i].availability.afterEvents[0])
          return currentEventNumber+1;
      return currentEventNumber+2
    } 

    function isFormOrMUltipleAnswers(nextEvent){
      if(apiData.events[nextEvent].content.form){
        history.push({
          pathname:`ContactDetailsForm`,
          state: { 
            apiData: apiData,
            nextEvent:nextEvent
          }
        })
      }
      else{
        history.push({
          pathname:`MultipleAnswersForm`,
          state: { 
            apiData: apiData,
            nextEvent:nextEvent
          }
        })

      }
         
    }
    
    function toNextSlide(event){
      event.preventDefault();
      // console.log(inputs)
      const nextEventNumber=checkEventNumber()
      isFormOrMUltipleAnswers(nextEventNumber)
   }
    

  return (
    <div className="mt-5">
        <form onSubmit={toNextSlide}>
            <h3>{apiContent.message!=='.'&&apiContent.message}</h3>
            {apiContent.form.map((input)=>
            <div key={input.key}>
              <label htmlFor={input.key}>{input.key}</label>
              <input type={input.type} name={input.key} placeholder={input.key} required={input.required}/>
              <br/>
            </div>
            )}
            <button type="submit">{apiContent.actions[0].label}</button>
            
        </form>
    
    </div>
  );
}
