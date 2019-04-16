import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Tip = styled.div`
    background-color: gray;
    border: solid;
    border-width: 1px;
    padding: 5x;
    opacity: 0.8;
    color: black;
    z-index: 10;
    pointer-events: none;
`;

const Tooltip = ({style = {}, content}) => (
    <Tip className="tooltip" style={style}>
        <p>{content}</p>
    </Tip>
)

// Tooltip.propType = {
//     contet: PropTypes.string.isRequired
// }

export default Tooltip;