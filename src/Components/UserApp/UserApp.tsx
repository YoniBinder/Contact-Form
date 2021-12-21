import "./UserApp.scss";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../../config/firebase";
import { Helmet } from "react-helmet";
import {
  onSnapshot,
  doc,
  arrayUnion,
  updateDoc,
  collection,
  addDoc,
} from "@firebase/firestore";


import {
  FormComponentProps,
  Colors,
  Form,
  Action,
  ApiData
} from '../../Models/model'


export default function UserApp(props: FormComponentProps) {
  const defaultColors = {
    main: "#44a785",
    title: "#ffffff",
    background: "#ffffff",
    description: "#000000",
    buttonBackground: "#ffffff",
  };

  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [currentPath, setCurrentPath] = useState<number>(0);
  const [currentEvent, setCurrentEvent] = useState<number>(0);
  const [apiColors, setApiColors] = useState<Colors>(defaultColors);
  const [errorMessge, setErrorMessage] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [data, setData] = useState<Object>({});
  let refs = useRef<any>([]);

  let history = useHistory();
  let actionNumber: number = 0;



  useEffect((): void => {
    async function addAnalytics() {
    
      const docRef = await addDoc(collection(db, "analytics-test"), {
        events: [],
        //add here id:random id
        planID: props.match.params.id,
        planVersion: 1,
        startTime: Date.now(),
      });
      setDocument(docRef.id); //instead of docRef.id, pass the random id
    }

    function findFirstEvent(data: ApiData) {
      for (let i = 0; i < data.paths.length; i++)
        for (let j = 0; j < data.paths[i].events.length; j++) {
          if (
            typeof data.paths[i].events[j].dependencies[0].availability
              .afterEvents === "undefined"
          ) {
            setCurrentPath(i);
            setCurrentEvent(j);
            return;
          }
        }
    }

    onSnapshot(doc(db, "planz", props.match.params.id), (doc: any) => {
      if (doc.exists()) {
        setApiColors({
          background: "#ffffff",
          buttonBackground: "#d40000",
          ...doc.data().colors,
        });
        setApiData(doc.data());
        findFirstEvent(doc.data());
        addAnalytics()
      } else history.push(`${props.match.params.id}/Registration`);
    });
  }, [history, props.match.params.id]);

  function goToNextEvent(action: number) {
    let nextEvent = currentEvent + 1;
    for (
      let i = nextEvent;
      i < apiData!.paths[currentPath].events.length;
      i++
    ) {
      if (apiData!.paths[currentPath].events[i].dependencies)
        for (
          let k = 0;
          k < apiData!.paths[currentPath].events[nextEvent].dependencies.length;
          k++
        )
          if (
            apiData!.paths[currentPath].events[currentEvent]._id ===
              apiData!.paths[currentPath].events[i].dependencies[k].availability
                .afterEvents[0] &&
            action ===
              apiData!.paths[currentPath].events[i].dependencies[k].availability
                .eventEndIdx
          ) {
            setCurrentEvent(i);
            return;
          }
    }

    //check if the next event is on other path
    for (let i = 0; i < apiData!.paths.length; i++)
      for (let j = 0; j < apiData!.paths[i].events.length; j++)
        if (apiData!.paths[i].events[j].dependencies)
          for (
            let k = 0;
            k < apiData!.paths[i].events[j].dependencies.length;
            k++
          ) {
            if (
              apiData!.paths[i].events[j].dependencies[k].availability
                .afterEvents
            ) {
              if (
                apiData!.paths[currentPath].events[currentEvent]._id ===
                  apiData!.paths[i].events[j].dependencies[k].availability
                    .afterEvents[0] &&
                action ===
                  apiData!.paths[i].events[j].dependencies[k].availability
                    .eventEndIdx
              ) {
                setCurrentPath(i);
                setCurrentEvent(j);
              }
            }
          }
  }
  //check if the event is type form
  function checkIfForm() {
    if (apiData!.paths[currentPath].events[currentEvent].content.type === 2)
      return true;
    return false;
  }

  //check validation of form
  function checkValidation(): string {
    var re = /\S+@\S+\.\S+/;
    for (let i = 0; i < refs.current.length; i++) {
      if (refs.current[i].required && refs.current[i].value === "")
        return "יש למלא את כל השדות עם *";
      else if (
        refs.current[i].type === "number" &&
        refs.current[i].value.length !== 10
      )
        return "נא להזין פלאפון תקין";
      else if (
        refs.current[i].type === "email" &&
        re.test(refs.current[i].value) === false
      )
        return "נא להזין מייל תקין";
    }
    return "pass";
  }
  
  function clearAll() {
    setErrorMessage("");
    refs.current = [];
    setData({});
  }

  async function saveEvent(event: any) {
    let eventData = {
      endWith: event.target.outerText || 'Default',
      eventId: apiData!.paths[currentPath].events[currentEvent]._id,
      time: Date.now(),
    };
    if (Object.keys(data).length !== 0) Object.assign(eventData, { data });
    await updateDoc(doc(db, "analytics-test", document), {
      events: arrayUnion(eventData),
    });
  }

  function changeHandler(event: any) {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function toNextSlide(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    let action = Number((event.target as HTMLButtonElement).id);
    if (checkIfForm()) {
      let message: string = checkValidation();
      if (message === "pass") {
        setCurrentEvent(currentEvent + 1);
      } else {
        setErrorMessage(message);
        return;
      }
    } else goToNextEvent(action);

    saveEvent(event);
    clearAll();
  }

  return (
    <div>
      <Helmet>
        <style>{`body { background-color:  ${apiColors.background}; }`}</style>
      </Helmet>

      <div className="event-modal" dir="rtl">
        <div>
          <div
            aria-labelledby="customized-dialog-title"
          >
            <div className="content rtl-heading">
              <p className="heading" style={{ color: apiColors.main }}>
                {apiData &&
                  apiData.paths[currentPath].events[currentEvent].title}
              </p>

              <p
                className="content-message rtl-content-message"
                style={{ color: apiColors.description }}
              >
                {apiData &&
                  apiData.paths[currentPath].events[currentEvent].content
                    .message !== "." &&
                  apiData.paths[currentPath].events[currentEvent].content
                    .message}
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
                    ].content.form.map((input: Form, idx: any) => (
                      <div key={input.key}>
                        <label htmlFor={input.key}>
                          {input.key} {input.required && "*"}
                        </label>
                        <br />
                        <input
                          type={input.type}
                          name={input.key}
                          required={input.required}
                          aria-invalid="true"
                          onChange={changeHandler}
                          ref={(element) => {
                            refs.current[idx] = element;
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="actions-container">
                {apiData &&
                  apiData.paths[currentPath].events[
                    currentEvent
                  ].content.actions.map((action: Action) => (
                    <div key={action.label}>
                      {action.link ? (
                        <button
                          tabIndex={0}
                          className="action-button"
                          onClick={(e): void => {
                            e.preventDefault();
                            window.open(`${action.link}`, "_parent");
                          }}
                          style={{
                            color: apiColors.title,
                            backgroundColor: apiData.colors.buttonBackground
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
                            color: apiColors.title,
                            backgroundColor: apiData.colors.buttonBackground
                              ? apiColors.buttonBackground
                              : apiColors.background,
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
    </div>
  );
}
