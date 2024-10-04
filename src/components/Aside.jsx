import PropTypes from 'prop-types';
import React from 'react';


export default function Aside( { children }){
    return (
        <aside className="w-1/4 bg-[#313133] p-6 rounded-lg shadow-lg text-left max-w-md">
          {children}
        </aside>
    )


}

Aside.propTypes = {
    children: PropTypes.node.isRequired,
};
