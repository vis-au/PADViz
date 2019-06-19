import React, { Component } from 'react';
import sizeMe from 'react-sizeme';

import Diff from './charts/Diff';

class DiffScatterPlot extends Component {
    
    constructor(props) {
        super(props)
    }
    state = {
        data: null
    }

    componentDidMount() {
        // fetch(this.props.initUrl)
        fetch("/data/diff")
        .then(res => res.json())
        .then(data => this.setState({
            data: data
        }))
    }

    // componentDidUpdate(prevProps) {
    //     if(this.props.update && this.props.update != prevProps.update) {
    //         this.setState({initData: JSON.parse(this.props.update) });
    //     }
    // }

    render(){
        const { data } = this.state;
        let { width, height, name } = this.props;

        return(
            <div>
                { data ? 
                <Diff data={data} width={width} height={height} name={name} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default DiffScatterPlot;