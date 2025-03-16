// src/components/AlertModal.jsx
import React from "react";

const AlertModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            {/* Backdrop with animation */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className="bg-white rounded-lg shadow-xl transform transition-all max-w-md w-full mx-4 sm:mx-auto p-6 relative z-10">
                <div className="text-center">
                    {/* Warning icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg
                            className="h-10 w-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Message */}
                    <p className="text-base text-gray-600 mb-6">{message}</p>

                    {/* Button */}
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:w-auto sm:px-8 transform transition-all hover:-translate-y-0.5"
                        onClick={onClose}
                    >
                        เข้าใจแล้ว
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;