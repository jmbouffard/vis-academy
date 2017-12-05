import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer, HexagonLayer} from 'deck.gl';

const DEFAULT_COLOR = [0, 128, 255];
const AWS_COLOR = [115, 160, 175];
const CELL_COLOR = [130, 250, 109];
const PCS_COLOR = [102, 95, 108];
const MBS_COLOR = [225, 140, 209];
const BRS_COLOR = [239, 208, 100];

// in RGB
const HEATMAP_COLORS = [
  [213, 62, 79],
  [252, 141, 89],
  [254, 224, 139],
  [230, 245, 152],
  [153, 213, 148],
  [50, 136, 189]
].reverse();

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];



export default class DeckGLOverlay extends Component {
  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    if (!this.props.data) {
      return null;
    }

    //const layers = [];

    const layers = [
      !this.props.showHexagon ? new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        //getColor: d => [0, 128, 255],
        getColor: d => {switch (d.service) {
          case 'AWS':
            return AWS_COLOR;
          case 'CELL':
            return CELL_COLOR;
          case 'PCS':
            return PCS_COLOR;
          case 'MBS':
            return MBS_COLOR;
          case 'BRS':
            return CELL_COLOR;
          default:
            return DEFAULT_COLOR;
          }
        }, //[0, 128, 255], //{d.pickup ? [0, 128, 255] : [255, 128, 0]},
        getRadius: d => 5,
        opacity: 0.5,
        pickable: false,
        radiusScale: 5,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        ...this.props
      }) : null,
      this.props.showHexagon ? new HexagonLayer({
        id: 'heatmap',
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 1,
        pickable: true,
        radius: 300,
        ...this.props
      }) : null
    ];
    
    return (
      <DeckGL {...this.props.viewport} layers={layers} onWebGLInitialized={this._initialize}/>
    );
  }
}