import React, { useState } from "react";

interface RequestMoreInfoModalProps {
  isOpen: boolean;
  onConfirm: (comments: string) => void;
  onCancel: () => void;
}

const RequestMoreInfoModal: React.FC<RequestMoreInfoModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [comments, setComments] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(comments);
    setComments(""); // Reset the comments after submission
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="fixed inset-0 bg-black opacity-50 transition-opacity"></div>
      <div
        className="relative bg-white rounded-xl shadow-md max-w-md w-full p-0 z-50 transform transition-all border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-50 border-b border-orange-100 px-4 py-3 rounded-t-xl">
          <h3 className="text-base font-medium text-orange-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Request Additional Information
          </h3>
        </div>

        <div className="p-5">
          <p className="mb-4 text-sm text-gray-600">
            Please specify what additional information is needed. This will not
            change the status of the HUR request.
          </p>
          <div className="mb-4">
            <textarea
              className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
              rows={4}
              placeholder="Enter your comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!comments.trim()}
              className={`px-3 py-1.5 rounded-lg focus:outline-none transition-colors text-sm ${
                comments.trim()
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "bg-orange-300 text-white cursor-not-allowed"
              }`}
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMoreInfoModal;
