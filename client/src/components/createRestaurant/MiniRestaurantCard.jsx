import React from 'react';


// on click, send result[index]
const MiniRestaurantCard = (props) => {
  return (
    <li className='searchEntry'>{props.restaurant.name}</li>
  )
}

export default MiniRestaurantCard;
