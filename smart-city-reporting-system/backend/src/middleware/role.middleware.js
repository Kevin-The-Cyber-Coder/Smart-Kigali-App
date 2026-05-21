const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. ${req.user.role} role is not authorized.`
      });
    }
    
    next();
  };
};

const isAdmin = checkRole('admin');
const isWorker = checkRole('admin', 'worker');
const isCitizen = checkRole('citizen', 'admin', 'worker');

module.exports = { checkRole, isAdmin, isWorker, isCitizen };