// Role-based access control configuration
export const moduleAccess = {
  dashboard: ['admin', 'doctor', 'counsellor', 'fieldstaff'],
  outreach: ['admin', 'counsellor', 'fieldstaff'],
  'hiv-testing': ['admin', 'doctor', 'counsellor'],
  prep: ['admin', 'doctor'],
  'hiv-positivity-tracker': ['admin', 'doctor', 'counsellor'],
  'art-referrals': ['admin', 'doctor', 'counsellor'],
  documents: ['admin', 'doctor', 'counsellor'],
  inventory: ['admin', 'doctor', 'counsellor'],
  'asset-management': ['admin'],
  followups: ['admin', 'doctor', 'counsellor', 'fieldstaff'],
  'hr-attendance': ['admin'],
  'prep-consent': ['admin', 'doctor', 'counsellor'],
  clients: ['admin', 'doctor', 'counsellor'],
  reports: ['admin', 'doctor'],
  'user-management': ['admin'],
  settings: ['admin', 'doctor', 'counsellor', 'fieldstaff']
};

export const hasAccess = (userRole, modulePath) => {
  const module = modulePath.replace('/', '');
  const allowedRoles = moduleAccess[module];
  return allowedRoles ? allowedRoles.includes(userRole) : false;
};

export const getAccessibleModules = (userRole) => {
  return Object.keys(moduleAccess).filter(module => 
    moduleAccess[module].includes(userRole)
  );
};
