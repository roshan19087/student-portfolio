import { Request, Response } from 'express';
import { BlogService } from './blog.service.js';
import { asyncCatch } from '../../utils/asyncCatch.js';
import { ApiResponse, BlogQueryInput, PublicBlogPostDetailDto } from '@portfolio/shared';

export const listBlogPosts = asyncCatch(async (req: Request, res: Response) => {
  const query = req.query as unknown as BlogQueryInput;
  const result = await BlogService.getPublicPosts(query);

  res.status(200).json({
    success: true,
    data: result.posts,
    pagination: result.pagination,
  });
});

export const getBlogPostBySlug = asyncCatch(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = await BlogService.getPublicPostBySlug(slug as string);

  const response: ApiResponse<PublicBlogPostDetailDto> = {
    success: true,
    data: post,
  };

  res.status(200).json(response);
});

export const getAdminBlogPostsHandler = asyncCatch(async (_req: Request, res: Response) => {
  const posts = await BlogService.getAdminPosts();
  const response: ApiResponse<PublicBlogPostDetailDto[]> = {
    success: true,
    data: posts,
  };
  res.status(200).json(response);
});

export const getAdminBlogPostByIdHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const post = await BlogService.getAdminPostById(id as string);
  const response: ApiResponse<PublicBlogPostDetailDto> = {
    success: true,
    data: post,
  };
  res.status(200).json(response);
});

export const createBlogPostHandler = asyncCatch(async (req: Request, res: Response) => {
  const post = await BlogService.createBlogPost(req.body);
  const response: ApiResponse<PublicBlogPostDetailDto> = {
    success: true,
    data: post,
  };
  res.status(201).json(response);
});

export const updateBlogPostHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const post = await BlogService.updateBlogPost(id as string, req.body);
  const response: ApiResponse<PublicBlogPostDetailDto> = {
    success: true,
    data: post,
  };
  res.status(200).json(response);
});

export const deleteBlogPostHandler = asyncCatch(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await BlogService.deleteBlogPost(id as string);
  const response: ApiResponse<null> = {
    success: true,
    data: null,
  };
  res.status(200).json(response);
});
