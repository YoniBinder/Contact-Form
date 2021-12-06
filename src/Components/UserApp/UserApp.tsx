import { useState, useEffect,useRef } from "react";
import { useHistory } from "react-router-dom";
import "./UserApp.scss";
import { db } from "../../config/firebase";
import { onSnapshot, doc } from "@firebase/firestore";
import {Helmet} from 'react-helmet';

interface FormComponentProps {
  match:Match
}
type Params ={
  id: string
}
type Match={
  params:Params
}
type Colors={
  main:string,
  title: string,
  background?:string,
  description: string,
  buttons?: string,
  buttonBackground?:string
}
type Form={
  key:string;
  type:string;
  required:boolean
}
type Action={
  label:string; 
  type:number;
  end?:string;
  link?:string;
}

type Content={
  actions :Array<Action>;
  form:Array<Form>;
  type:number;
  message:string;
}
type Availability={
  eventEndIdx:number;
  afterEvents:Array<string>
}
type Events={
  _id:string;
  content:Content;
  dependencies:Array<{availability:Availability}>;
  title:string
}
type ApiData={
  paths:Array<{events:Array<Events>;_id:string;}>;
  colors:Colors;
  title:string;
  _id:string;
}

export default function UserApp(props:FormComponentProps) {

  const defaultColors = {
    main: "#44a785",
    title: "#ffffff",
    background: "#ffffff",
    description: "#000000",
    buttonBackground: "#ffffff",
  };

  const [apiData, setApiData] = useState< ApiData|null>(null);
  let [currentPath, setCurrentPath] = useState<number>(0);
  let [currentEvent, setCurrentEvent] = useState<number>(0);
  let [apiColors, setApiColors] = useState<Colors>(defaultColors);
  let [errorMessge,setErrorMessage]=useState<String>("")
  let refs = useRef<any>([]);

  let history = useHistory();
  let actionNumber:number=0;

  useEffect(():void => {
    function findFirstEvent(data:ApiData){
        for (let i = 0; i < data.paths.length; i++)
          for(let j=0;j<data.paths[i].events.length;j++){
            if (
                typeof data.paths[i].events[j].dependencies[0].availability
                  .afterEvents ==='undefined'
              ) {
                setCurrentPath(i);
                setCurrentEvent(j);
                return;
              }
        }
    }
    onSnapshot(doc(db, "planz", props.match.params.id), (doc:any) => {
      if (doc.exists()) {
        setApiColors({
          background: "#ffffff",
          buttonBackground: "#d40000",
          ...doc.data().colors,
        });
        setApiData(doc.data());
        findFirstEvent(doc.data())
      } else history.push(`${props.match.params.id}/Registration`);
   
    });
    

  }, [history, props.match.params.id]);


  

  function goToPath(action:number) {
    
    let nextPath = currentPath;
    let nextEvent = 1;
    for (let i = 0; i < apiData!.paths.length; i++) {
      if (
        apiData!.paths[currentPath].events[currentEvent]._id ===
          apiData!.paths[nextPath].events[nextEvent].dependencies[0].availability
            .afterEvents[0] &&
        action ===
          apiData!.paths[nextPath].events[nextEvent].dependencies[0].availability
            .eventEndIdx
      ) {
        setCurrentPath(nextPath);
        setCurrentEvent(nextEvent);
        actionNumber = 0;
        return;
      }
      nextPath++;
      nextEvent = 0;
    }
  }

  function goToNextEvent(action:number) {
    let nextEvent = currentEvent + 1;
   
    if (
      typeof apiData!.paths[currentPath].events[nextEvent].dependencies[0]
        .availability.eventEndIdx === "undefined"
    ){
      setCurrentEvent(nextEvent);
      return
    }
    while (true) {
      for (
        let i = 0;
        i < apiData!.paths[currentPath].events[nextEvent].dependencies.length;
        i++
      ) {
        if (
          apiData!.paths[currentPath].events[currentEvent]._id ===
            apiData!.paths[currentPath].events[nextEvent].dependencies[i]
              .availability.afterEvents[0] &&
          action ===
            apiData!.paths[currentPath].events[nextEvent].dependencies[i]
              .availability.eventEndIdx
        ) {
          setCurrentEvent(nextEvent);
          actionNumber = 0;
          return;
        }
      }
      nextEvent++;
    }
  }

  function checkIfOtherPath(action:number) {

    if(apiData!.paths[currentPath].events[currentEvent]._id===
      apiData!.paths[currentPath].events[currentEvent+1].dependencies[0].availability.afterEvents[0]
      &&action ===
      apiData!.paths[currentPath].events[currentEvent+1].dependencies[0]
        .availability.eventEndIdx
      )
        return false

    for(let i=0;i<apiData!.paths.length;i++){
      if(apiData!.paths[i].events[0].dependencies[0].availability.afterEvents)
        if(apiData!.paths[currentPath].events[currentEvent]._id===
          apiData!.paths[i].events[0].dependencies[0].availability.afterEvents[0]
            
        )
          return true;
    }
    
    return false;
  }

  function checkIfForm() {
    if (apiData!.paths[currentPath].events[currentEvent].content.type === 2)
      return true;
    return false;
  }

function checkValidation():string{
  var re = /\S+@\S+\.\S+/;
  for(let i=0;i<refs.current.length;i++){
    if(refs.current[i].required && refs.current[i].value==="")
      return "יש למלא את כל השדות עם *"
    else if(refs.current[i].type==='number' && refs.current[i].value.length!==10)
      return "נא להזין פלאפון תקין"
    else if(refs.current[i].type==='email' && re.test(refs.current[i].value)===false)   
      return "נא להזין מייל תקין"
    
  }
  return "pass"
}

function clearAll(){
  setErrorMessage("")
  refs.current=[]
}

  function toNextSlide(event:React.MouseEvent<HTMLButtonElement>):void {
    event.preventDefault()
    let action = Number((event.target as HTMLButtonElement).id);
    if (checkIfForm()){
      let message:string=checkValidation()
        if(message==="pass") {
          setCurrentEvent(currentEvent + 1);
      }
      else{
        setErrorMessage(message)
        return
      }
    } 
    else if (checkIfOtherPath(action)){
      goToPath(action);
    }
    
    else {
      goToNextEvent(action);
    }
    clearAll()
  }
  return (
    <div>
      <Helmet>
                <style>{`body { background-color:  ${apiColors.background}; }`}</style>
            </Helmet>
      <div className="event-modal" dir="rtl">
      
        <div>
          <div
            className="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded"
            aria-labelledby="customized-dialog-title"
          >
            <div 
            className="content rtl-heading"
            >

              <p
                className="heading"
                style={{ color: apiColors.main }}
              >{apiData &&
                  apiData.paths[currentPath].events[currentEvent].title}
              </p>
         
                <p className="content-message rtl-content-message" style={{color:apiColors.description}}>
                { apiData && apiData.paths[currentPath].events[currentEvent].content.message}
                </p>
        
            </div>

            <form className="jss21">
            
              <div className="jss22">
              
                <div className="form-cont">
                
                  {apiData &&
                    apiData.paths[currentPath].events[currentEvent].content
                      .type === 2 &&
                    apiData.paths[currentPath].events[
                      currentEvent
                    ].content.form.map((input:Form,idx:any) => (
                      <div key={input.key}>
                       
                          
                            <label htmlFor={input.key}>{input.key} {input.required&&'*'}</label><br/>
                            <input
                              type={input.type}
                              id={input.key}
                              required={input.required}
                              aria-invalid="true"
                              ref={(element) => {refs.current[idx] = element}}
                            />  
                         
                        
                      </div>
                    ))}
                </div>
              </div>

              <div className="actions-container">
                {apiData &&
                  apiData.paths[currentPath].events[
                    currentEvent
                  ].content.actions.map((action:Action) => (
                    <div key={action.label}>
                      {action.link ? (
                          <button
                            tabIndex={0}
                            className="action-button"
                            onClick={(e):void=>{
                              e.preventDefault();
                              window.open(`${action.link}`,'_parent');
                              }}
                            style={{
                              color:apiColors.title,                                
                              backgroundColor:
                                apiData.colors.buttonBackground
                                  ? apiColors.buttonBackground
                                  : apiColors.background,
                            }}
                          >
                          
                            {action.label}
                          
                          </button>
                      ) : (
                        <button
                          tabIndex={0}
                          id={String(actionNumber++)}
                          className="action-button"
                          onClick={(event) => toNextSlide(event)}
                          style={{
                            color:apiColors.title,
                            backgroundColor:
                              apiData.colors.buttonBackground
                                ? apiColors.buttonBackground
                                : apiColors.background
                          }}
                        >
                    
                            {action.label}
                       
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </form>
            <div className="error-message">{errorMessge}</div>
          </div>
        </div>
      </div>

      
      {/* <iframe src="http://localhost:3000/01849380-cbad-442e-96bb-a5527709529b" title="yoni" width="500" height="450" frameBorder="0"></iframe> */}


    </div>
  );
}
