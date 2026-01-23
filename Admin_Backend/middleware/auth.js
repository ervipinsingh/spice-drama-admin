import User from "../models/User.js";

/* Check if user is logged in */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

/* Role-based access control */
const hasRole = (...roles) => {
  return async (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await User.findById(req.session.userId);

      if (!user || !user.isActive) {
        return res.status(403).json({ error: "Account is inactive" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          error: "Access denied - Insufficient permissions",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  };
};

export { isAuthenticated, hasRole };
