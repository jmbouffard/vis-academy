import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

const DEFAULT_COLOR = [0, 128, 255];
const AWS_COLOR = [115, 160, 175];
const CELL_COLOR = [130, 250, 109];
const PCS_COLOR = [102, 95, 108];
const MBS_COLOR = [225, 140, 209];
const BRS_COLOR = [239, 208, 100];


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
      new ScatterplotLayer({
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
      })
    ];
    
    return (
      <DeckGL {...this.props.viewport} layers={layers} onWebGLInitialized={this._initialize}/>
    );
  }
}