import React, { Component } from 'react';

import Lines from './charts/Lines';

class MultipleLines extends Component {
    constructor(props) {
        super(props);
        // this.dataFormualater = this.dataFormualater.bind(this);
    }

    state = {
        data: null,
        opacity: null,
        groups: null,
        time: null,
        index: null,
    }

    componentDidMount() {
        let { name, setLineMax } = this.props;
        
        fetch(this.props.initurl)
            .then(res => res.json())
            .then(data => {
                let lines = JSON.parse(data['lines'])
                this.setState({
                    time: lines["columns"],
                    index: lines["index"],
                    data: lines["data"],
                    opacity: data["opacity"],
                    groups: data['groups']
                })
                if(name === "col1-mulline") {
                    let maxRow = lines["data"].map(row => Math.max.apply(Math, row))
                    let max = Math.max.apply(null, maxRow)
                    setLineMax(max)
                }
                
        })
    }

    render() {
        let { time, index, data, opacity, groups } = this.state;
        const { lineMax } = this.props;
        return (
            <div>
                {data && lineMax ? 
                <Lines time={time} index={index} data={ data } opacity={opacity} groups={groups} {...this.props} /> : <p>Loading...</p>}
            </div>
        )
    }
}

export default MultipleLines;