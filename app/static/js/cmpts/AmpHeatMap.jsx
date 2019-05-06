import React, { Component } from 'react';
import Heatmap from '../d3charts/HeatMap';


export default class AmpHeatMap extends Component {
    constructor(props) {
        super(props);
    }

    state ={
        data: null,
        isLoaded: false
    }

    componentDidMount() {
        fetch("/json/heatmap")
            .then(res => res.json())
            .then(data => {
                // let indexMap = {};
                // data.map(function(d, i) {
                //     d.instances.forEach(function(idx) {
                //         if(idx in indexMap) indexMap[idx].push(i)
                //         else indexMap[idx] = [i]
                //     })
                // })
                this.setState({
                    isLoaded: true,
                    data: data,
                    // indexMap: indexMap
                })
            })
            .then(d => {
                console.log(d);
                let p = {
                    width: 1400,
                    height: 400,
                    margin: {top: 20, right: 100, bottom: 20, left: 100},
                }
                let node = this.refs.chart;
                this.hm = new Heatmap(this.props.data, p);
                this.hm.create(node);
            });
    }

    render() {
        return (
            <div className="chart" ref="hm">
            </div>
        )
    }
}