/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
//import taxiData from '../../../data/taxi';
//import wsData from '../../../data/WS_Stations';
import wsData from '../../../data/Site_Data_QC_ON';
import DeckGLOverlay from './deckgl-overlay';
import {LayerControls, HEXAGON_CONTROLS} from './layer-controls';
import Charts from './charts';
import {tooltipStyle} from './style';

//const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9'; //'mapbox://styles/mapbox/streets-v10';
const MAPBOX_STYLE = 'mapbox://styles/jmbouffard/cjasoezw8jdpb2snwmwko9q39';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // add settings
      settings: Object.keys(HEXAGON_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: HEXAGON_CONTROLS[key].value
      }), {}),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -75.68,//-74,
        latitude: 45.42,//40.7,
        zoom: 8,
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

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
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
          new_licno: String(curr.new_licno),
          service: String(curr.service)
        });
        return accu;
      }, []);
      console.log("Number of points displayed: "+points.length);
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
        {this.state.hoveredObject &&
          <div style={{
            ...tooltipStyle,
            transform: `translate(${this.state.x}px, ${this.state.y}px)`
          }}>
            <div>{
              JSON.stringify(this.state.hoveredObject.points)}</div>
          </div>}
        {/*this.state.hoveredObject &&
        <div style={{
          ...tooltipStyle,
          left: this.state.new_licno,
          top: this.state.service
        }}>
          <div>{this.state.hoveredObject.id}</div>
        </div>*/}
        <LayerControls
          settings={this.state.settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}/>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={viewport => this._onViewportChange(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={this.state.viewport}
            data={this.state.points}
            onHover={hover => this._onHover(hover)}
            {...this.state.settings} />
        </MapGL>
        {/*<Charts {...this.state} />*/}
      </div>
    );
  }
}
