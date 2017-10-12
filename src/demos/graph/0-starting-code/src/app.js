/* global window */
import React, {Component} from 'react';
// 0. import Graph data and data structure.
import sampleGraph from '../../data/sample-graph';
import Graph from '../../common/graph';
// components
import GraphRender from './graph-render'

// 0. function to return random position.
function randomPosition(width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const x = Math.random() * width - halfWidth;
  const y = Math.random() * height - halfHeight;
  return [x, y];
}

export default class App extends Component {

  constructor(props) {
    super(props);
    // 1. add the graph to the component state.
    this.state = {
      graph: new Graph,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  componentDidMount() {
    // 2. call processData when the component is mounted.
    this.processData();
  }

  processData() {
    // 3. load the graph data and update graph in the state.
    if (sampleGraph) {
      // 1. get viewport state (width, height)
      const width = this.state.viewport.width;
      const height = this.state.viewport.height;
      const newGraph = new Graph();
      // 2. assign position to nodes
      sampleGraph.nodes.forEach(node =>
        newGraph.addNode({
          id: node.id,
          position: randomPosition(width, height)
        })
      );
      sampleGraph.edges.forEach(edge =>
        newGraph.addEdge(edge)
      );
      this.setState({graph: newGraph});
    }
  }

  // 0. define node accessors
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10
  getNodePosition = node => node.position

  // 1. define edge accessors
  getEdgeColor = edge => [64, 64, 64]
  getEdgeWidth = () => 2
  getEdgePosition = edge => ({
    sourcePosition: this.state.graph.findNode(edge.source).position,
    targetPosition: this.state.graph.findNode(edge.target).position
  })

  render() {
    return (
      <GraphRender
        /* viewport related */
        width={this.state.viewport.width}
        height={this.state.viewport.height}
        /* nodes related */
        nodes={this.state.graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this.getNodePosition}
        /* edges related */
        edges={this.state.graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this.getEdgePosition}
      />
    );
  }
}
