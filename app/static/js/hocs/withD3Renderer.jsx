import React, { Component } from 'react';

const withD3Renderer = (
    url,
    updateOn = ['data']
) => WrappedComponent => {
    return class WithD3Renderer extends Component {
        
        componentDidMount() {
            fetch('/json/stat_ori')
            .then(response => response.json())
            .then(data => {
                this.setState({ initialData: data })
                console.log(this.state.initialData)
            })
        }

        componentDidUpdate(prevProps, prevState) {
          
        }

        render() {
            const {forwardedRef, ...otherProps} = this.props;
            return <WrappedComponent ref={forwardedRef} {...otherProps}/>
        }
        
    }
}

export default withD3Renderer;