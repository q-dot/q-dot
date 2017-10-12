import React from 'react';
import mapboxgl from 'mapbox-gl';
import polyline from 'polyline';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      poly: '',
      distance: '',
      duration: ''
    };

    this.flip = this.flip.bind(this);
  }

  flip(data) {
    let newData = [];
    for (let i = 0; i < data.length - 1; i++) {
      newData.push([data[i][1], data[i][0]]);
    }
    return newData;
  }

  componentWillReceiveProps(nextProps) {

    $.ajax({
      method: 'GET',
      url: '/map',
      data: {user: nextProps.user, restaurant: nextProps.restaurant},
      success: (body) => {
        var data = JSON.parse(body);
        console.log('######this is the data: ', typeof data, data);
        this.setState({
          poly: data.routes[0].overview_polyline.points,
          distance: data.routes[0].legs[0].distance.text,
          duration: data.routes[0].legs[0].duration.text,
        });
        //   start: {
        //     address: data.routes.legs[0].start_address, 
        //     lat: data.routes.legs[0].start_location.lat, 
        //     lng: data.routes.legs[0].start_location.lng},
        //   end: {
        //     address: data.routes.legs[0].end_address, 
        //     lat: data.routes.legs[0].end_location.lat, 
        //     lng: data.routes.legs[0].end_location.lng}

        mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyZS1taW5pbXVtIiwiYSI6ImNqOG1hbXVtNzB3cmwycGpzZGJzazFoNzMifQ.f8cGHlo4g6pPD75LzPLFPw';
        
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [ -122.407437, 37.787994],
          zoom: 13
        });
        
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-right');
        var coords = polyline.decode(this.state.poly); //data.routes[0].overview_polyline.points);
        var flipCoord = this.flip(coords);
        // var distance = data.routes[0].legs[0].distance.text;
        // var duration = data.routes[0].legs[0].duration.text;
        // var origin = [data.routes[0].legs[0].end_location.lng, data.routes[0].legs[0].end_location.lat];
        // var destination = [data.routes[0].legs[0].start_location.lng, data.routes[0].legs[0].start_location.lat];


        map.on('load', function () { 

          map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': {
              'type': 'geojson',
              'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'LineString',
                  'coordinates': flipCoord
                }
              }
            },
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#6985D9',
              'line-width': 8
            },
          }); 
        });  
      },
      failure: (error) => {
        console.log('failed to grab queue data for customer', error);
      }
    });
  }  

  render() {
    return (
      <div>
        <div className='map-div' id="map" style={{width: '600px', height: '500px'}}></div>
        <br/>
        <br/>
        <div className='map-info'>
          <br/>
          <h5>you are {this.state.distance} from the restaurant</h5>
          <h5>it will take {this.state.duration} to get there</h5>
        </div>
      </div>  
    );
  }    
}

export default MapContainer;
