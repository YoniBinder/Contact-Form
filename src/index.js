import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import UserSubject from './Components/UserSubject/UserSubject';
import Questionaire from './Components/Questionaire/Questionaire';
import Registration from './Components/Registration/Registration';

ReactDOM.render(
  <>
    <Router>
        <Switch>
          <Route exact path="/:id" component={UserSubject}/>
          <Route exact path="/:id/Registration" component={Registration}/>
          <Route path="/:id/Questionaire" component={Questionaire}/>
          <Route component={Registration}/>
        </Switch>
    </Router>

  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
