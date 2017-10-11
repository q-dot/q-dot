import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from 'mapbox/lib/services/geocoding';
import Directions from 'mapbox/lib/services/directions';

class QueueInfoMap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmFyZS1taW5pbXVtIiwiYSI6ImNqOG1hbXVtNzB3cmwycGpzZGJzazFoNzMifQ.f8cGHlo4g6pPD75LzPLFPw';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [0, 0],
      zoom: 1
    });

  //   var geocoder = new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken
  //   });

  //   map.addControl(geocoder);
  //   map.on('load', () => {
  //     geocoder.query(this.props.client);
  //     map.addSource('single-point', {
  //       'type': 'geojson',
  //       'data': {
  //         'type': 'FeatureCollection',
  //         'features': []
  //       }
  //     });

  //     map.addLayer({
  //         "id": "point",
  //         "source": "single-point",
  //         "type": "circle",
  //         "paint": {
  //             "circle-radius": 3,
  //             "circle-color": "#C70039"
  //         }
  //     });

  //     // Listen for the `geocoder.input` event that is triggered when a user
  //     // makes a selection and add a symbol that matches the result.
  //     geocoder.on('result', function(ev) {
  //         map.getSource('single-point').setData(ev.result.geometry);
  //     });
  //   });
  }    

  render() {
    return (
      <div style={{width: '600px', height: '500px'}} id="map">{this.props.client}{this.props.restaurant}</div>
    );
  }    
}

export default QueueInfoMap;