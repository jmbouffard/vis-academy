import React from 'react';
import {charts} from './style';

import {
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';

export default function Charts({sites}) {
  if (!sites) {
    return (<div style={charts}/>);
  }
  return (
    <div style={charts}>
      <h2>Sites by services</h2>
      <p>As percentage of all sites</p>
      <XYPlot
        height={140}
        width={480}
      >
      <XAxis />
      <YAxis />
      <VerticalBarSeries
        data={sites}
      />
      </XYPlot>
    </div>
  );
}
 
/*export default function Charts() {
  return (
    <div style={charts} />
  );
}*/
