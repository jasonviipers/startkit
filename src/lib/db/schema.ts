import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	stripeCustomerId: text('stripe_customer_id'),
	role: text('role').default("user")
});

export const sessions = pgTable("sessions", {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	activeOrganizationId: text('active_organization_id')
});

export const accounts = pgTable("accounts", {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verifications = pgTable("verifications", {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const oauthApplication = pgTable("oauth_application", {
	id: text('id').primaryKey(),
	name: text('name'),
	icon: text('icon'),
	metadata: text('metadata'),
	clientId: text('client_id').unique(),
	clientSecret: text('client_secret'),
	redirectURLs: text('redirect_u_r_ls'),
	type: text('type'),
	disabled: boolean('disabled'),
	userId: text('user_id'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const oauthAccessToken = pgTable("oauth_access_token", {
	id: text('id').primaryKey(),
	accessToken: text('access_token').unique(),
	refreshToken: text('refresh_token').unique(),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	clientId: text('client_id'),
	userId: text('user_id'),
	scopes: text('scopes'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const oauthConsent = pgTable("oauth_consent", {
	id: text('id').primaryKey(),
	clientId: text('client_id'),
	userId: text('user_id'),
	scopes: text('scopes'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
	consentGiven: boolean('consent_given')
});

export const apikey = pgTable("apikey", {
	id: text('id').primaryKey(),
	name: text('name'),
	start: text('start'),
	prefix: text('prefix'),
	key: text('key').notNull(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	refillInterval: integer('refill_interval'),
	refillAmount: integer('refill_amount'),
	lastRefillAt: timestamp('last_refill_at'),
	enabled: boolean('enabled').default(true),
	rateLimitEnabled: boolean('rate_limit_enabled').default(true),
	rateLimitTimeWindow: integer('rate_limit_time_window').default(86400000),
	rateLimitMax: integer('rate_limit_max').default(10),
	requestCount: integer('request_count'),
	remaining: integer('remaining'),
	lastRequest: timestamp('last_request'),
	expiresAt: timestamp('expires_at'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	permissions: text('permissions'),
	metadata: text('metadata')
});

export const organizations = pgTable("organization", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').unique(),
	logo: text('logo'),
	createdAt: timestamp('created_at').notNull(),
	metadata: text('metadata')
});

export const member = pgTable("member", {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	role: text('role').default("member").notNull(),
	createdAt: timestamp('created_at').notNull()
});

export const invitation = pgTable("invitation", {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role'),
	status: text('status').default("pending").notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	inviterId: text('inviter_id').notNull().references(() => users.id, { onDelete: 'cascade' })
});

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id').notNull(),
  userId: text('user_id').references(() => users.id),
  organizationId: text('organization_id').references(() => organizations.id),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});


// Files table for R2 storage
export const files = pgTable('files', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  key: text('key').notNull().unique(), // R2 object key
  url: text('url').notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type OrganizationMember = typeof member.$inferSelect;
export type NewOrganizationMember = typeof member.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
export type ApiKey = typeof apikey.$inferSelect;
export type NewApiKey = typeof apikey.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
