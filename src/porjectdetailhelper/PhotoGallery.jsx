import React from 'react';
import axios from '../utils/axiosInstance';

const PhotoGallery = ({ project, setShowPhotoModal, setProject, setNotification }) => {
  const handleToggleVisibility = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.patch(
        `http://localhost:8080/api/seller/project/${project.id}/visibility`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update project state locally
      setProject(prev => ({
        ...prev,
        visible: !prev.visible,
      }));

      setNotification({
        type: 'success',
        message: `Project marked as ${!project.visible ? 'Public' : 'Private'}`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Visibility toggle failed:', error);
      setNotification({
        type: 'error',
        message: 'Failed to change project visibility.',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-500">Project Photos</h4>


      </div>

      <div className="flex flex-wrap gap-4 mt-2">
        {project.photos?.map(photo => (
          <div key={photo.id} className="w-32">
            <img
              src={`http://localhost:8080/api/media/photo?file=${photo.path}`}
              alt={photo.caption}
              className="rounded-lg border border-gray-200 object-cover w-full h-24"
            />
            <p className="mt-1 text-xs text-center">{photo.caption}</p>
          </div>
        ))}
        <button
          onClick={() => setShowPhotoModal(true)}
          className="w-32 h-24 bg-gray-200 flex items-center justify-center rounded-lg text-sm text-gray-600"
        >
          + Add Photo with Caption
        </button>
      </div>
    </div>
  );
};

export default PhotoGallery;
