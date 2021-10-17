import { useState, useEffect } from "react";
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

  let history = useHistory();
  let actionNumber:number = 0;

  useEffect(():void => {
    onSnapshot(doc(db, "planz", props.match.params.id), (doc:any) => {
      if (doc.exists()) {
        setApiData(doc.data());
        setApiColors({
          background: "#ffffff",
          buttons: "#d40000",
          ...doc.data().colors,
        });
      } else history.push(`${props.match.params.id}/Registration`);
    });

  }, [history, props.match.params.id, apiData]);

  function goToPath(action:string) {
    let nextPath = currentPath;
    let nextEvent = 1;

    for (let i = 0; i < apiData!.paths.length; i++) {
      if (
        apiData!.paths[currentPath].events[currentEvent]._id ===
          apiData!.paths[nextPath].events[nextEvent].dependencies[0].availability
            .afterEvents[0] &&
        Number(action) ===
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

  function goToNextEvent(action:string) {
    let nextEvent = currentEvent + 1;
    if (
      typeof apiData!.paths[currentPath].events[nextEvent].dependencies[0]
        .availability.eventEndIdx === "undefined"
    )
      setCurrentEvent(nextEvent);

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
          Number(action) ===
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

  function checkIfFirstEvent() {
    if (
      typeof apiData!.paths[currentPath].events[currentEvent].dependencies[0]
        .availability.afterEvents === "undefined"
    )
      return true;
    return false;
  }

  function checkIfForm() {
    if (apiData!.paths[currentPath].events[currentEvent].content.type === 2)
      return true;
    return false;
  }

  function toNextSlide(event:React.MouseEvent<HTMLButtonElement>):void {
    event.preventDefault();
    let action = (event.target as HTMLButtonElement).id;

    if (checkIfForm()) setCurrentEvent(currentEvent + 1);
    else if (checkIfFirstEvent()) goToPath(action);
    else goToNextEvent(action);
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
            {/* <div className="dialog-heading-cont sales-event-name rtl-cont"> */}
            {/* <div className="logo-container rtl-logo-container" style={{backgroundColor:apiColors.main}}>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/simplan-38b89.appspot.com/o/images%2F7a9a71cb-74e2-45e6-8889-3d24de1083e2.png?alt=media&amp;token=32ca6127-1d28-4a7e-bf74-4b3268c7bb47"
                  className="test organization-logo rtl-organization-logo"
                  alt=""
                />
              </div> */}
            {/* <div className="dialog-heading rtl-heading" style={{backgroundColor:apiColors.main,color:apiColors.title}}>
                <p className="MuiTypography-root plan-name MuiTypography-body1">
                {apiData && apiData.title}
                </p>
              </div> */}
            {/* </div> */}
            <div 
            className="content rtl-heading"
            >

              <p
                className="heading"
                style={{ color: apiColors.main }}
              >{apiData &&
                  apiData.paths[currentPath].events[currentEvent].title}
              </p>
              <span className="content-message rtl-content-message" style={{color:apiColors.description}}>
                <p className="MuiTypography-root text-inline MuiTypography-body1">
                { apiData && apiData.paths[currentPath].events[currentEvent].content.message}
                </p>
              </span>
            </div>

            <form className="jss21">
            
              <div className="jss22">
              
                <div className="form-cont rtl-form">
                
                  {apiData &&
                    apiData.paths[currentPath].events[currentEvent].content
                      .type === 2 &&
                    apiData.paths[currentPath].events[
                      currentEvent
                    ].content.form.map((input:Form) => (
                      <div key={input.key}>
                        <div
                          className="MuiTextField-root textFeild"
                          // style="margin: 8px; color: rgb(255, 255, 255); height: auto; min-width: 280px;"
                        >
                          <div>
                            <input
                              type={input.type}
                              name={input.key}
                              placeholder={input.key}
                              required={input.required}
                              aria-invalid="false"
                              className="MuiInputBase-input MuiOutlinedInput-input"
                              style={{ backgroundColor: apiColors.main }}
                            />
                            <fieldset
                              aria-hidden="true"
                              className="jss23 MuiOutlinedInput-notchedOutline"
                              style={{ paddingLeft: 8 }}
                            >
                              <legend className="jss24" style={{ width: 0.01 }}>
                                <span>​</span>
                              </legend>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="actions-container">
                {apiData &&
                  apiData.paths[currentPath].events[
                    currentEvent
                  ].content.actions.map((action:Action) => (
                    <div key={action.end}>
                      {action.link ? (
                          <button
                            tabIndex={0}
                            className="action-button"
                            onClick={(e):void=>{
                              e.preventDefault();
                              window.open(`${action.link}`,'_parent');
                              }}
                            style={{
                              color:apiColors.main,
                                
                              backgroundColor:
                                apiData.colors.buttonBackground
                                  ? apiColors.buttonBackground
                                  : apiColors.background,
                            }}
                          >
                          
                          <span>
                            {action.label}
                          </span>
                          </button>
                      ) : (
                        <button
                          tabIndex={0}
                          className="action-button"
                          onClick={(event) => toNextSlide(event)}
                          style={{
                            color:apiColors.main,
                            backgroundColor:
                              apiData.colors.buttonBackground
                                ? apiColors.buttonBackground
                                : apiColors.background
                          }}
                        >
                          <span id={String(actionNumber++)}>
                            {action.label}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </form>

          </div>
        </div>
      </div>

      {/* <br/><br/><br/><br/><br/><br/>
      <iframe src="http://localhost:3000/01849380-cbad-442e-96bb-a5527709529b" title="yoni" width="500" height="450"></iframe> */}


    </div>
  );
}
