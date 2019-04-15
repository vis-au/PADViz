import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Tip = styled.div`
    background-color: white;
    border: solid;
    border-width: 2px;
    padding: 5x;
    opacity: 1;
    color: black;
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