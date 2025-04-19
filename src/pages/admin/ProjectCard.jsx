import React from 'react';

const ProjectCard = ({ category, title, subtitle, description, image, bg }) => {
    return (
        <div className="bg-white shadow-md overflow-hidden max-w-sm w-full relative">
            {/* Top section */}
            <div className={`${bg} p-4 text-white relative`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold">{category}</h3>
                        <p className="text-sm">{title}</p>
                        <p className="text-xs mt-1">By {subtitle}</p>
                    </div>
                    <div className="text-xl">⋮</div>
                </div>

                {/* Image positioned absolutely */}
                <img
                    src={image}
                    alt={title}
                    className="absolute right-4 top-1/1 transform -translate-y-1/3 w-21 h-auto border rounded-md shadow-md bg-white"
                />
            </div>

            {/* Bottom white content section */}
            <div className="pt-20 px-4 pb-4 text-sm text-gray-700">
                {description}
            </div>
        </div>
    );
};

export default ProjectCard;
