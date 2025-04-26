// Create a component for the alert box similar to the one in the login page

import React from "react";

interface AlertBoxProps {
  message: string;
  onClose: () => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ message, onClose }) => {
  return (
    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col gap-4 rounded-lg bg-black p-6 text-white shadow-lg">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="right-4 bottom-4 w-fit self-end rounded-full bg-blue-500 px-4 py-2 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertBox;
