// ProgressIndicator.jsx
import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
    const stepArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex justify-between mb-6">
            {stepArray.map((step) => (
                <div key={step} className="flex-1 text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step <= currentStep ? 'bg-blue-500' : 'bg-gray-300'} text-white`}>
                        {step}
                    </div>
                    {step !== totalSteps && (
                        <div className={`w-full h-2 ${step < currentStep ? 'bg-blue-500' : 'bg-gray-300'} mx-auto`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressIndicator;
