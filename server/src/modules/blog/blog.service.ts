import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import {
  BlogQueryInput,
  PaginationMeta,
  PublicBlogPostListItemDto,
  PublicBlogPostDetailDto,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '@portfolio/shared';
import { Prisma } from '@prisma/client';

export class BlogService {
  static async getPublicPosts(
    query: BlogQueryInput,
  ): Promise<{ posts: PublicBlogPostListItemDto[]; pagination: PaginationMeta }> {
    const { page, limit, tag, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {
      status: 'PUBLISHED',
      publishedAt: { not: null },
    };

    if (tag) {
      where.tags = {
        some: {
          tag: {
            OR: [
              { slug: { equals: tag, mode: 'insensitive' } },
              { name: { equals: tag, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const mappedPosts: PublicBlogPostListItemDto[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      coverImageUrl: post.coverImageUrl,
      readingTimeMinutes: post.readingTimeMinutes,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      tags: post.tags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
    }));

    return {
      posts: mappedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getPublicPostBySlug(slug: string): Promise<PublicBlogPostDetailDto> {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      throw AppError.notFound(`Blog article with slug '${slug}' not found.`);
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      contentMarkdown: post.contentMarkdown,
      coverImageUrl: post.coverImageUrl,
      readingTimeMinutes: post.readingTimeMinutes,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      tags: post.tags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  static async getAdminPosts(): Promise<PublicBlogPostDetailDto[]> {
    const posts = await prisma.blogPost.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      contentMarkdown: post.contentMarkdown,
      coverImageUrl: post.coverImageUrl,
      readingTimeMinutes: post.readingTimeMinutes,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      tags: post.tags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      updatedAt: post.updatedAt.toISOString(),
    }));
  }

  static async getAdminPostById(id: string): Promise<PublicBlogPostDetailDto> {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      throw AppError.notFound(`Blog article with id '${id}' not found.`);
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      contentMarkdown: post.contentMarkdown,
      coverImageUrl: post.coverImageUrl,
      readingTimeMinutes: post.readingTimeMinutes,
      publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      tags: post.tags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  static async createBlogPost(input: CreateBlogPostInput): Promise<PublicBlogPostDetailDto> {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: input.slug },
    });

    if (existing) {
      throw AppError.badRequest(`An article with slug '${input.slug}' already exists.`);
    }

    const publishedAt =
      input.status === 'PUBLISHED'
        ? input.publishedAt
          ? new Date(input.publishedAt)
          : new Date()
        : null;

    const created = await prisma.$transaction(async (tx) => {
      const post = await tx.blogPost.create({
        data: {
          title: input.title,
          slug: input.slug,
          summary: input.summary,
          contentMarkdown: input.contentMarkdown,
          coverImageUrl: input.coverImageUrl ?? null,
          readingTimeMinutes: input.readingTimeMinutes ?? 1,
          status: input.status,
          publishedAt,
        },
      });

      if (input.tags && input.tags.length > 0) {
        for (const tagName of input.tags) {
          const cleanName = tagName.trim();
          if (!cleanName) continue;
          const tagSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          const tag = await tx.tag.upsert({
            where: { name: cleanName },
            update: {},
            create: { name: cleanName, slug: tagSlug },
          });

          await tx.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          });
        }
      }

      return post;
    });

    return this.getAdminPostById(created.id);
  }

  static async updateBlogPost(
    id: string,
    input: UpdateBlogPostInput,
  ): Promise<PublicBlogPostDetailDto> {
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Blog article with id '${id}' not found.`);
    }

    if (input.slug && input.slug !== existing.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug: input.slug },
      });
      if (slugConflict) {
        throw AppError.badRequest(`An article with slug '${input.slug}' already exists.`);
      }
    }

    let publishedAt = existing.publishedAt;
    if (input.status === 'PUBLISHED' && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (input.status === 'DRAFT') {
      publishedAt = null;
    }
    if (input.publishedAt !== undefined) {
      publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
    }

    await prisma.$transaction(async (tx) => {
      await tx.blogPost.update({
        where: { id },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.summary !== undefined && { summary: input.summary }),
          ...(input.contentMarkdown !== undefined && { contentMarkdown: input.contentMarkdown }),
          ...(input.coverImageUrl !== undefined && { coverImageUrl: input.coverImageUrl ?? null }),
          ...(input.readingTimeMinutes !== undefined && {
            readingTimeMinutes: input.readingTimeMinutes,
          }),
          ...(input.status !== undefined && { status: input.status }),
          publishedAt,
        },
      });

      if (input.tags !== undefined) {
        await tx.postTag.deleteMany({
          where: { postId: id },
        });

        for (const tagName of input.tags) {
          const cleanName = tagName.trim();
          if (!cleanName) continue;
          const tagSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          const tag = await tx.tag.upsert({
            where: { name: cleanName },
            update: {},
            create: { name: cleanName, slug: tagSlug },
          });

          await tx.postTag.create({
            data: {
              postId: id,
              tagId: tag.id,
            },
          });
        }
      }
    });

    return this.getAdminPostById(id);
  }

  static async deleteBlogPost(id: string): Promise<void> {
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound(`Blog article with id '${id}' not found.`);
    }

    await prisma.blogPost.delete({
      where: { id },
    });
  }
}
