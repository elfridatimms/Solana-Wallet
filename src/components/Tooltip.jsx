import React, { useState } from 'react';

const Tooltip = ({ children, text }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className="absolute bottom-full mb-2 w-max p-2 bg-gray-700 text-white text-sm rounded-md shadow-lg">
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
