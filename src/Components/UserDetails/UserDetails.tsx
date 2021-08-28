import * as React from 'react';
import { useHistory } from 'react-router-dom';
import './UserDetails.css';

export interface UserDetailsProps {

}

export default function UserDetails (props: UserDetailsProps) {

    let history =useHistory()

    function toFirstQuestionnaire(e:React.SyntheticEvent){
        e.preventDefault();
        console.log('You clicked first submit.');
        history.push("/FirstQuestionnaire");
    }

  return (
    <div>
        <form onSubmit={toFirstQuestionnaire}>
            <h1>להנות כהורה ולהעביר את זה הלאה - מרכז שפר</h1>
            <h3>
                הורים רבים מרגישים אבודים ומתוסכלים לנוכח קשיי למידה, חיברות והתנהגות של ילדיהם.
                <br/>
                 ההורים עומדים חסרי אונים ולא מבינים מדוע גידול הילדים כל כך מעיק.
                <br/>
                  קורס ההכשרה של שפר יתן לכם כלים להפוך למנחי הורים ולתת מענה בדיוק לקשיים אלו.
                <br/>
                   לייעוץ והרשמה לקורס הכשרת המנחים הקרוב:
            </h3>
            <label>שם ושם משפחה</label>
            <input name="fullName"/>
            <br/>
            <label>טלפון</label>
            <input name="phone"/>
            <br/>
            <label>אימייל</label>
            <input name="email"/>
            <br/>
            <button type="submit">שליחה</button>
        </form>
    </div>
  );
}
