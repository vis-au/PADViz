import React, { Component } from 'react';

const withD3Renderer = (
    url
) => WrappedComponent => {
    return class WithD3Renderer extends Component {
        constructor(props) {
            super(props)
        }
        
        state = {
            initData: null,
            loading: false
        }

        componentDidMount() {
            this.setState({loading: true})
            fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({ initData: data,
                    loading: false })
            })
            .catch(err => console.log(err))
        }

        // componentDidUpdate(prevProps, prevState) {
          
        // }

        render() {
            const {forwardedRef, ...otherProps} = this.props;
            return <WrappedComponent ref={forwardedRef} {...otherProps} {...this.state}/>
        }
        
    }
}

export default withD3Renderer;