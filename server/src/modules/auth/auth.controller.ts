import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { AuthUtils } from './auth.utils.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { AppError } from '../../utils/AppError.js';
import { ApiResponse, AuthSessionResponseDto, LoginInput } from '@portfolio/shared';

export const login = asyncCatch(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const metadata = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  const { user, accessToken, refreshToken } = await AuthService.login(input, metadata);

  // Set secure HttpOnly cookies
  res.cookie('accessToken', accessToken, AuthUtils.getAccessTokenCookieOptions());
  res.cookie('refreshToken', refreshToken, AuthUtils.getRefreshTokenCookieOptions());

  const response: ApiResponse<AuthSessionResponseDto> = {
    success: true,
    data: { user },
  };

  res.status(200).json(response);
});

export const refresh = asyncCatch(async (req: Request, res: Response) => {
  const rawRefreshToken = req.cookies?.refreshToken;

  if (!rawRefreshToken) {
    res.clearCookie('accessToken', AuthUtils.getClearCookieOptions());
    res.clearCookie('refreshToken', AuthUtils.getClearCookieOptions());
    throw new AppError('No refresh token provided in session.', 401, 'UNAUTHORIZED');
  }

  const metadata = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };

  try {
    const { user, accessToken, refreshToken } = await AuthService.refreshToken(
      rawRefreshToken,
      metadata,
    );

    // Rotate and set updated cookies
    res.cookie('accessToken', accessToken, AuthUtils.getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, AuthUtils.getRefreshTokenCookieOptions());

    const response: ApiResponse<AuthSessionResponseDto> = {
      success: true,
      data: { user },
    };

    res.status(200).json(response);
  } catch (err) {
    // Clear cookies on any refresh failure / reuse detection
    res.clearCookie('accessToken', AuthUtils.getClearCookieOptions());
    res.clearCookie('refreshToken', AuthUtils.getClearCookieOptions());
    throw err;
  }
});

export const logout = asyncCatch(async (req: Request, res: Response) => {
  const rawRefreshToken = req.cookies?.refreshToken;

  await AuthService.logout(rawRefreshToken);

  // Safely clear cookies
  res.clearCookie('accessToken', AuthUtils.getClearCookieOptions());
  res.clearCookie('refreshToken', AuthUtils.getClearCookieOptions());

  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: { message: 'Logged out successfully.' },
  };

  res.status(200).json(response);
});

export const getMe = asyncCatch(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
  }

  const user = await AuthService.getCurrentUser(req.user.userId);

  const response: ApiResponse<AuthSessionResponseDto> = {
    success: true,
    data: { user },
  };

  res.status(200).json(response);
});
