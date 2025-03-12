// Create a component for the alert box similar to the one in the login page

import React from 'react';

interface AlertBoxProps {
    message: string;
    onClose: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"> 
            <div className="bg-black p-6 rounded-lg shadow-lg text-white flex flex-col gap-4">
                <p>{message}</p>
                <button 
                    onClick={onClose} 
                    className="bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full w-fit self-end"> 
                    Close
                </button>
            </div>
        </div>
    );
};

export default AlertBox;