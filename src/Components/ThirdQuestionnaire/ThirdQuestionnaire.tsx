import * as React from 'react';
import { useHistory } from 'react-router-dom';

export interface UserDetailsProps {

}

export default function UserDetails (props: UserDetailsProps) {

    let history =useHistory()

    function toGoodbye(e:React.SyntheticEvent){
        e.preventDefault();
        console.log('You clicked fourth submit.');
        history.push("/Goodbye");
    }

  return (
    <div>
        <form onSubmit={toGoodbye}>
            <h1>This is the Fourth Slide</h1>
            <button type="submit">Submit</button>
        </form>
    </div>
  );
}
