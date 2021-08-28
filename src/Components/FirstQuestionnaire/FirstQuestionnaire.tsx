import * as React from 'react';
import { useHistory } from 'react-router-dom';

export interface UserDetailsProps {

}

export default function UserDetails (props: UserDetailsProps) {

    let history =useHistory()

    function toSecondQuestionnaire(e:React.SyntheticEvent){
        e.preventDefault();
        console.log('You clicked second submit.');
        history.push("/SecondQuestionnaire");
    }

  return (
    <div>
        <form onSubmit={toSecondQuestionnaire}>
            <h1>This is the Second Slide</h1>
            <button type="submit">Submit</button>
        </form>
    </div>
  );
}
