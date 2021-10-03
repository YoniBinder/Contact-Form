import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./UserSubject.scss";
import { db } from "../../config/firebase";
import { onSnapshot, doc } from "@firebase/firestore";

export default function UserSubject(props) {
  const defaultColors = {
    main: "#44a785",
    title: "#ffffff",
    background: "#ffffff",
    description: "#000000",
    buttons: "#d40000",
  };

  const [apiData, setApiData] = useState(null);
  let [currentPath, setCurrentPath] = useState(0);
  let [currentEvent, setCurrentEvent] = useState(0);
  let [apiColors, setApiColors] = useState(defaultColors);

  let history = useHistory();
  let actionNumber = 0;

  useEffect(() => {
    onSnapshot(doc(db, "planz", props.match.params.id), (doc) => {
      if (doc.exists()) {
        setApiData(doc.data());
        setApiColors({
          background: "#ffffff",
          buttons: "#d40000",
          ...doc.data().colors,
        });
      } else history.push(`${props.match.params.id}/Registration`);
    });

    return {};
  }, [history, props.match.params.id, apiData]);

  function goToPath(action) {
    let nextPath = currentPath;
    let nextEvent = 1;

    for (let i = 0; i < apiData.paths.length; i++) {
      if (
        apiData.paths[currentPath].events[currentEvent]._id ===
          apiData.paths[nextPath].events[nextEvent].dependencies[0].availability
            .afterEvents[0] &&
        Number(action) ===
          apiData.paths[nextPath].events[nextEvent].dependencies[0].availability
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

  function goToNextEvent(action) {
    let nextEvent = currentEvent + 1;
    if (
      typeof apiData.paths[currentPath].events[nextEvent].dependencies[0]
        .availability.eventEndIdx === "undefined"
    )
      setCurrentEvent(nextEvent);

    while (true) {
      for (
        let i = 0;
        i < apiData.paths[currentPath].events[nextEvent].dependencies.length;
        i++
      ) {
        if (
          apiData.paths[currentPath].events[currentEvent]._id ===
            apiData.paths[currentPath].events[nextEvent].dependencies[i]
              .availability.afterEvents[0] &&
          Number(action) ===
            apiData.paths[currentPath].events[nextEvent].dependencies[i]
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

  // function goToCategory(userChoice, nextEvent) {
  //   history.push({
  //     pathname: `${props.match.params.id}/Questionaire`,
  //     state: {
  //       apiData: apiData,
  //       nextEvent: nextEvent,
  //       userChoice:userChoice,
  //       apiColors:apiColors
  //     },
  //   });
  // }
  function checkIfFirstEvent() {
    if (
      typeof apiData.paths[currentPath].events[currentEvent].dependencies[0]
        .availability.afterEvents === "undefined"
    )
      return true;
    return false;
  }

  function checkIfForm() {
    if (apiData.paths[currentPath].events[currentEvent].content.type === 2)
      return true;
    return false;
  }

  function toNextSlide(event) {
    event.preventDefault();
    let action = event.target.id;

    if (checkIfForm()) setCurrentEvent(currentEvent + 1);
    else if (checkIfFirstEvent()) goToPath(action);
    else goToNextEvent(action);
  }

  return (
    <div>
      <div className="MuiDialog-root event-modal" dir="rtl">
        <div className="MuiDialog-container MuiDialog-scrollPaper">
          <div
            className="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded"
            aria-labelledby="customized-dialog-title"
            style={{ backgroundColor: apiColors.background }}
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
            <div className="content rtl-heading">
              <p
                className="MuiTypography-root heading rtl-heading-text MuiTypography-body1"
                style={{ color: apiColors.main }}
              >
                {apiData &&
                  apiData.paths[currentPath].events[currentEvent].title}
              </p>
              {/* <span className="content-message rtl-content-message" style={{color:apiColors.description}}>
                <p className="MuiTypography-root text-inline MuiTypography-body1">
                { apiData && apiData.paths[currentPath].events[currentEvent].content.message}
                </p>
              </span> */}
            </div>

            <form className="jss21">
              <div className="jss22">
                <div className="form-cont rtl-form">
                  {apiData &&
                    apiData.paths[currentPath].events[currentEvent].content
                      .type === 2 &&
                    apiData.paths[currentPath].events[
                      currentEvent
                    ].content.form.map((input) => (
                      <div key={input.key}>
                        <div
                          className="MuiFormControl-root MuiTextField-root textFeild MuiFormControl-marginNormal"
                          // style="margin: 8px; color: rgb(255, 255, 255); height: auto; min-width: 280px;"
                        >
                          <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorSecondary MuiOutlinedInput-colorSecondary MuiInputBase-formControl">
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
                  ].content.actions.map((action) => (
                    <div key={action.end}>
                      {action.link ? (
                        <a
                          href={`${action.link}`}
                          type="button"
                          className="MuiButtonBase-root MuiButton-root MuiButton-contained action-button false MuiButton-containedSizeLarge MuiButton-sizeLarge"
                          target="_PARENT"
                          tabIndex="0"
                          style={{
                            color:
                              apiData.paths[currentPath].events[currentEvent]
                                .content.type === 0
                                ? apiColors.main
                                : apiColors.background,
                            backgroundColor:
                              apiData.paths[currentPath].events[currentEvent]
                                .content.type === 0
                                ? apiColors.background
                                : apiColors.main,
                            textDecorationLine: "none",
                          }}
                        >
                          <span className="MuiButton-label">
                            {action.label}
                          </span>
                        </a>
                      ) : (
                        <button
                          tabIndex="0"
                          className="MuiButtonBase-root MuiButton-root MuiButton-contained action-button false MuiButton-containedSizeLarge MuiButton-sizeLarge"
                          onClick={(event) => toNextSlide(event)}
                          style={{
                            color:
                              apiData.paths[currentPath].events[currentEvent]
                                .content.type === 0
                                ? apiColors.main
                                : apiColors.background,
                            backgroundColor:
                              apiData.paths[currentPath].events[currentEvent]
                                .content.type === 0
                                ? apiColors.background
                                : apiColors.main,
                          }}
                        >
                          <span className="MuiButton-label" id={actionNumber++}>
                            {action.label}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </form>

            {/* <div className="actions-container">
            {apiData &&
        apiData.paths[currentPath].events[currentEvent].content.actions.map((action) => (
          <button
            className="MuiButtonBase-root MuiButton-root MuiButton-text action-button MuiButton-textSizeLarge MuiButton-sizeLarge"
            tabIndex="0"
            type="button"
            id={actionNumber++}
            key={action.end}
            style={{backgroundColor:apiColors.background,color:apiColors.main}}
            onClick={(event) => toNextSlide(event)}
          >
            <span className="MuiButton-label">
              {action.label}
            </span>
            <span className="MuiTouchRipple-root"></span>
          </button>
        ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
