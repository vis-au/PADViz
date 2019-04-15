import React from 'react';
import PropTypes from 'prop-types';

const Tooltip = (content) => (
    <div>
        {content}
    </div>
)

Tooltip.propType = {
    contet: PropTypes.string.isRequired
}

export default Tooltip;