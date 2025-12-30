import {Router} from 'express'
import { authenticateToken } from '../../middleware/authMiddleware'
import { customerLogin, customerRegister,aboutMe } from '../../controller/customer/auth'
const router = Router()

// Customer registration - public endpoint, no authentication required
router.post("/api/v1/auth/register", customerRegister)
// Customer login - public endpoint, no authentication required
router.post("/api/v1/auth/login", customerLogin)
// Get current customer info - requires authentication
router.get("/api/v1/auth/me", authenticateToken, aboutMe)
