import React from "react";

interface AdUnitDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AdUnitDeleteModal: React.FC<AdUnitDeleteModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <svg
            className="mx-auto mb-4 w-14 h-14 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mb-5 text-lg font-medium text-gray-900">
            Are you sure you want to delete this ad unit?
          </h3>
          <p className="mb-5 text-sm text-gray-500">
            This action cannot be undone. This will permanently delete the ad
            unit from the campaign.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Yes, delete it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdUnitDeleteModal;
