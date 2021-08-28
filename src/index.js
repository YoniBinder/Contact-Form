import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import UserDetails from './Components/UserDetails/UserDetails';
import FirstQuestionnaire from './Components/FirstQuestionnaire/FirstQuestionnaire';
import SecondQuestionnaire from './Components/SecondQuestionnaire/SecondQuestionnaire';
import ThirdQuestionnaire from './Components/ThirdQuestionnaire/ThirdQuestionnaire';
import Goodbye from './Components/Goodbye/Goodbye';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <Switch>
          <Route exact path="/" component={UserDetails}/>
          <Route exact path="/FirstQuestionnaire" component={FirstQuestionnaire}/>
          <Route exact path="/SecondQuestionnaire" component={SecondQuestionnaire}/>
          <Route exact path="/ThirdQuestionnaire" component={ThirdQuestionnaire}/>
          <Route exact path="/Goodbye" component={Goodbye}/>
        </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
