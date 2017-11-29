import React from 'react';
import mapboxgl from 'mapbox-gl';
import polyline from 'polyline';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      poly: '',
      distance: '',
      duration: '',
      renderMap: false
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
    if (!this.state.renderMap) {
      this.getMap(nextProps);
      this.setState({renderMap: true});
    }
 
  }  

  getMap(nextProps) {
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

        mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyZS1taW5pbXVtIiwiYSI6ImNqOG1hbXVtNzB3cmwycGpzZGJzazFoNzMifQ.f8cGHlo4g6pPD75LzPLFPw';
        
        var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [ -122.407437, 37.787994],
          zoom: 12
        });
        
        var nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-right');
        var coords = polyline.decode(this.state.poly); 
        var flipCoord = this.flip(coords);

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
        <br/>
        <div className='map' id="map"></div>
        <br/>
        <br/>
        <div className="map-info">
          <p>you are {this.state.distance} from the restaurant</p>
          <p>it will take {this.state.duration} to get there</p>
        </div>
      </div>  
    );
  }    
}

export default MapContainer;
