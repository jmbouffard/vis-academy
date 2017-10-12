/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
//import taxiData from '../../../data/taxi';
import wsData from '../../../data/WS_Stations';
import DeckGLOverlay from './deckgl-overlay';
import {LayerControls, SCATTERPLOT_CONTROLS} from './layer-controls';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9'; //'mapbox://styles/mapbox/streets-v10';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // add settings
      settings: Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }), {}),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -75.68,//-74,
        latitude: 45.42,//40.7,
        zoom: 11,
        maxZoom: 16
      }
    };
    this._resize = this._resize.bind(this);
  }

  componentDidMount() {
    this._processData();
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _processData() {
    if (wsData) {
      this.setState({status: 'LOADED'});
      const points = wsData.reduce((accu, curr) => {
        accu.push({
          position: [Number(curr.longitude), Number(curr.latitude)],
          pickup: true
        });
        return accu;
      }, []);
      console.log(points);
      this.setState({
        points,
        status: 'READY'
      });
    }
  }

  /* Original Uber data */
  /*_processData() {
    if (taxiData) {
      this.setState({status: 'LOADED'});
      const points = taxiData.reduce((accu, curr) => {
        accu.push({
          position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
          pickup: true
        });
        accu.push({
          position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
          pickup: false
        });
        return accu;
      }, []);
      console.log(points);
      this.setState({
        points,
        status: 'READY'
      });
    }
  }*/

  _updateLayerSettings(settings) {
    this.setState({settings});
  }

  render() {
    return (
      <div>
        <LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}/>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={viewport => this._onViewportChange(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={this.state.viewport}
            data={this.state.points}
            {...this.state.settings} />
        </MapGL>
      </div>
    );
  }
}
