import * as React from 'react';
import { useHistory } from 'react-router-dom';

export interface UserDetailsProps {

}

export default function UserDetails (props: UserDetailsProps) {

    let history =useHistory()

    function toThirdQuestionnaire(e:React.SyntheticEvent){
        e.preventDefault();
        console.log('You clicked third submit.');
        history.push("/ThirdQuestionnaire");
    }

  return (
    <div>
        <form onSubmit={toThirdQuestionnaire}>
            <h1>This is the Third Slide</h1>
            <button type="submit">Submit</button>
        </form>
    </div>
  );
}
