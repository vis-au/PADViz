import React, { Component } from 'react';

import Diff from './charts/Diff';

class DiffScatterPlot extends Component {
    
    constructor(props) {
        super(props)
    }
    state = {
        data: null
    }

    componentDidMount() {
        this.getData(this.props.url);
    }

    componentDidUpdate(prevProps) {
        if(this.props.url !== prevProps.url) {
            this.getData(this.props.url);
        }
    }

    getData(url) {
        let { name, setDiffXY } = this.props;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            let dots = JSON.parse(data['dots']);
            this.setState({
                data: dots,
                groups: data["groups"]
            })
            if(name === "col1-diff") {
                let min = Number.MIN_VALUE;
                let max = Number.MIN_VALUE;
                dots.forEach(d => Object.keys(d).forEach(function(k) {
                    if(k === 'min') min = Math.max(min, d[k]);
                    if(k === "max") max = Math.max(max, d[k]);
                }));
                setDiffXY([min, max])
            }
        })
    }

    render(){
        const { data, groups } = this.state;
        const { diffxy } = this.props;

        return(
            <div>
                { data && diffxy.length > 0 ? 
                <Diff data={data} groups={groups} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default DiffScatterPlot;