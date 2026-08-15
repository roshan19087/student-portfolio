import { prisma } from '../../db.js';
import { AppError } from '../../utils/AppError.js';
import { AdminDashboardStatsDto, AdminContactMessageDto } from '@portfolio/shared';

export class AdminService {
  public static async getDashboardStats(): Promise<AdminDashboardStatsDto> {
    const [
      totalProjects,
      totalApps,
      totalSkills,
      totalBlogPosts,
      unreadMessages,
      recentProjects,
      recentMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.app.count(),
      prisma.skill.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          isFeatured: true,
          createdAt: true,
        },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      counts: {
        totalProjects,
        totalApps,
        totalSkills,
        totalBlogPosts,
        unreadMessages,
      },
      recentProjects: recentProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        isFeatured: p.isFeatured,
        createdAt: p.createdAt.toISOString(),
      })),
      recentMessages: recentMessages.map((m) => ({
        id: m.id,
        senderName: m.senderName,
        senderEmail: m.senderEmail,
        subject: m.subject,
        message: m.message,
        isRead: m.isRead,
        isArchived: m.isArchived,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      })),
    };
  }

  public static async getMessages(filter?: {
    isRead?: boolean;
    isArchived?: boolean;
  }): Promise<AdminContactMessageDto[]> {
    const where: Record<string, unknown> = {};
    if (filter?.isRead !== undefined) where.isRead = filter.isRead;
    if (filter?.isArchived !== undefined) where.isArchived = filter.isArchived;

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return messages.map((m) => ({
      id: m.id,
      senderName: m.senderName,
      senderEmail: m.senderEmail,
      subject: m.subject,
      message: m.message,
      isRead: m.isRead,
      isArchived: m.isArchived,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));
  }

  public static async getMessageById(id: string): Promise<AdminContactMessageDto> {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw AppError.notFound('Message not found');
    }

    return {
      id: message.id,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      subject: message.subject,
      message: message.message,
      isRead: message.isRead,
      isArchived: message.isArchived,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    };
  }

  public static async updateMessageStatus(
    id: string,
    updates: { isRead?: boolean; isArchived?: boolean },
  ): Promise<AdminContactMessageDto> {
    const existing = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound('Message not found');
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: updates,
    });

    return {
      id: updated.id,
      senderName: updated.senderName,
      senderEmail: updated.senderEmail,
      subject: updated.subject,
      message: updated.message,
      isRead: updated.isRead,
      isArchived: updated.isArchived,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  public static async deleteMessage(id: string): Promise<void> {
    const existing = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw AppError.notFound('Message not found');
    }

    await prisma.contactMessage.delete({
      where: { id },
    });
  }
}
