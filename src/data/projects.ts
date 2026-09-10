export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
  keyFeatures?: string[];
}

export const projectsData: Project[] = [
  {
    id: "tradeflow",
    title: "TradeFlow — Distribution ERP / DMS",
    description:
      "A robust, multi-tenant distribution management system tailored for businesses to streamline their supply chain and operations. Features include inventory tracking, route planning, and ledger management.",
    image: "/images/projects/tradeflow.jpg", // Placeholder path
    technologies: ["Node.js", "Express.js", "MongoDB", "React", "REST APIs"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
    keyFeatures: [
      "Inventory management",
      "Sales management",
      "Purchases",
      "Customers",
      "Suppliers",
      "Ledgers",
      "Routes",
      "Salesmen",
      "Business management",
      "Reporting",
    ],
  },
  {
    id: "house-price-prediction",
    title: "Zameen Lahore House Price Prediction",
    description:
      "A machine learning project that predicts house prices in Lahore. Multiple regression and tree-based models were evaluated to find the most accurate predictions.",
    image: "/images/projects/house-price.jpg",
    technologies: ["Python", "Pandas", "Scikit-learn", "XGBoost", "CatBoost"],
    githubUrl: "#",
  },
  {
    id: "cybersecurity-lab",
    title: "Cybersecurity Learning & Attack Simulation Lab",
    description:
      "An educational cybersecurity simulation platform designed to help students learn about various attacks and cryptographic concepts in a safe environment.",
    image: "/images/projects/cybersecurity.jpg",
    technologies: ["React", "Vite", "FastAPI", "Python"],
    githubUrl: "#",
    keyFeatures: [
      "Caesar Cipher",
      "Diffie-Hellman",
      "Hashing",
      "Authentication",
      "Dictionary attack simulation",
      "Brute-force simulation",
      "Phishing concepts",
      "MITM concepts",
    ],
  },
  {
    id: "milk-shop",
    title: "Milk Shop Management System",
    description:
      "A specialized business management application designed for a milk shop to handle daily operations, accounts, and inventory seamlessly.",
    image: "/images/projects/milkshop.jpg",
    technologies: ["React", "Node.js", "Express.js", "MySQL"], // Assuming stack
    githubUrl: "#",
    keyFeatures: ["Customers", "Sales", "Products", "Accounts", "Reporting"],
  },
  {
    id: "pos-inventory",
    title: "POS / Inventory Management System",
    description:
      "A comprehensive point-of-sale and inventory management project that tracks stock levels, sales, and generates detailed reports.",
    image: "/images/projects/pos.jpg",
    technologies: ["React", "Tailwind CSS", "Node.js", "MongoDB"], // Assuming stack
    githubUrl: "#",
    keyFeatures: ["Products", "Stock", "Sales", "Customers", "Reports"],
  },
];
