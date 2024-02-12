import { Router } from 'express';
import { checkLogout } from '../../middleware/middleware.js';
import validateLoginRequest from '../../middleware/validator.js';
import authService from '../../service/auth-service.js';

const routes = Router();

routes.post('/login', checkLogout, validateLoginRequest, async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await authService.loginAdmin(email, password);
    res.cookie('sessionToken', user.token, {
      httpOnly: true,
      path: '/admin',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

routes.post('/logout', (req, res) => {
    res.cookie('sessionToken', '', {
      expires: new Date(0),
      path: '/admin',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  
    res.json({message: 'Logout successful'});
});
export default routes;
