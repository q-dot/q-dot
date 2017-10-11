import React from 'react';

const ResultList = (props) => {
  const list = props.results.map((result, index) => {
    return <li key={index}>{result.name}</li>
  });

  return (
    <div>
      RESULTS
      {list}
    </div>
  )
}

export default ResultList;