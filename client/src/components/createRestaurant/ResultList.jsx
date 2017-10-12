import React from 'react';


// on click, send result[index] 
const ResultList = (props) => {
  const list = props.results.map((result, index) => {
    return <li key={index} onClick={() => {props.select(index)}}>{result.name}</li>
  });

  return (
    <div>
      Select your restaurant:
      {list}
    </div>
  )
}

export default ResultList;