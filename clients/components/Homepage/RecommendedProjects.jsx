import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ image, title }) => (
  <div className="relative group cursor-pointer overflow-hidden rounded-lg">
    <div className="relative aspect-[812/990] w-full overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <h3 className="absolute bottom-8 left-8 text-white text-2xl font-semibold">
        {title}
      </h3>
    </div>
  </div>
);

const RecommendedProjects = () => {
  const projects = [
    {
      title: "Bathroom Remodel",
      image: "src/assets/images/Bathroom remodel.png",
    },
    {
      title: "Kitchen Remodel",
      image: "src/assets/images/Kitchen Remodel.png",
    },
    {
      title: "Interior Design Services",
      image: "src/assets/images/Interior Design Services.png",
    },
  ];

  return (
    <div className="py-16 px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-2">
          Most Recommended Projects
        </h2>
        <p className="text-center text-gray-600 mb-12">
          These standout projects come with the highest recommendations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              image={project.image}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            to="/projects"
            className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition-colors duration-300 text-lg font-medium"
          >
            Explore all projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProjects;
