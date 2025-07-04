# Quick Setup Guide

This guide will help you get your SaaS starter kit up and running quickly.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Cloudflare account with R2 storage
- Git installed

## Step-by-Step Setup

### 1. Environment Configuration

Copy the environment template:
```bash
cp .env.example .env.local
```

Fill in the required values:

#### Database Configuration
```env
DATABASE_URL="postgresql://username:password@localhost:5432/saas_db"
```

For local PostgreSQL:
1. Install PostgreSQL
2. Create a database: `createdb saas_db`
3. Update the connection string

For cloud databases (recommended):
- **Neon**: https://neon.tech
- **Supabase**: https://supabase.com
- **PlanetScale**: https://planetscale.com

#### Authentication Configuration
```env
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

Generate a secret key:
```bash
openssl rand -base64 32
```

#### Cloudflare R2 Configuration
```env
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"
```

To set up Cloudflare R2:
1. Go to Cloudflare Dashboard
2. Navigate to R2 Object Storage
3. Create a new bucket
4. Generate API tokens with R2 permissions
5. Copy the credentials

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Generate and run migrations:
```bash
npm run db:generate
npm run db:migrate
```

Or for development, push schema directly:
```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your application!

## Optional: OAuth Setup

### Google OAuth
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `.env.local`:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env.local`:
```env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check connection string format
- Ensure database exists
- Check firewall settings for cloud databases

### Authentication Issues
- Verify BETTER_AUTH_SECRET is set
- Check BETTER_AUTH_URL matches your domain
- Ensure OAuth credentials are correct

### File Upload Issues
- Verify R2 credentials are correct
- Check bucket permissions
- Ensure CORS is configured for your domain

### Build Issues
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## Next Steps

1. **Customize the design**: Modify components in `src/components/`
2. **Add business logic**: Create new API routes and database schemas
3. **Configure deployment**: Set up production environment
4. **Add monitoring**: Integrate error tracking and analytics
5. **Set up CI/CD**: Automate testing and deployment

## Production Deployment

### Environment Variables
Update these for production:
```env
BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Database
- Use a production PostgreSQL instance
- Run migrations: `npm run db:migrate`
- Set up backups

### File Storage
- Configure R2 bucket for production
- Set up CDN if needed
- Configure CORS for your domain

### Security
- Use strong secrets
- Enable HTTPS
- Configure CSP headers
- Set up rate limiting

## Support

If you encounter issues:
1. Check the main README.md
2. Review the troubleshooting section
3. Check environment variables
4. Verify all services are running

Happy building! 🚀

