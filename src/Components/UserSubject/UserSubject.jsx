import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./UserSubject.scss";
import { db } from "../../config/firebase";
import { onSnapshot,doc} from '@firebase/firestore';


export default function UserSubject(props) {
  const defaultColors = {
    main: "#44a785",
    title: "#ffffff",
    background: "#ffffff",
    description: "#000000",
  };
  
  const [apiData, setApiData] = useState(null);

  let [apiColors, setApiColors] = useState(defaultColors);

  let history = useHistory();
  let actionNumber = 0;

  useEffect(() => {
    onSnapshot(doc(db, "planz", props.match.params.id), (doc) => {
      if(doc.exists()){
            setApiData(doc.data());
            setApiColors({background: "#ffffff",...doc.data().colors})
      }
      else
        history.push(`${props.match.params.id}/Registration`);
    })
    
    return {}
  }, [history, props.match.params.id, apiData]);


  function goToCategory(userChoice, nextEvent) {
    history.push({
      pathname: `${props.match.params.id}/Questionaire`,
      state: {
        apiData: apiData,
        nextEvent: nextEvent,
        userChoice:userChoice,
        apiColors:apiColors
      },
    });
  }
  
  function toNextSlide(event) {
    event.preventDefault();
    if (
      Number(event.target.id) ===
      apiData.paths[2].events[0].dependencies[0].availability.eventEndIdx
    )
      goToCategory(2, 0);
    else if (
      Number(event.target.id) ===
      apiData.paths[1].events[0].dependencies[0].availability.eventEndIdx
    )
    goToCategory(1, 0);
    else if (
      Number(event.target.id) ===
      apiData.paths[0].events[1].dependencies[0].availability.eventEndIdx
    )
    goToCategory(0, 1);
  }

  
  return (
    <div>
      <div className="MuiDialog-root event-modal" dir="rtl">
        <div className="MuiDialog-container MuiDialog-scrollPaper">
          <div
            className="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded"
            aria-labelledby="customized-dialog-title" style={{backgroundColor:apiColors.background}}
          >
            <div className="dialog-heading-cont sales-event-name rtl-cont">
              <div className="logo-container rtl-logo-container" style={{backgroundColor:apiColors.main}}>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/simplan-38b89.appspot.com/o/images%2F7a9a71cb-74e2-45e6-8889-3d24de1083e2.png?alt=media&amp;token=32ca6127-1d28-4a7e-bf74-4b3268c7bb47"
                  className="test organization-logo rtl-organization-logo"
                  alt=""
                />
              </div>
              <div className="dialog-heading rtl-heading" style={{backgroundColor:apiColors.main,color:apiColors.title}}>
                <p className="MuiTypography-root plan-name MuiTypography-body1">
                {apiData && apiData.title}
                </p>
              </div>
            </div>
            <div className="content rtl-heading" >
              <p className="MuiTypography-root heading rtl-heading-text MuiTypography-body1" style={{color:apiColors.main}}>
              {apiData && apiData.paths[0].events[0].title}
              </p>
              <span className="content-message rtl-content-message" style={{color:apiColors.description}}>
                <p className="MuiTypography-root text-inline MuiTypography-body1">
                { apiData && apiData.paths[0].events[0].content.message}
                </p>
              </span>
            </div>
            <div className="actions-container">
            {apiData &&
        apiData.paths[0].events[0].content.actions.map((action) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
