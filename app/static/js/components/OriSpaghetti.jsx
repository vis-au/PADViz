import React, { Component } from 'react';
import sizeMe from 'react-sizeme';


// import Spaghetti from './charts/Spaghetti';
import MultiLines from './charts/MultiLines';

class OriSpaghetti extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: false,
        initData: null
    }

    componentDidMount() {
        this.setState({isLoading: true});
        
        // fetch("/json/line")
        fetch("/json/line")
        .then(res => res.json())
        .then(data => this.setState({
            isLoading: false,
            initData: data
        }))
    }

    render(){
        const {initData} = this.state;
        let { width, height } = this.props.size
        return(
            <div>
                { initData ?
                <MultiLines initData={initData} width={width} height={height ? height : (width/3.5)} name="ori" {...this.props}/> 
                : <p>Loading...</p>}
                {/* { initData ?
                <Spaghetti initData={initData} width={width} height={height ? height : (width/3.5)} {...this.props}/> 
                : <p>Loading...</p>} */}
            </div>
        )
        
    }
}

export default sizeMe({ monitorHeight: true })(OriSpaghetti);