module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    console.log("User role:", req.user.role);
    console.log("Allowed roles:", allowedRoles);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    next();
  };
};
