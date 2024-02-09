import bcrypt from 'bcrypt';
import prisma from '../prisma.js';
import { Buffer } from "buffer";
import randomstring from 'randomstring';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const routes = Router();

routes.post('/login', async (req, res) => {
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

    const existingToken = await prisma.token.findFirst({
      where: {
        user_id: user.id,
        expires_at: {
          gt: new Date(),
        },
      },
    });

    if (existingToken) {
      res.cookie('sessionToken', existingToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });

      return res.json({
        message: 'Login successful',
        userId: user.id,
        userName: user.name,
        token: existingToken.token,
      });
    }

    const sessionToken = generateSessionToken();

    await prisma.token.create({
      data: {
        user_id: user.id,
        token: sessionToken,
        expires_at: new Date(new Date().getTime() + 30 * 24 * 3600 * 1000),
      },
    });

    res.cookie('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.json({
      message: 'Login successful',
      userId: user.id,
      userName: user.name,
      token: sessionToken
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
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

const generateSessionToken = () => {
    const token = Buffer.from(randomstring.generate()).toString('base64');
    return token;
}

export default routes;
