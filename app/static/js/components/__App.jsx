import React, { Component } from 'react';

import HeatMap from './tmp/HeatMap';
import HeatMapS2 from './tmp/HeatMapS2';
import HeatMapS6 from './tmp/HeatMapS6';
import OriStd from './tmp/OriStd';
import Spaghetti1 from './tmp/Spaghetti1';
import Spaghetti from './tmp/Line';
import OriMaxMin from './tmp/OriMaxMin';
import Spaghetti2 from './tmp/Spaghetti2';
import OriStd1 from './tmp/OriStd.1';
import OriStd2 from './tmp/OriStd.2';


class App extends Component {
    render() {
        return (
            <div style={{position: "relative"}}>
            {/* <div> <HeatMap /></div> */}
            {/* <div > <HeatMapS2 /></div> */}
            {/* <div > <HeatMapS6 /></div> */}
            
            <div> <Spaghetti /></div>
            <div><OriStd /></div>
            <div><OriStd1 /></div>
            <div><OriStd2 /></div>
            {/* <div><OriMaxMin /></div> */}
            <div><Spaghetti1 /></div>
            <div><Spaghetti2 /></div>
            <div></div>
            <div></div>
               
            </div>
        )
    }
}

export default App;