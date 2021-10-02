import { useState } from "react";
import "../UserSubject/UserSubject.scss";

export default function Questionaire(props) {
  let [currentEventNumber, setCurrentEventNumber] = useState(
    props.location.state.nextEvent
  );
  let apiColors = props.location.state.apiColors;
  let apiData = props.location.state.apiData;
  let userChoice = props.location.state.userChoice;
  let apiContent = apiData.paths[userChoice].events[currentEventNumber].content;
  let actionNumber = 0;

  function updateEventNumber(nextEvent) {
    setCurrentEventNumber(nextEvent);
    actionNumber = 0;
  }
  
  function getNextEventNumber(action) {
    if (
      typeof apiData.paths[userChoice].events[currentEventNumber + 1].dependencies[0].availability
        .eventEndIdx === "undefined"
    )
      return currentEventNumber + 1;
    const staticNumber = currentEventNumber;
    while (true) {
      for (
        let i = 0;
        i < apiData.paths[userChoice].events[currentEventNumber + 1].dependencies.length;
        i++
      ) {
        if (
          apiData.paths[userChoice].events[staticNumber]._id ===
            apiData.paths[userChoice].events[currentEventNumber + 1].dependencies[i].availability
              .afterEvents[0] &&
          Number(action) ===
            apiData.paths[userChoice].events[currentEventNumber + 1].dependencies[i].availability
              .eventEndIdx
        )
          return currentEventNumber + 1;
        if (
          apiData.paths[userChoice].events[staticNumber]._id ===
            apiData.paths[userChoice].events[currentEventNumber + 1].dependencies[i].availability
              .afterEvents[0] &&
          apiData.paths[userChoice].events[staticNumber].content.type === 2
        )
          return currentEventNumber + 1;
      }
      currentEventNumber++;
    }
  }

  function toNextSlide(event) {
    event.preventDefault();
    let action = event.target.id;
    const nextEventNumber = getNextEventNumber(action);
    updateEventNumber(nextEventNumber);
  }

  return (
    <div>
      <div className="MuiDialog-root event-modal" dir="rtl">
        <div
          className="MuiDialog-container MuiDialog-scrollPaper"
          role="none presentation"
          tabIndex="-1"
          // style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"
        >
          <div
            className="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded"
            role="dialog"
            aria-labelledby="customized-dialog-title"
            // style="background: rgb(255, 255, 255);"
          >
            <div className="dialog-heading-cont sales-event-name rtl-cont">
              <div
                className="logo-container rtl-logo-container"
                // style="background: rgb(114, 186, 198);"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/simplan-38b89.appspot.com/o/images%2F7a9a71cb-74e2-45e6-8889-3d24de1083e2.png?alt=media&amp;token=32ca6127-1d28-4a7e-bf74-4b3268c7bb47"
                  className="organization-logo rtl-organization-logo"
                  alt=""
                />
              </div>
              <div
                className="dialog-heading rtl-heading"
                // style="background: rgb(114, 186, 198); color: rgb(255, 255, 255);"
              >
                <p className="MuiTypography-root plan-name MuiTypography-body1">
                  {apiData.title}
                </p>
              </div>
            </div>
            <div className="content rtl-heading">
              <p
                className="MuiTypography-root heading rtl-heading-text MuiTypography-body1"
                // style="color: rgb(114, 186, 198);"
              >
                {apiData.paths[userChoice].events[currentEventNumber].title}
              </p>
              <span
                className="content-message rtl-content-message"
                // style="color: rgb(0, 0, 0);"
              >
                <p className="MuiTypography-root text-inline MuiTypography-body1">
                  {apiContent.message !== "." && apiContent.message}
                </p>
              </span>
              <form className="jss21">
                <div className="jss22">
                  <div className="form-cont rtl-form">
                    {apiContent.type === 2 &&
                      apiContent.form.map((input) => (
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
                                <legend
                                  className="jss24"
                                  style={{ width: 0.01 }}
                                >
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
                  {apiContent.actions.map((action) => (
                    <div key={action.end}>
                      {action.link ? (
                        <a
                          href={`${action.link}`}
                          type="button"
                          className="MuiButtonBase-root MuiButton-root MuiButton-contained action-button false MuiButton-containedSizeLarge MuiButton-sizeLarge"
                          target="_PARENT"
                          tabIndex="0"
                          style={{color:apiContent.type===0?apiColors.main:apiColors.background,
                            backgroundColor:apiContent.type===0?apiColors.background:apiColors.main,
                            textDecorationLine:"none"
                          }}
                        >
                          <span className="MuiButton-label"
                          >
                            {action.label}
                          </span>
                        </a>
                      ) : (
                        <button
                          tabIndex="0"
                          className="MuiButtonBase-root MuiButton-root MuiButton-contained action-button false MuiButton-containedSizeLarge MuiButton-sizeLarge"
                          onClick={(event) => toNextSlide(event)}
                          style={{color:apiContent.type===0?apiColors.main:apiColors.background,
                                  backgroundColor:apiContent.type===0?apiColors.background:apiColors.main
                                }}
                        >
                          <span className="MuiButton-label"  id={actionNumber++}>
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
      </div>
    </div>
  );
}
