import { useState,useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './UserDetails.css';
import { db} from "../../config/firebase";
import {ref,child,get } from "firebase/database"

export interface UserDetailsProps {
    match:any;
    params:any;
}

export default function UserDetails (props: UserDetailsProps) {
    const data={
        fullName: "",
        phone:"",
        email: "",
    }
    const [inputs,setInputs]=useState(data)
    let history =useHistory()
    
    useEffect(()=>{
        get(child(ref(db),props.match.params.id)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                let data=snapshot.val()
            } else {
                history.push("/");        
            }
          }).catch((error) => {
            console.error(error);
          });

    },[props])
    
    

    function handleChange(event:React.ChangeEvent<HTMLInputElement>){
   
        const {name,value}=event.target
        setInputs(prev=>({...prev,[name]:value}))
    } 
    function toFirstQuestionnaire(event:React.SyntheticEvent){
   
        event.preventDefault();
        let userDetails = JSON.stringify(inputs);
        console.log(userDetails);
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
                <label htmlFor="InputName">שם ושם משפחה *</label>
                <input id="InputName" name="fullName" onChange={(event)=>handleChange(event)} placeholder="שם פרטי ומשפחה" type="text" aria-describedby="userDescription" required/>
            <br/>
            <label htmlFor="InputPhone">טלפון *</label>
                <input id="InputPhone" name="phone" onChange={(event)=>handleChange(event)} placeholder="טלפון" type="text" aria-describedby="userDescription" required/>
            <br/>
            <label htmlFor="InputEmail">אי-מייל *</label>
                <input id="InputEmail" name="email" onChange={(event)=>handleChange(event)} placeholder="אימייל" type="text" aria-describedby="userDescription" required/>
            <br/>
            <button type="submit">שליחה</button>
        </form>
    </div>
  );
}
