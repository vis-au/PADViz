import React, { Component } from 'react';

import Hea from './charts/Hea';

class DiffHeatMap extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        data: null,
        indexMap: null,
    }

    componentDidMount() {
        // fetch("/data/hm?wsize=8&step=5&bins=10")
        // fetch("/data/hm?k=2&dist=LM&rep=median")
        // fetch("/data/hm?k=3&dist=LM&rep=mean")
        fetch("/data/hm?k=3&dist=Euclidean&rep=mean")
        fetch("/data/hm")
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
        // this.setState({indexMap: indexMap})
    }

    render() {
        let { data, indexMap } = this.state;
        const { width, height } = this.props;
        return (
            <div>
                {data ? <Hea data={data} indexMap={indexMap}  width={width} height={height}/> : <p>Loading...</p>}
            </div>
        )
    }
}

export default DiffHeatMap;