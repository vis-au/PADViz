import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Tip = styled.div`
    background-color: #e0e0e0;
    border: solid 1px;
    border-radius: 2px;
    border-color: #d0d0d0;
    padding: 5px;
    text-align: center;
    opacity: 0.8;
    z-index: 10;
    pointer-events: none;
`;

const Tooltip = ({style = {}, content}) => (
    <Tip className="tooltip" style={style}>
        <p>{content}</p>
    </Tip>
)

Tooltip.propType = {
    content: PropTypes.string.isRequired
}

export default Tooltip;