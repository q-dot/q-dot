import React from 'react';


// on click, send result[index]
const MiniRestaurantCard = (props) => {
  return (
    <div className='searchEntry hoverable'>
      <div className='mini-restaurant-thumbnail' style={{backgroundImage: `url(${props.restaurant.image_url})`}}>
        {/* <img src={props.restaurant.image_url}/> */}
      </div>
      <div className='description'>
        <h5>{props.restaurant.name}</h5>
        <p className='address'>{props.restaurant.location.address1}, {props.restaurant.location.city}</p>
      </div>
    </div>
  )
}

export default MiniRestaurantCard;
