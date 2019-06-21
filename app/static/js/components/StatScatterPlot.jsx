import React, { Component } from 'react';

import Stat from "./charts/Stat";

class StatScatterPlot extends Component {
    
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
        let { name, setStatXY } = this.props;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            let dots = JSON.parse(data['dots']);
            this.setState({
                data: dots,
                groups: data["groups"]
            })
            if(name === "col1-stat") {
                let min = Number.MIN_VALUE;
                let max = Number.MIN_VALUE;
                dots.forEach(d => Object.keys(d).forEach(function(k) {
                    if(k === 'mean') min = Math.max(min, d[k]);
                    if(k === "std") max = Math.max(max, d[k]);
                }));
                setStatXY([min, max])
            }
        })
    }

    render(){
        const { data, groups } = this.state;
        const { statxy } = this.props;
        return(
            <div>
                { data && statxy.length > 0 ? 
                <Stat data={data} groups={groups} {...this.props}/> 
                : <p>Loading...</p>}
            </div>
        )
        
    }
}

export default StatScatterPlot;