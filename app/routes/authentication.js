import bcrypt from 'bcrypt';
import prisma from '../prisma.js';
import { Buffer } from "buffer";
import randomstring from 'randomstring';
import { Router } from 'express';
import { checkLogout } from '../middleware/middleware.js';
import validateLoginRequest from '../middleware/validator.js';

const routes = Router();

const generateSessionToken = () => {
  const token = Buffer.from(randomstring.generate()).toString('base64');
  return token;
}

routes.post('/login', checkLogout, validateLoginRequest, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    if (user.is_blocked) {
      return res.status(401).json({
        message: 'Your account is blocked',
      });
    }

    const validPassword = bcrypt.compareSync(req.body.password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }
    let sessionToken = '';
    const existingToken = await prisma.token.findFirst({
      where: {
        user_id: user.id,
        expires_at: {
          gt: new Date(),
        },
      },
    });

    if (!existingToken) {
      const createToken = generateSessionToken();
      await prisma.token.create({
        data: {
          user_id: user.id,
          token: createToken,
          expires_at: new Date(new Date().getTime() + 30 * 24 * 3600 * 1000),
        },
      });
      sessionToken = createToken;
    } 
    else {
      sessionToken = existingToken.token;
    }
    res.cookie('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res.json({
      message: 'Login successful',
      userId: user.id,
      userName: user.name,
      token: sessionToken,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

routes.post('/logout', (req, res) => {
    res.cookie('sessionToken', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  
    res.json({message: 'Logout successful'});
});
export default routes;
