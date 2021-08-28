import * as React from 'react';
import { useHistory } from 'react-router-dom';

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
            <h1>This is the First Slide</h1>
            <button type="submit">Submit</button>
        </form>
    </div>
  );
}
