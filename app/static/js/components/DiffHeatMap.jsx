import React, { Component } from 'react';

import HeatMap from './charts/HeatMap';

class DiffHeatMap extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        data: null,
        indexMap: null,
    }

    componentDidMount() {
        fetch(this.props.initurl)
            .then(res => res.json())
            .then(data => this.setState({
                data: data,
                indexMap: this.getIndexMap(data)
        }))
    }

    getIndexMap(data) {
        let indexMap = {};
        data.map(function(d, i) {
            d.instances.forEach(function(idx) {
                if(idx in indexMap) indexMap[idx].push(i)
                else indexMap[idx] = [i]
            })
        })
        return indexMap;
    }

    render() {
        let { data, indexMap } = this.state;
        const { width, height } = this.props;
        
        return (
            <div>
                {data ? <HeatMap data={data} indexMap={indexMap} {...this.props}/> : <p>Loading...</p>}
            </div>
        )
    }
}

export default DiffHeatMap;