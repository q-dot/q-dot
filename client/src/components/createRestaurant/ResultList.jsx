import React from 'react';
import MiniRestaurantCard from './MiniRestaurantCard.jsx';

// on click, send result[index]
const ResultList = (props) => {
  const list = props.results.map((result, index) => {
    return <div key={index} onClick={() => { props.select(index); }}>
      <MiniRestaurantCard restaurant={result}/>
    </div>;
  });

  return (
    <div>
      <h2 className='form-signin-heading'>Select your restaurant:</h2>
      {list}
    </div>
  );
};

export default ResultList;
