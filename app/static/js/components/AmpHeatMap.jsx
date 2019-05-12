import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import HeatMap from './charts/HeatMap';

class AmpHeatMap extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        initData: null,
        indexMap: null,
    }

    componentDidMount() {
        fetch(this.props.initUrl)
        .then(res => res.json())
        .then(data => {
            this.getIndexMap(data);
            this.setState({
                initData: data,
            })
        })
    }

    getIndexMap(data) {
        let indexMap = {};
        data.map(function(d, i) {
            d.instances.forEach(function(idx) {
                if(idx in indexMap) indexMap[idx].push(i)
                else indexMap[idx] = [i]
            })
        })
        this.setState({indexMap: indexMap})
    }

    componentDidUpdate(prevProps) {
        if(this.props.update && this.props.update != prevProps.update) {
            let ud = JSON.parse(this.props.update) 
            this.getIndexMap(ud);
            this.setState({initData: ud});
        }
    }

    render(){
        let {initData, indexMap} = this.state;
        let { width, height} = this.props.size;
        let { name } = this.props;

        return(
            <div>
                { initData ? 
                <HeatMap initData={initData} indexMap={indexMap} name={name} width={width} height={height ? height : 400} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }

}

export default sizeMe({ monitorHeight: true })(AmpHeatMap);