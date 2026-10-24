import { ParsedProfile } from '@/types';

export const SEEDED_PROFILES: Record<string, ParsedProfile & { label: string; personaStory: string }> = {
  arjun: {
    label: 'Arjun (3-Yr Backend Java @ TCS)',
    personaStory: '27, 3 yrs backend Java at TCS Bangalore. Resume has 43 skills listed, generic headline, bullets starting with "Responsible for". Gets low-ball calls (₹6-8L) but wants ₹18L product company calls.',
    name: 'Arjun Sharma',
    email: 'arjun.sharma.tech@gmail.com',
    phone: '+91 98450 12345',
    location: 'Bengaluru, Karnataka',
    targetRole: 'Backend Engineer',
    targetRoleId: 'backend-engineer',
    experienceBand: '3-5',
    targetCities: ['Bangalore / Bengaluru', 'Hyderabad', 'Pune'],
    expectedSalaryLakhs: 18,
    headline: 'Software Engineer at Tata Consultancy Services',
    summary: 'Dedicated and hardworking software engineer with 3 years of experience in Java development. Looking for a challenging position in a reputed organization where I can utilize my technical skills to contribute to company growth.',
    skills: [
      'Java', 'Core Java', 'J2EE', 'Spring', 'Spring Boot', 'Hibernate', 'REST APIs', 'SQL', 'MySQL', 
      'Eclipse IDE', 'IntelliJ', 'Git', 'SVN', 'Maven', 'Tomcat', 'JSP', 'Servlets', 'HTML', 'CSS', 
      'JavaScript', 'Bootstrap', 'Windows 10', 'Linux', 'MS Word', 'MS Excel', 'PowerPoint', 'Typing', 
      'Data Structures', 'OOPs', 'JDBC', 'JUnit', 'Postman', 'JSON', 'XML', 'Agile', 'Scrum', 'JIRA', 
      'Team Player', 'Problem Solving', 'Communication Skills', 'Microservices', 'Docker Basics', 'Oracle DB'
    ],
    experiences: [
      {
        id: 'exp-1',
        title: 'System Engineer',
        company: 'Tata Consultancy Services',
        location: 'Bengaluru',
        startDate: 'Aug 2023',
        endDate: 'Present',
        bullets: [
          'Responsible for developing backend REST APIs using Java and Spring Boot for banking client.',
          'Worked on database queries and bug fixes in MySQL.',
          'Handled the maintenance and deployment of microservices on Tomcat servers.',
          'Participated in daily agile scrum meetings and updated tickets in JIRA.'
        ]
      },
      {
        id: 'exp-2',
        title: 'Assistant System Engineer',
        company: 'Tata Consultancy Services',
        location: 'Bengaluru',
        startDate: 'Jul 2021',
        endDate: 'Jul 2023',
        bullets: [
          'Assisted senior developers in writing JUnit test cases and documentation.',
          'Helped with bug fixes in legacy J2EE modules and stored procedures.',
          'Took care of code merges and release activities using Git and SVN.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.Tech in Computer Science and Engineering',
        institution: 'Visvesvaraya Technological University (VTU)',
        year: '2021',
        score: '7.8 CGPA'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Customer Onboarding Microservice',
        description: 'Built customer registration workflow module using Spring Boot and MySQL.',
        technologies: ['Java', 'Spring Boot', 'MySQL']
      }
    ],
    certifications: [
      'Oracle Certified Associate Java Programmer (OCAJP)'
    ],
    achievements: [
      'TCS On-The-Spot Award for defect cleanup in Q3 2024'
    ],
    rawText: `Arjun Sharma
arjun.sharma.tech@gmail.com | +91 98450 12345 | Bengaluru
Software Engineer at Tata Consultancy Services

SUMMARY
Dedicated and hardworking software engineer with 3 years of experience in Java development. Looking for a challenging position in a reputed organization.

EXPERIENCE
System Engineer - Tata Consultancy Services (Aug 2023 - Present)
- Responsible for developing backend REST APIs using Java and Spring Boot for banking client.
- Worked on database queries and bug fixes in MySQL.
- Handled the maintenance and deployment of microservices on Tomcat servers.
- Participated in daily agile scrum meetings and updated tickets in JIRA.

Assistant System Engineer - Tata Consultancy Services (Jul 2021 - Jul 2023)
- Assisted senior developers in writing JUnit test cases and documentation.
- Helped with bug fixes in legacy J2EE modules and stored procedures.

EDUCATION
B.Tech CSE - VTU (2021) - 7.8 CGPA

SKILLS
Java, Core Java, J2EE, Spring, Spring Boot, Hibernate, REST APIs, SQL, MySQL, Eclipse IDE, IntelliJ, Git, SVN, Maven, Tomcat, JSP, Servlets, HTML, CSS, JavaScript, Bootstrap, Windows 10, Linux, MS Word, MS Excel, PowerPoint, Typing, Data Structures, OOPs, JDBC, JUnit, Postman, JSON, XML, Agile, Scrum, JIRA, Team Player, Problem Solving, Communication Skills, Microservices, Docker Basics, Oracle DB`,
    sectionConfidence: {
      headline: 95,
      summary: 90,
      experience: 85,
      skills: 65, // low confidence because 43 scattered skills with clutter
      education: 95,
      projects: 70
    }
  },

  priya: {
    label: 'Priya (Fresher CSE / Tier-2 College)',
    personaStory: '23, final year CSE, tier-2 college. Resume is mostly coursework subjects. Applied to 200 jobs on Naukri, gets 3 auto-rejections. Anxious, doesn’t know what to fix first.',
    name: 'Priya Patel',
    email: 'priya.patel.dev@gmail.com',
    phone: '+91 97234 56789',
    location: 'Ahmedabad / Pune',
    targetRole: 'Full Stack Developer',
    targetRoleId: 'fullstack-developer',
    experienceBand: 'Fresher',
    targetCities: ['Pune', 'Bangalore / Bengaluru', 'Hyderabad'],
    expectedSalaryLakhs: 6.5,
    headline: 'B.Tech CSE Student seeking Entry Level Developer Opportunity',
    summary: 'Fresh graduate with strong academic background in computer science. Passionate about learning new technologies and eager to work in an innovative software company.',
    skills: [
      'C', 'C++', 'Java', 'HTML', 'CSS', 'JavaScript', 'Database Management', 
      'Computer Networks', 'Operating Systems', 'Software Engineering', 'React Basics', 
      'Node.js', 'Express', 'MongoDB', 'MS Office', 'Communication', 'Quick Learner'
    ],
    experiences: [
      {
        id: 'exp-1',
        title: 'Web Development Intern',
        company: 'Local IT Solutions',
        location: 'Ahmedabad',
        startDate: 'Jan 2024',
        endDate: 'Apr 2024',
        bullets: [
          'Worked on creating web pages using HTML, CSS and JavaScript.',
          'Assisted team in connecting frontend with Node.js APIs.',
          'Learned React.js and created sample dashboard components.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'Gujarat Technological University (GTU)',
        year: '2024',
        score: '8.4 CGPA'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'College Library Management Portal',
        description: 'Web app with student login, book search and issue tracking.',
        technologies: ['React', 'Node.js', 'MongoDB']
      },
      {
        id: 'proj-2',
        title: 'E-Commerce Cart Demo',
        description: 'Simple responsive shopping cart using React and Context API.',
        technologies: ['React', 'JavaScript', 'CSS']
      }
    ],
    certifications: [
      'Udemy - Complete Web Development Bootcamp'
    ],
    achievements: [
      'Ranked 3rd in College Coding Hackathon 2023'
    ],
    rawText: `Priya Patel
priya.patel.dev@gmail.com | +91 97234 56789
B.Tech CSE Student seeking Entry Level Developer Opportunity

OBJECTIVE
Fresh graduate with strong academic background in computer science. Passionate about learning new technologies.

EDUCATION
B.Tech CSE - GTU (2024) - 8.4 CGPA

INTERNSHIP
Web Development Intern - Local IT Solutions (Jan 2024 - Apr 2024)
- Worked on creating web pages using HTML, CSS and JavaScript.
- Assisted team in connecting frontend with Node.js APIs.
- Learned React.js and created sample dashboard components.

PROJECTS
1. College Library Management Portal (React, Node.js, MongoDB)
2. E-Commerce Cart Demo (React, JavaScript)

SKILLS
C, C++, Java, HTML, CSS, JavaScript, Database Management, Computer Networks, Operating Systems, Software Engineering, React Basics, Node.js, Express, MongoDB, MS Office`,
    sectionConfidence: {
      headline: 80,
      summary: 85,
      experience: 70,
      skills: 60,
      education: 95,
      projects: 75
    }
  },

  sneha: {
    label: 'Sneha (6-Yr Digital Marketing Lead)',
    personaStory: '29, 6 years performance marketing in agency/startup, Mumbai. Strong track record but vague bullets without explicit ROAS or CAC numbers. Under-indexed for high-paying product company search keywords.',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni.growth@gmail.com',
    phone: '+91 98201 98765',
    location: 'Mumbai, Maharashtra',
    targetRole: 'Digital Marketing Specialist',
    targetRoleId: 'digital-marketing',
    experienceBand: '5-8',
    targetCities: ['Mumbai / Navi Mumbai', 'Delhi NCR (Gurgaon / Noida)', 'Bangalore / Bengaluru'],
    expectedSalaryLakhs: 22,
    headline: 'Digital Marketing Lead | Performance & Growth Marketing',
    summary: 'Experienced marketing professional with 6 years leading paid media campaigns, SEO strategies and social media marketing across B2C and D2C brands.',
    skills: [
      'Digital Marketing', 'Social Media Marketing', 'Facebook Ads', 'Google Ads', 
      'SEO', 'Content Marketing', 'Google Analytics', 'Canva', 'Email Marketing', 
      'Brand Management', 'Influencer Marketing', 'Copywriting', 'Campaign Strategy'
    ],
    experiences: [
      {
        id: 'exp-1',
        title: 'Senior Performance Marketing Manager',
        company: 'GrowthWave Media Agency',
        location: 'Mumbai',
        startDate: 'Mar 2022',
        endDate: 'Present',
        bullets: [
          'Handled paid advertising campaigns on Google Ads and Meta for multiple e-commerce clients.',
          'Responsible for improving website traffic through organic SEO and blog articles.',
          'Managed monthly advertising budget across various search and display networks.',
          'Prepared weekly analytics reports for clients using Google Analytics.'
        ]
      },
      {
        id: 'exp-2',
        title: 'Digital Marketing Specialist',
        company: 'Pulse Digital',
        location: 'Mumbai',
        startDate: 'Jun 2019',
        endDate: 'Feb 2022',
        bullets: [
          'Created social media posts and coordinated with design team.',
          'Assisted in setting up email newsletters and lead capture landing pages.',
          'Conducted keyword research and competitor analysis for clients.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'MBA in Marketing',
        institution: 'Welingkar Institute of Management, Mumbai',
        year: '2019',
        score: 'Grade A'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Diwali E-commerce Acquisition Campaign',
        description: 'Multi-channel ad campaign across Meta and Google for consumer electronics brand.',
        technologies: ['Meta Ads', 'Google Ads', 'GA4']
      }
    ],
    certifications: [
      'Google Ads Search Certification',
      'Meta Certified Media Buying Professional'
    ],
    achievements: [
      'Managed ₹40 Lakhs monthly ad budgets across 8 active consumer brand accounts'
    ],
    rawText: `Sneha Kulkarni
sneha.kulkarni.growth@gmail.com | +91 98201 98765 | Mumbai
Digital Marketing Lead | Performance & Growth Marketing

SUMMARY
Experienced marketing professional with 6 years leading paid media campaigns, SEO strategies and social media marketing across B2C and D2C brands.

EXPERIENCE
Senior Performance Marketing Manager - GrowthWave Media Agency (Mar 2022 - Present)
- Handled paid advertising campaigns on Google Ads and Meta for multiple e-commerce clients.
- Responsible for improving website traffic through organic SEO and blog articles.
- Managed monthly advertising budget across various search and display networks.
- Prepared weekly analytics reports for clients using Google Analytics.

Digital Marketing Specialist - Pulse Digital (Jun 2019 - Feb 2022)
- Created social media posts and coordinated with design team.
- Assisted in setting up email newsletters and lead capture landing pages.
- Conducted keyword research and competitor analysis for clients.

EDUCATION
MBA in Marketing - Welingkar Institute of Management (2019)

SKILLS
Digital Marketing, Social Media Marketing, Facebook Ads, Google Ads, SEO, Content Marketing, Google Analytics, Canva, Email Marketing, Brand Management, Influencer Marketing, Copywriting, Campaign Strategy`,
    sectionConfidence: {
      headline: 90,
      summary: 90,
      experience: 85,
      skills: 80,
      education: 95,
      projects: 80
    }
  }
};
