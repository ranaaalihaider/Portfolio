import { ReactNode } from "react";

export const profileInfo = {
  name: "Ali Haider",
  role: "Software Engineer",
  headline: "Software Engineer building modern web & mobile applications.",
  about:
    "I am a passionate Software Engineer with a strong background in developing robust full-stack web applications, dynamic mobile apps, and scalable REST APIs. With a keen eye for problem-solving, I've worked on business and ERP software, distribution management systems, and have experience integrating AI/ML models into practical projects. I thrive on building efficient, modern, and user-centric solutions.",
  stats: [
    { label: "Software Engineering", value: "Degree" },
    { label: "Full-Stack", value: "Development" },
    { label: "Web & Mobile", value: "Applications" },
    { label: "Multiple", value: "Projects" },
  ],
  socials: [
    {
      label: "GitHub",
      url: "#",
      icon: "Github",
    },
    {
      label: "LinkedIn",
      url: "#",
      icon: "Linkedin",
    },
    {
      label: "Email",
      url: "mailto:contact@example.com",
      icon: "Mail",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "COMSATS University",
      coursework: [
        "Software Engineering",
        "Web Development",
        "Artificial Intelligence",
        "Machine Learning",
        "Database Systems",
        "Information Security",
        "Mobile Application Development",
        "Software Project Management",
      ],
    },
  ],
  skills: [
    {
      category: "Frontend",
      technologies: ["React", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS"],
    },
    {
      category: "Backend",
      technologies: ["Node.js", "Express.js", "Laravel", "REST APIs"],
    },
    {
      category: "Mobile",
      technologies: ["Flutter", "Dart"],
    },
    {
      category: "Databases",
      technologies: ["MongoDB", "MySQL", "Firebase"],
    },
    {
      category: "AI / ML",
      technologies: ["Python", "Pandas", "Scikit-learn", "XGBoost"],
    },
    {
      category: "Tools",
      technologies: ["Git", "GitHub", "VS Code", "Postman"],
    },
    {
      category: "Cloud",
      technologies: ["AWS"],
    },
  ],
};
