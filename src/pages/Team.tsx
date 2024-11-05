import React from "react";
import { Card } from "@/components/ui/card";

const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Lead Researcher",
      expertise: "Aquatic Ecology",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "Drone Specialist",
      expertise: "Robotics & AI",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Environmental Scientist",
      expertise: "Water Quality",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Our Team</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="p-6">
            <div className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-primary">{member.role}</p>
              <p className="text-sm text-gray-500 mt-1">{member.expertise}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-xl font-semibold mb-4">About Our Team</h2>
        <p className="text-gray-600">
          Our diverse team of experts combines academic excellence with practical experience in environmental management, 
          drone technology, and water resource conservation. Together, we work towards developing innovative solutions 
          for water hyacinth control and management.
        </p>
      </Card>
    </div>
  );
};

export default Team;