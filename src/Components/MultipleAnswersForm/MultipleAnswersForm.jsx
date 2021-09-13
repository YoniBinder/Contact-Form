
import { useHistory } from 'react-router-dom';

export default function MultipleAnswersForm (props) {

      let history =useHistory()
      let apiData=props.location.state.apiData
      let eventNumber=props.location.state.nextEvent
      let apiContent=apiData.events[eventNumber].content


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
        else
        history.push({
          pathname:`MultipleAnswersForm`,
          state: { 
            apiData: apiData,
            nextEvent:nextEvent
          }
        })   
      }

    function toNextSlide(event){
      event.preventDefault();
      console.log(event.target.value)
      isFormOrMUltipleAnswers(eventNumber+1)
   }
  return (
    <div className="mt-5">
          <h3>{apiContent.message!=='.'&&apiContent.message}</h3>
            {apiContent.actions.map((action)=>
            <div key={action.end}>
              <button className="btn btn-info btn-lg mb-3" id={action.end} onClick={(event)=>toNextSlide(event)}> {action.label}</button>
              <br/>
            </div>
            )}
    </div>
  );
}
