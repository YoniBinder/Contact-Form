import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export interface UserDetailsProps {

}

export default function UserDetails (props: UserDetailsProps) {

      const [firstQuestion,setFirstQuestion]=useState("firstAnswer")
      let history =useHistory()

      function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        setFirstQuestion(e.target.value)
      } 

    function toSecondQuestionnaire(e:React.SyntheticEvent){
        e.preventDefault();
        let userDetails = JSON.stringify(firstQuestion);
        console.log(userDetails);
        history.push("/SecondQuestionnaire");
    }

  return (
    <div>
          <form onSubmit={(e)=>toSecondQuestionnaire(e)}>
          <h1>האם שמעת על גישת שפר?</h1>

                        <p className="radioP">
                            <input onChange={(e)=>handleChange(e)} type="radio" name="answers" value="firstAnswer" required defaultChecked/>
                            <label htmlFor="Answer1">
                                <span className="radioButtonGraph"></span>
                                אשמח להכיר 
                            </label>
                        </p>
                       
                        <p className="radioP">
                            <input onChange={(e)=>handleChange(e)} type="radio" name="answers" value="secondAnswer" required/>
                            <label htmlFor="Answer2">
                                <span className="radioButtonGraph"></span>
                                  כן, שמעתי וקראתי עליה                                
                            </label>
                        </p>
                        <p className="radioP">
                            <input onChange={(e)=>handleChange(e)} type="radio" name="answers" value="thirdAnswer" required />
                            <label htmlFor="Answer3">
                                <span className="radioButtonGraph"></span>
                                בודאי, השתתפתי בסדנה
                            </label>
                        </p>
                        <button type="submit">שליחה</button>
                    </form>
    </div>
  );
}
