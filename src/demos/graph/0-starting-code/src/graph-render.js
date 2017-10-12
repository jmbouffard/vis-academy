import React, {Component} from 'react';
// 0. import modules
import DeckGL, {
    ScatterplotLayer,
    LineLayer,
    OrthographicViewport,
    COORDINATE_SYSTEM
  } from 'deck.gl';

export default class GraphRender extends Component {
  render() {
    const layers = [];
    // 0. create deck.gl instance
    return (
        <div id="graph-render">
        <DeckGL
          width={this.props.width}
          height={this.props.height}
          viewport={this.createViewport()}
          layers={[
            this.createEdgeLayer(),
            this.createNodeLayer()
          ]}
        />
      </div>
    );
  }

  // 1. add a method to create node layer
  createNodeLayer() {
    return new ScatterplotLayer({
      id: 'node-layer',
      data: this.props.nodes,
      getPosition: node => this.props.getNodePosition(node),
      getRadius: node => this.props.getNodeSize(node),
      getColor: node => this.props.getNodeColor(node),
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  // 1. add a method to create edge layer
  createEdgeLayer() {
    return new LineLayer({
      id: 'edge-layer',
      data: this.props.edges,
      getSourcePosition: e =>
        this.props.getEdgePosition(e).sourcePosition,
      getTargetPosition: e =>
        this.props.getEdgePosition(e).targetPosition,
      getColor: e => this.props.getEdgeColor(e),
      strokeWidth: this.props.getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  // 1. add a method to create viewport
  createViewport() {
    const width = this.props.width;
    const height = this.props.height;
    return new OrthographicViewport({
      width,
      height,
      left: (-width / 2),
      top: (-height / 2)
    });
  }
}