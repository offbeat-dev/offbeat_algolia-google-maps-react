import { ReactElement } from 'react';

import { Status, Wrapper } from '@googlemaps/react-wrapper';
import GoogleMap from './components/GoogleMap';

const App = () => {
  const center = { lat: 0, lng: -70.644 };
  const zoom = 4;

  const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <></>;
  };

  return (
    <div className="App">
      <Wrapper
        apiKey={'AIzaSyCs2ax90g4pVVd17c7cL_yE9opoGg6Mt4Q'}
        render={render}
      >
        <GoogleMap center={center} zoom={zoom}>
          <></>
        </GoogleMap>
      </Wrapper>
    </div>
  );
};

export default App;
