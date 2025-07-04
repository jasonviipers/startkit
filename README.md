# SaaS Starter Kit

A comprehensive starter kit for building modern SaaS applications with Next.js, Drizzle ORM, Better Auth, PostgreSQL, shadcn/ui, TanStack Query, and Cloudflare R2.

## 🚀 Features

### 🔐 Authentication
- **Better Auth** integration with email/password and OAuth providers
- Session management and protected routes
- Middleware for route protection
- User management utilities

### 🗄️ Database
- **Drizzle ORM** with PostgreSQL
- Type-safe database operations
- Schema migrations and utilities
- Pre-built queries for common operations

### 🎨 UI Components
- **shadcn/ui** component library
- Tailwind CSS for styling
- Dark mode support
- Responsive design
- Professional design system

### ⚡ Data Fetching
- **TanStack Query** for server state management
- Caching and background synchronization
- Optimistic updates
- Error handling and retry logic

### ☁️ File Storage
- **Cloudflare R2** integration
- File upload/download with presigned URLs
- File validation and metadata
- Organized storage structure

### 🏢 Multi-tenant Architecture
- Organization-based structure
- Role-based access control
- Team collaboration features
- Audit logging

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query
- **File Storage**: Cloudflare R2
- **Styling**: Tailwind CSS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-starter-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/saas_db"
   
   # Better Auth
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # Cloudflare R2
   R2_ACCOUNT_ID="your-cloudflare-account-id"
   R2_ACCESS_KEY_ID="your-r2-access-key-id"
   R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
   R2_BUCKET_NAME="your-bucket-name"
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Or push schema directly (for development)
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── auth/             # Authentication utilities
│   ├── db/               # Database utilities
│   ├── r2/               # Cloudflare R2 utilities
│   └── utils.ts          # General utilities
└── types/                 # TypeScript type definitions
```

## 🔧 Configuration

### Database Schema

The starter kit includes a comprehensive database schema with:

- **Users**: User accounts and profiles
- **Sessions**: Authentication sessions
- **Organizations**: Multi-tenant organizations
- **Organization Members**: User-organization relationships
- **Projects**: Example business entities
- **Files**: File metadata and storage references
- **API Keys**: API access management
- **Audit Logs**: Activity tracking

### Authentication

Better Auth is configured with:

- Email/password authentication
- OAuth providers (Google, GitHub)
- Session management
- Protected routes via middleware

### File Storage

Cloudflare R2 is set up for:

- Secure file uploads
- Presigned URL generation
- File validation
- Organized storage by user/organization

## 📚 Usage Examples

### Creating a New Organization

```typescript
import { useCreateOrganization } from '@/hooks/use-organizations';

const { mutate: createOrg } = useCreateOrganization();

createOrg({
  name: 'My Company',
  slug: 'my-company',
  description: 'A great company'
});
```

### Uploading Files

```typescript
import { useUploadFile } from '@/hooks/use-files';

const { mutate: uploadFile } = useUploadFile();

uploadFile({
  file: selectedFile,
  organizationId: 'org-id'
});
```

### Fetching Data

```typescript
import { useOrganizationProjects } from '@/hooks/use-projects';

const { data: projects, isLoading } = useOrganizationProjects(orgId);
```

## 🚀 Deployment

### Environment Setup

1. Set up a PostgreSQL database
2. Configure Cloudflare R2 bucket
3. Set up OAuth applications (optional)
4. Update environment variables

### Database Migration

```bash
npm run db:generate
npm run db:migrate
```

### Build and Deploy

```bash
npm run build
npm start
```

## 🔒 Security Considerations

- Environment variables are properly configured
- Database queries use parameterized statements
- File uploads are validated and sanitized
- Authentication is handled securely
- CORS is properly configured

## 🧪 Development

### Database Management

```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema changes (development)
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

### Code Quality

The project includes:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signout` - Sign out

### User Endpoints

- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update current user

### Organization Endpoints

- `GET /api/organizations` - Get user organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/[id]` - Get organization
- `PATCH /api/organizations/[id]` - Update organization

### File Endpoints

- `POST /api/files/upload` - Upload file
- `GET /api/files/user` - Get user files
- `GET /api/files/organization/[id]` - Get organization files
- `DELETE /api/files/[id]` - Delete file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Updates

This starter kit is actively maintained. Check for updates regularly to get the latest features and security improvements.

