
import React from 'react';

const ThumbnailUpload = ({ project, thumbnailFile, setThumbnailFile, handleThumbnailUpdate, isUploading }) => (
  <div className="p-6 flex flex-col md:flex-row gap-6">
    {project.thumbnail && (
      <div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={`http://localhost:8080/api/media/photo?file=${project.thumbnail}`}
          alt="Thumbnail"
          className="w-full h-full object-cover"
        />
        <p className="mt-2 text-xs text-gray-500 text-center">Current thumbnail</p>
      </div>
    )}
    <div className="flex-grow">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input type="file" id="thumbnail" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="hidden" />
        <label htmlFor="thumbnail" className="cursor-pointer block">
          <p className="text-sm text-gray-600">{thumbnailFile?.name || 'Click to upload'}</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
        </label>
      </div>
      <button
        onClick={handleThumbnailUpdate}
        disabled={!thumbnailFile || isUploading}
        className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium ${!thumbnailFile || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'}`}
      >
        {isUploading ? 'Uploading...' : 'Update Thumbnail'}
      </button>
    </div>
  </div>
);

export default ThumbnailUpload;
