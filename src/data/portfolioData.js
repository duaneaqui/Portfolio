export const MAP_WIDTH = 4200;
export const MAP_HEIGHT = 1900;

export const nodes = [
  {
    id: "intro",
    accent: "cyan",
    label: "Start",
    type: "profile",
    eyebrow: "Personal Record",
    title: "Gerard Aqui",
    x: 420,
    y: 410,
    zoom: 0.7,
    copy: "Software Engineer & Automation Specialist | Aspiring Cybersecurity Specialist",
    details: ["Quezon City", "BS Information Technology", "Automation", "Cybersecurity"],
    profile: {
      fullName: "Gerard Duane Del Rosario Aqui",
      location: "Quezon City, NCR, Philippines",
      education: "Bachelor of Science in Information Technology",
      experience: "1 Year in IT / Tech | 2 Years in Customer Service & Operations",
      role: "Software Engineer & Automation Specialist",
      aspiration: "Aspiring Cybersecurity Specialist",
      stats: [
        ["Automation", "92%"],
        ["Quality", "88%"],
        ["Security", "74%"],
        ["Operations", "86%"],
      ],
      bio: [
        "I am a dedicated software engineer with a strong foundation in Information Technology and a passion for building robust, innovative, and secure frameworks as an aspiring cybersecurity specialist. My core expertise currently lies at the intersection of automation and quality assurance, where I focus on ensuring that software does not just function, but excels under pressure.",
        "Driven by a deep curiosity for how systems work, and ultimately, how to defend them against evolving threats, I leverage cutting-edge tools ranging from Selenium to AI-powered testing frameworks to deliver precise, enterprise-grade automation solutions. I thrive on technical challenges, love tinkering with emerging technologies, and am highly motivated to collaborate with and learn from senior peers to continuously elevate my craft as I transition into the cybersecurity space.",
      ],
    },
    entries: [
      {
        name: "Identity",
        description: "Software engineer focused on automation, QA, and secure systems.",
        meta: ["Portfolio", "Profile"],
      },
    ],
  },
  {
    id: "about",
    accent: "green",
    label: "Arsenal",
    type: "arsenal",
    eyebrow: "Capability Matrix",
    title: "Tech Arsenal",
    x: 1060,
    y: 720,
    zoom: 0.82,
    focusX: 0.5,
    focusY: 0.5,
    copy: "A technical command center for languages, frameworks, AI tooling, automation, and deployment systems.",
    details: ["Programming", "AI Engineering", "Backend", "Automation", "DevOps"],
    entries: [
      {
        name: "Technical Stack",
        description: "AI engineering, backend systems, frontend development, automation, and deployment tools.",
        meta: ["AI", "Backend", "Frontend"],
      },
      {
        name: "Build Focus",
        description: "Practical software, testing workflows, data-driven interfaces, and secure system design.",
        meta: ["Automation", "QA", "Security"],
      },
    ],
  },
  {
    id: "skills",
    accent: "blue",
    label: "Work",
    type: "experience",
    eyebrow: "Career Timeline",
    title: "Work Experience",
    x: 1740,
    y: 420,
    zoom: 0.78,
    focusX: 0.5,
    focusY: 0.5,
    copy: "A timeline of technical, operations, audit, and customer-facing experience.",
    details: ["Full Stack Developer", "Auditor", "Store Assistant"],
    experiences: [
      {
        role: "Full Stack Developer",
        company: "Arxon Solutions LLC",
        location: "High Street South Corporate Plaza Tower 2, 26th St. Taguig, BGC, Metro Manila 1634 PH",
        period: "August 11, 2025 - Present",
        status: "Current",
        summary: "Delivered scalable Next.js applications, testing workflows, and backend integrations for distributed teams.",
        stack: ["Next.js", "TypeScript", "TailwindCSS", "Material UI", "Turbo Repo"],
        backend: ["C#", ".NET", ".NET SDK", "ASP.NET Core", "Web API", "Kestrel"],
        tools: ["Git", "GitHub", "Jest", "Postman", "Linear", "Padlet"],
      },
      {
        role: "Store Assistant",
        company: "MSV Group of Companies Inc.",
        location: "942 Aurora Blvd, Project 4, Quezon City, 1109",
        period: "November 26, 2022 - February 05, 2025",
        status: "Operations",
        summary: "Provided excellent customer service, processed sales transactions, and ensured the overall maintenance of the store. Played a crucial role in creating a positive and welcoming shopping experience for customers.",
        stack: ["Customer Service", "Sales Transactions", "Store Operations"],
        tools: ["POS Handling", "Inventory Support", "Customer Relations"],
      },
      {
        role: "Auditor",
        company: "High Street Auto Detailing & Car Wash",
        location: "87 K-9 East Kamias, Quezon City, 1102",
        period: "January 16, 2020 - January 28, 2025",
        status: "Audit",
        summary: "Conducted periodic sales audits for a family-owned car wash and auto detailing business.",
        stack: ["Sales Audit", "Records Review", "Operations Check"],
        tools: ["Transaction Logs", "Reports", "Reconciliation"],
      },
    ],
    entries: [
      {
        name: "Career Records",
        description: "Software development, operations, audit, and customer service experience.",
        meta: ["Development", "Operations", "Audit"],
      },
    ],
  },
  {
    id: "projects",
    accent: "gold",
    label: "Projects",
    type: "projects",
    eyebrow: "Selected Work",
    title: "Featured Projects",
    x: 2390,
    y: 810,
    zoom: 0.84,
    copy: "A curated command deck of featured builds, selected from a wider project archive.",
    details: ["Live Systems", "Mobile Apps", "Full-Stack", "Queued Builds"],
    entries: [
      {
        name: "Sentiment Analysis of Social Media Data",
        description: "SentimentScope lets users analyze public opinion by entering keywords/hashtags or uploading a CSV of social posts.",
        meta: ["Next.js", "React", "TypeScript", "FastAPI", "Python", "Machine Learning", "NLP", "SQL", "Docker"],
        detail: "Text is processed through a modular NLP pipeline using HuggingFace DistilBERT with VADER fallback, and results appear in a responsive dashboard with charts, confidence scores, and a filterable post feed. The project uses a clean API-driven architecture with separate frontend and backend services, built for portfolio demonstration and easy extension to live social APIs.",
        image: "/assets/sentimentscope-screenshot.png",
        logoType: "sentimentscope",
        link: "https://soc-med-sentiment-analyzer.vercel.app/",
      },
      {
        name: "Broiyalty",
        description: "A Flutter mobile application for poultry health monitoring through image-based disease detection.",
        meta: ["Flutter", "Dart", "Material Design 3", "auto_route", "Camera API", "Local Storage", "Android", "Mobile App", "Roboflow"],
        detail: "Broyalty lets users capture photos of chicken feces, run them through an AI-powered analysis pipeline, and receive diagnostic insights with educational content about common poultry diseases. The app is designed with a farmer-friendly interface and evaluated against ISO 25010 software quality standards.",
        image: "/assets/broiyalty-screenshot.png",
        logo: "/assets/broiyalty-logo.png",
        logoType: "broiyalty",
        github: "https://github.com/duaneaqui/broyalty_app",
        documentation: "https://docs.google.com/document/d/1x4NveTTa53wjaipqKCZWh_2ZOOLTanc_/edit?usp=sharing&ouid=101073222354656309621&rtpof=true&sd=true",
      },
      {
        name: "Adoptmeh",
        description: "A non-profit pet adoption and rescue web platform built by Team Cascaders at T.I.P. Quezon City.",
        meta: ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap", "jQuery", "CRUD", "Full-Stack"],
        detail: "Adoptmeh promotes animal welfare by letting visitors browse adoptable pets, learn about the adoption process, submit adoption applications, and support the shelter through donations. An admin dashboard enables staff to add, edit, and delete dog and cat listings with image uploads stored in a MySQL database.",
        image: "/assets/adoptmeh-screenshot.png",
        logo: "/assets/adoptmeh-logo.png",
        logoType: "adoptmeh",
        github: "https://github.com/duaneaqui/adoptmeh",
      },
      {
        name: "ParkFinder",
        description: "A Flutter mobile app for browsing and searching nearby parking locations.",
        meta: ["Flutter", "Dart", "Material Design", "SharedPreferences", "Cross-Platform", "Mobile Development"],
        detail: "Park Finder lets users browse and search parking locations near them. Each listing shows real-time-style availability such as available, unavailable, or motorcycle-only, along with location details and parking fees in Philippine pesos. The app includes user registration and login with locally persisted credentials, plus a map-based discovery screen for exploring nearby places.",
        image: "/assets/parkfinder-screenshot.png",
        logo: "/assets/parkfinder-logo.png",
        logoType: "parkfinder",
        github: "https://github.com/duaneaqui/Barkfinder",
      },
      {
        name: "Budget Tracker (AI Insights)",
        description: "BudgetAI PH is a personal finance tracker built for Filipino users with dashboards, reports, and rule-based budget insights.",
        meta: ["React", "TypeScript", "Vite", "Tailwind CSS", "FastAPI", "SQLite", "SQLAlchemy", "JWT", "OCR"],
        detail: "BudgetAI PH lets users manually track income, expenses, recurring bills, loans, savings goals, and local prices. It includes a dashboard with charts, monthly reports, rule-based AI budget insights, and an OCR-style loan screenshot scanner where users review extracted loan details before saving. It does not use paid bank APIs, GCash/Maya/BPI auto-sync, or unsafe credential scraping, and is designed as a portfolio-ready budgeting app with demo login access for employers.",
        image: "/assets/budget-screenshot.png",
        logo: "/assets/budget-logo.png",
        logoType: "budget",
        link: "https://budgettrackerwithai.vercel.app/",
      },
      {
        name: "Automation Lab",
        description: "Upcoming automation and QA build for test flows, quality dashboards, and deployment checks.",
        meta: ["Automation", "Testing", "Workflow", "Coming Soon"],
        detail: "Upcoming automation lab that can showcase Selenium flows, testing dashboards, AI-assisted QA, and deployment checks.",
        status: "Coming Soon",
        isPlaceholder: true,
        logoType: "placeholder",
      },
    ],
  },
  {
    id: "certificates",
    accent: "violet",
    label: "Certs",
    type: "certificates",
    eyebrow: "Credentials & Learning",
    title: "Certificates",
    x: 3110,
    y: 530,
    zoom: 0.88,
    focusX: 0.5,
    focusY: 0.5,
    copy: "Certificates, webinars, seminars, and continuing learning records across cybersecurity, computing, AI, and digital ethics.",
    details: ["Cybersecurity", "Computing", "AI", "Ethics"],
    certificates: [
      {
        title: "Google Cybersecurity Certificate",
        type: "Certificate",
        venue: "Webinar",
        date: "On-Going",
        status: "In Progress",
        featured: true,
      },
      {
        title: "Legal Consequences in Copyright Infringement",
        type: "Webinar",
        venue: "Webinar",
        date: "May 07, 2024",
      },
      {
        title: "Cyber Ethics",
        type: "Webinar",
        venue: "Webinar",
        date: "April 26, 2024",
      },
      {
        title: "Current Trends and Issues in Computing",
        type: "Seminar",
        venue: "SBMA, Subic Bay Freeport Zone",
        date: "April 23, 2024",
      },
      {
        title: "Cybersecurity and Ethical Use of Connectivity",
        type: "Webinar",
        venue: "Webinar",
        date: "April 04, 2024",
        description: "Exploration of cybersecurity measures and ethical imperatives in connectivity to safeguard data integrity, privacy, and digital citizenship.",
      },
      {
        title: "Virtual Assistant Training",
        type: "Webinar",
        venue: "Webinar",
        date: "March 22, 2024",
      },
      {
        title: "Artificial Intelligence in Business",
        type: "Webinar",
        venue: "Webinar",
        date: "March 22, 2022",
      },
    ],
    entries: [
      {
        name: "Learning Records",
        description: "Cybersecurity, computing, AI, ethics, and professional development records.",
        meta: ["Certificates", "Webinars", "Seminars"],
      },
    ],
  },
  {
    id: "contact",
    accent: "pink",
    label: "Contact",
    type: "contact",
    eyebrow: "Final Uplink Portal",
    title: "Get In Touch",
    x: 3740,
    y: 880,
    zoom: 0.78,
    focusX: 0.5,
    focusY: 0.5,
    copy: "Transmit a message, copy my contact channels, or open my resume from the final uplink node.",
    details: ["Email", "Phone", "LinkedIn", "Resume"],
    contact: {
      email: "DuaneAqui2001@gmail.com",
      phone: "0966-465-6164",
      linkedin: "https://www.linkedin.com/in/gerard-duane-aqui-201746245",
      location: "East Kamias, Quezon City, Metro Manila, PH",
      discord: "duane8974",
      resume: "https://docs.google.com/document/d/1tSr1M0NIEkGbwudpE1q0GPPeZv_Ir00gNfvUm0ugisU/edit?usp=sharing",
    },
    entries: [
      {
        name: "Email",
        description: "DuaneAqui2001@gmail.com",
        meta: ["Primary"],
      },
      {
        name: "Links",
        description: "LinkedIn, Discord, phone, location, and resume.",
        meta: ["LinkedIn", "Resume", "Discord"],
      },
    ],
  },
];

export const supportingStars = [
  [180, 190, 1.5], [270, 840, 1], [650, 150, 1.2], [770, 950, 1.1],
  [1210, 250, 0.9], [1350, 590, 1.4], [1510, 1020, 1], [1930, 780, 1],
  [2130, 260, 1.2], [2260, 1060, 0.8], [2670, 360, 1], [2840, 980, 1.4],
  [3280, 760, 1], [3440, 220, 0.9], [3640, 480, 1.3], [3950, 260, 0.9],
];

export const programmingLanguages = [
  ["Python", 8],
  ["TypeScript", 6],
  ["Java", 6],
  ["C#", 5],
  ["C", 7],
  ["C++", 7],
];

export const arsenalCategories = [
  {
    title: "AI Engineering",
    accent: "cyan",
    items: [
      "Prompt Engineering",
      "AI Testing",
      "Multi-Agent Systems",
      "LangGraph",
      "LlamaIndex",
      "CrewAI",
      "Hugging Face Transformers",
      "OpenAI API",
      "Anthropic API",
      "Gemini API",
      "TensorFlow",
      "PyTorch",
    ],
  },
  {
    title: "Backend Development",
    accent: "green",
    items: ["Python", "Django", "FastAPI", "REST APIs", "Microservices", "SQLAlchemy", "OAuth Authentication"],
  },
  {
    title: "Frontend Development",
    accent: "violet",
    items: ["HTML", "TypeScript", "Tailwind CSS", "Flutter"],
  },
  {
    title: "Databases",
    accent: "gold",
    items: ["PostgreSQL", "ChromaDB"],
  },
  {
    title: "Data Science & Analytics",
    accent: "pink",
    items: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
  },
  {
    title: "Automation & Testing",
    accent: "cyan",
    items: ["Selenium", "Postman"],
  },
  {
    title: "DevOps & Deployment",
    accent: "green",
    items: ["Docker", "Jenkins", "Railway", "Vercel"],
  },
  {
    title: "Version Control",
    accent: "violet",
    items: ["Git", "GitHub"],
  },
];

export const galaxyStars = Array.from({ length: 96 }, (_, index) => {
  const x = 80 + ((index * 347) % 4040);
  const y = 70 + ((index * 191) % 1060);
  const size = 0.55 + ((index * 17) % 34) / 20;
  const palette = ["cyan", "pink", "green", "white", "violet", "gold"];
  return [x, y, size, palette[index % palette.length]];
});

export const ambientDataNodes = Array.from({ length: 28 }, (_, index) => {
  const x = 160 + ((index * 463) % 3880);
  const y = 95 + ((index * 277) % 1710);
  const width = 92 + ((index * 37) % 130);
  const tone = ["cyan", "dim", "green", "violet"][index % 4];

  return {
    id: `ambient-${index + 1}`,
    x,
    y,
    width,
    tone,
    lines: 3 + (index % 5),
    label: `${(42 + ((index * 19) % 138)).toFixed(2)}`,
  };
});

export const numericLabels = [
  [250, 610, "107.95"], [610, 310, "123.87"], [880, 900, "144.22"],
  [1290, 440, "115.49"], [1640, 670, "160.18"], [2050, 220, "149.74"],
  [2580, 580, "144.09"], [2980, 940, "102.30"], [3420, 350, "145.58"],
  [3820, 720, "151.63"],
];

// Keep project children in the lower constellation pocket so they never overlap main timeline nodes.
export const projectSubnodeOffsets = [
  [-920, 520],
  [-520, 900],
  [-40, 650],
  [430, 980],
  [900, 620],
  [1220, 920],
];
