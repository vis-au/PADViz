import MultiLines from '../d3charts/MultiLines';
import React, { Component } from 'react';

export default class Lines extends Component {
    
    state = {
        data: [
            {
              name: "USA",
              values: [
                {date: "2000", price: "100"},
                {date: "2001", price: "110"},
                {date: "2002", price: "145"},
                {date: "2003", price: "241"},
                {date: "2004", price: "101"},
                {date: "2005", price: "90"},
                {date: "2006", price: "10"},
                {date: "2007", price: "35"},
                {date: "2008", price: "21"},
                {date: "2009", price: "201"}
              ]
            },
            {
              name: "Canada",
              values: [
                {date: "2000", price: "200"},
                {date: "2001", price: "120"},
                {date: "2002", price: "33"},
                {date: "2003", price: "21"},
                {date: "2004", price: "51"},
                {date: "2005", price: "190"},
                {date: "2006", price: "120"},
                {date: "2007", price: "85"},
                {date: "2008", price: "221"},
                {date: "2009", price: "101"}
              ]
            },
            {
              name: "Maxico",
              values: [
                {date: "2000", price: "50"},
                {date: "2001", price: "10"},
                {date: "2002", price: "5"},
                {date: "2003", price: "71"},
                {date: "2004", price: "20"},
                {date: "2005", price: "9"},
                {date: "2006", price: "220"},
                {date: "2007", price: "235"},
                {date: "2008", price: "61"},
                {date: "2009", price: "10"}
              ]
            }
          ]
    }
    componentDidMount() {
        let el = this.refs.chart;
        this.ml = new MultiLines(this.state.data);

        this.ml.create(el, {}, null)
    }

    componentDidUpdate() {
        let el = this.refs.chart;
        // this.ml.update(el, this.getChartState)
    }

    getChartState() {
        return {
            data: [{id: '5fbmzmtc', x: 7, y: 41, z: 6},
            {id: 's4f8phwm', x: 11, y: 45, z: 9}],
            domain: {x: [0, 30], y: [0, 100]}
        }
    }


    render() {
        return (
            <div className="Chart" ref="chart">
            </div>
        )
    }
}


