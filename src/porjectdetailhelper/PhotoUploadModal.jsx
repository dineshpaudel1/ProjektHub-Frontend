import React from 'react';

const PhotoUploadModal = ({
  show,
  onClose,
  onUpload,
  isUploading,
  photoFile,
  setPhotoFile,
  photoCaption,
  setPhotoCaption
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 pointer-events-auto">
        <h3 className="text-lg font-semibold mb-4">Upload Photo with Caption</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
          className="mb-3"
        />

        <input
          type="text"
          placeholder="Enter caption"
          value={photoCaption}
          onChange={(e) => setPhotoCaption(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={isUploading}
            className={`px-4 py-2 rounded-lg text-white ${isUploading ? 'bg-gray-400' : 'bg-black hover:bg-gray-900'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
