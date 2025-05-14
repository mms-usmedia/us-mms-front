// /src/components/campaigns/CampaignDocuments.tsx
import React, { useState } from "react";
import { Document } from "./types";
import { formatDate, formatFileSize, getFileIcon } from "./utils";
import DocumentDeleteModal from "./DocumentDeleteModal";

interface CampaignDocumentsProps {
  documents: Document[];
  onUpload: (files: FileList) => void;
  onDelete: (documentId: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const CampaignDocuments: React.FC<CampaignDocumentsProps> = ({
  documents,
  onUpload,
  onDelete,
  isUploading,
  uploadProgress,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const handleDeleteDocument = (documentId: string) => {
    setDocumentToDelete(documentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      onDelete(documentToDelete);
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  const cancelDeleteDocument = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-b-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-blue-900 flex items-center">
          <svg
            className="h-5 w-5 mr-2 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          Documents
        </h2>
        <button
          onClick={() => document.getElementById("document-upload")?.click()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md shadow-sm text-sm font-medium transition-colors flex items-center gap-2"
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Upload Document
            </>
          )}
        </button>
        <input
          id="document-upload"
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUpload(e.target.files);
              // Resetear el input para permitir seleccionar el mismo archivo nuevamente
              e.target.value = "";
            }
          }}
          multiple
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-blue-700">
              Uploading documents...
            </span>
            <span className="text-sm font-medium text-blue-700">
              {Math.round(uploadProgress)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-b from-blue-50 to-white">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-blue-700">
                {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
                uploaded
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    document.getElementById("document-upload")?.click()
                  }
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Add More
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-blue-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center">
                  {getFileIcon(doc.type)}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {doc.name}
                    </p>
                    <div className="flex text-xs text-gray-500 mt-1">
                      <span className="text-blue-700 font-medium">
                        {formatFileSize(doc.size)}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        Uploaded{" "}
                        <time className="text-gray-700">
                          {formatDate(doc.uploadDate)}
                        </time>{" "}
                        by <span className="font-medium">{doc.uploadedBy}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1.5 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                    title="Download"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-1.5 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                    title="Delete"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-b from-blue-50 to-white">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
            <p className="text-sm font-medium text-blue-700">
              No documents available
            </p>
          </div>
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              No documents have been uploaded for this campaign
            </p>
            <button
              className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
              onClick={() =>
                document.getElementById("document-upload")?.click()
              }
            >
              Upload First Document
            </button>
          </div>
        </div>
      )}

      <DocumentDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteDocument}
        onCancel={cancelDeleteDocument}
      />
    </div>
  );
};

export default CampaignDocuments;
