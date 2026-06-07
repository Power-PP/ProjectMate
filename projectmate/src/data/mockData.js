export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'D' },
  { id: 'projects', label: 'Projects', icon: 'P' },
  { id: 'developers', label: 'Developers', icon: 'U' },
  { id: 'my-projects', label: 'My Projects', icon: 'M' },
  { id: 'notifications', label: 'Notifications', icon: 'N' },
  { id: 'settings', label: 'Settings', icon: 'S' },
];

export const projects = [
  {
    id: 1,
    title: 'AI Code Review Buddy',
    owner: 'Aarav S.',
    status: 'Open',
    match: 94,
    openings: 3,
    remote: true,
    roles: ['Backend', 'Frontend'],
    stack: ['React', 'Spring Boot', 'MongoDB'],
    description:
      'Review pull requests, summarize risk, and generate contributor-friendly checklists before merge.',
  },
  {
    id: 2,
    title: 'Campus Event Exchange',
    owner: 'Meera K.',
    status: 'Hiring',
    match: 88,
    openings: 2,
    remote: false,
    roles: ['Designer', 'QA'],
    stack: ['Java', 'REST APIs', 'Docker'],
    description:
      'Verified event board for student clubs to publish opportunities and form hackathon teams.',
  },
  {
    id: 3,
    title: 'Open Source Issue Scout',
    owner: 'Nikhil R.',
    status: 'Open',
    match: 91,
    openings: 1,
    remote: true,
    roles: ['Full Stack'],
    stack: ['GitHub API', 'JWT', 'WebSocket'],
    description:
      'Discover beginner-friendly issues, assign mentors, and track contribution progress.',
  },
  {
    id: 4,
    title: 'Portfolio Sprint Planner',
    owner: 'Sara K.',
    status: 'In progress',
    match: 81,
    openings: 2,
    remote: true,
    roles: ['Frontend', 'Product'],
    stack: ['React', 'MongoDB', 'Analytics'],
    description:
      'Plan resume-ready projects with scoped milestones, peer accountability, and proof-of-work tracking.',
  },
];

export const developers = [
  {
    name: 'Priya Nair',
    role: 'React Developer',
    location: 'Pune',
    availability: '8 hrs/week',
    skills: ['React', 'Testing', 'Design Systems'],
  },
  {
    name: 'Kabir Shah',
    role: 'Java Backend',
    location: 'Bengaluru',
    availability: '12 hrs/week',
    skills: ['Spring Security', 'MongoDB', 'Docker'],
  },
  {
    name: 'Sara Khan',
    role: 'Product Builder',
    location: 'Remote',
    availability: 'Weekends',
    skills: ['APIs', 'UX', 'Launch Planning'],
  },
];

export const notifications = [
  'Kabir applied to AI Code Review Buddy.',
  'Meera accepted your invite for Campus Event Exchange.',
  'Open Source Issue Scout added a WebSocket role.',
];
