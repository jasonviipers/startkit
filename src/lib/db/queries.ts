import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from './index';
import { 
  users, 
  organizations, 
  organizationMembers, 
  projects, 
  files, 
  apiKeys,
  auditLogs,
  type User,
  type Organization,
  type Project,
  type File,
  type NewUser,
  type NewOrganization,
  type NewProject,
  type NewFile,
  type NewOrganizationMember,
  type NewAuditLog
} from './schema';

// User queries
export const getUserById = async (id: string): Promise<User | null> => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
};

export const createUser = async (userData: NewUser): Promise<User> => {
  const result = await db.insert(users).values(userData).returning();
  return result[0];
};

export const updateUser = async (id: string, userData: Partial<NewUser>): Promise<User | null> => {
  const result = await db.update(users)
    .set({ ...userData, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0] || null;
};

// Organization queries
export const getOrganizationById = async (id: string): Promise<Organization | null> => {
  const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return result[0] || null;
};

export const getOrganizationBySlug = async (slug: string): Promise<Organization | null> => {
  const result = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);
  return result[0] || null;
};

export const createOrganization = async (orgData: NewOrganization): Promise<Organization> => {
  const result = await db.insert(organizations).values(orgData).returning();
  return result[0];
};

export const getUserOrganizations = async (userId: string) => {
  return await db
    .select({
      organization: organizations,
      role: organizationMembers.role,
      joinedAt: organizationMembers.createdAt,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(eq(organizationMembers.userId, userId))
    .orderBy(desc(organizationMembers.createdAt));
};

export const addUserToOrganization = async (memberData: NewOrganizationMember) => {
  const result = await db.insert(organizationMembers).values(memberData).returning();
  return result[0];
};

export const getOrganizationMembers = async (organizationId: string) => {
  return await db
    .select({
      user: users,
      role: organizationMembers.role,
      joinedAt: organizationMembers.createdAt,
    })
    .from(organizationMembers)
    .innerJoin(users, eq(organizationMembers.userId, users.id))
    .where(eq(organizationMembers.organizationId, organizationId))
    .orderBy(desc(organizationMembers.createdAt));
};

// Project queries
export const getProjectById = async (id: string): Promise<Project | null> => {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0] || null;
};

export const getOrganizationProjects = async (organizationId: string) => {
  return await db
    .select({
      project: projects,
      creator: users,
    })
    .from(projects)
    .innerJoin(users, eq(projects.createdBy, users.id))
    .where(and(
      eq(projects.organizationId, organizationId),
      eq(projects.status, 'active')
    ))
    .orderBy(desc(projects.createdAt));
};

export const createProject = async (projectData: NewProject): Promise<Project> => {
  const result = await db.insert(projects).values(projectData).returning();
  return result[0];
};

export const updateProject = async (id: string, projectData: Partial<NewProject>): Promise<Project | null> => {
  const result = await db.update(projects)
    .set({ ...projectData, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return result[0] || null;
};

// File queries
export const getFileById = async (id: string): Promise<File | null> => {
  const result = await db.select().from(files).where(eq(files.id, id)).limit(1);
  return result[0] || null;
};

export const getUserFiles = async (userId: string) => {
  return await db
    .select()
    .from(files)
    .where(eq(files.userId, userId))
    .orderBy(desc(files.createdAt));
};

export const getOrganizationFiles = async (organizationId: string) => {
  return await db
    .select()
    .from(files)
    .where(eq(files.organizationId, organizationId))
    .orderBy(desc(files.createdAt));
};

export const createFile = async (fileData: NewFile): Promise<File> => {
  const result = await db.insert(files).values(fileData).returning();
  return result[0];
};

export const deleteFile = async (id: string): Promise<boolean> => {
  const result = await db.delete(files).where(eq(files.id, id)).returning();
  return result.length > 0;
};

// API Key queries
export const getApiKeyByKey = async (key: string) => {
  const result = await db.select().from(apiKeys).where(eq(apiKeys.key, key)).limit(1);
  return result[0] || null;
};

export const getOrganizationApiKeys = async (organizationId: string) => {
  return await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.organizationId, organizationId))
    .orderBy(desc(apiKeys.createdAt));
};

// Audit log queries
export const createAuditLog = async (logData: NewAuditLog) => {
  const result = await db.insert(auditLogs).values(logData).returning();
  return result[0];
};

export const getOrganizationAuditLogs = async (organizationId: string, limit = 50) => {
  return await db
    .select({
      log: auditLogs,
      user: users,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.id))
    .where(eq(auditLogs.organizationId, organizationId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
};

