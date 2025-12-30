import {Router} from 'express'
import { isAdmin } from '../../middleware/checkIfAdmin'
import { authenticateToken } from '../../middleware/authMiddleware'
import { adminLogin, adminRegister, aboutMe } from '../../controller/admin/auth'
const router = Router()

// Admin registration - requires existing admin to create new admin
router.post("/api/v1/auth/register", authenticateToken, isAdmin, adminRegister)
// Admin login - public endpoint, no authentication required
router.post("/api/v1/auth/login", adminLogin)
// Get current admin info - requires authentication and admin role
router.get("/api/v1/auth/me", authenticateToken, isAdmin, aboutMe)
