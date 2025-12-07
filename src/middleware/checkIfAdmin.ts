import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/db";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This requires your auth middleware to set req.user
   
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: No user found in request" });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { role: true }
    });

    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ msg: "Forbidden: Admin access required" });
    }

    return next(); // proceed to the controller

  } catch (err) {
    console.error("Admin middleware error:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
