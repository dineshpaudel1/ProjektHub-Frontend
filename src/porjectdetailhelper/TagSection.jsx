import React from 'react';
import { X } from 'lucide-react';
import axios from '../utils/axiosInstance';

const TagSection = ({
  project,
  setProject,
  newTag,
  setNewTag,
  handleAddTag,
  isTagSubmitting,
  setNotification
}) => {
  const token = localStorage.getItem('token');

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(`http://localhost:8080/api/seller/project/${project.id}/tag`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { tagId }
      });

      const updatedTags = project.tags.filter(tag => tag.id !== tagId);
      setProject(prev => ({ ...prev, tags: updatedTags }));

      setNotification({ type: 'success', message: 'Tag deleted successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Failed to delete tag:', error);
      setNotification({ type: 'error', message: 'Failed to delete tag.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-1">Tags</h4>
      <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-md p-2 min-h-[48px]">
        {project.tags?.map(tag => (
          <span
            key={tag.id}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 border border-gray-300 rounded-full"
          >
            {tag.tag}
            <X
              className="w-3 h-3 cursor-pointer text-gray-500 hover:text-red-600"
              onClick={() => handleDeleteTag(tag.id)}
            />
          </span>
        ))}

        <input
          type="text"
          placeholder="Type and click Add"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="px-2 py-1 text-sm border-none focus:outline-none flex-grow min-w-[100px]"
        />
        <button
          onClick={handleAddTag}
          disabled={isTagSubmitting}
          className={`px-3 py-1 text-sm rounded-md text-white ${isTagSubmitting ? 'bg-gray-400' : 'bg-black hover:bg-gray-900'}`}
        >
          {isTagSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default TagSection;
