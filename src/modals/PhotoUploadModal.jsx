import React, { useState, useRef, useEffect } from 'react';
import { X, Pencil, Upload } from 'lucide-react';

const PhotoUploadModal = ({
  show,
  onClose,
  onUpload,
  isUploading,
  defaultPhotos = []
}) => {
  const [photos, setPhotos] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (defaultPhotos.length > 0) {
      setPhotos(defaultPhotos);
    }
  }, [defaultPhotos]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const photoData = files.map(file => ({ file, caption: "" }));
    setPhotos(prev => [...prev, ...photoData]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    const photoData = files.map(file => ({ file, caption: "" }));
    setPhotos(prev => [...prev, ...photoData]);
  };

  const updateCaption = (index, newCaption) => {
    setPhotos(prev => {
      const updated = [...prev];
      updated[index].caption = newCaption;
      return updated;
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    onUpload(photos);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative">

        {/* Dropzone or Upload Preview */}
        {photos.length === 0 ? (
          <div
            onClick={() => inputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-gray-400 hover:border-blue-500 transition text-center py-16 px-6 bg-gray-50"
          >
            <div className="flex flex-col items-center justify-center text-gray-600">
              <Upload className="w-10 h-10 mb-2" />
              <p className="text-lg font-medium mb-2">Drag & Drop File here</p>
              <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
                Browse Files
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          photos.map((photo, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={URL.createObjectURL(photo.file)}
                alt={`preview-${index}`}
                className="w-full h-64 object-cover rounded-lg"
              />

              <button className="absolute top-2 left-2 bg-black bg-opacity-40 text-white text-sm px-2 py-1 rounded-md flex items-center gap-1">
                <Pencil size={14} />
                Edit
              </button>

              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-70"
              >
                <X size={18} />
              </button>

              <input
                type="text"
                placeholder="Add a caption..."
                value={photo.caption}
                onChange={(e) => updateCaption(index, e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          ))
        )}

        {/* Add more button if files already exist */}
        {photos.length > 0 && (
          <div className="mb-6">
            <label
              htmlFor="file-upload-more"
              className="inline-block text-sm text-blue-600 hover:underline cursor-pointer"
            >
              + Add More Photos
            </label>
            <input
              id="file-upload-more"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || photos.length === 0}
            className={`px-4 py-2 rounded-lg text-white ${isUploading || photos.length === 0 ? 'bg-gray-400' : 'bg-black hover:bg-gray-900'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
