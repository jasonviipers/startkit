import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            SaaS Starter Kit
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive starter kit for building modern SaaS applications with Next.js, 
            Drizzle ORM, Better Auth, PostgreSQL, shadcn/ui, TanStack Query, and Cloudflare R2.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/signin">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </header>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🔐 Authentication</CardTitle>
                <CardDescription>
                  Complete auth system with Better Auth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Magic Link</li>
                  <li>• Passkeys</li>
                  <li>• OAuth providers (Google, GitHub)</li>
                  <li>• Session management</li>
                  <li>• Protected routes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🗄️ Database</CardTitle>
                <CardDescription>
                  Type-safe database with Drizzle ORM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• PostgreSQL integration</li>
                  <li>• Schema migrations</li>
                  <li>• Type-safe queries</li>
                  <li>• Database utilities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 UI Components</CardTitle>
                <CardDescription>
                  Beautiful components with shadcn/ui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pre-built components</li>
                  <li>• Tailwind CSS styling</li>
                  <li>• Dark mode support</li>
                  <li>• Responsive design</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Data Fetching</CardTitle>
                <CardDescription>
                  Powerful data fetching with TanStack Query
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Caching & synchronization</li>
                  <li>• Background updates</li>
                  <li>• Optimistic updates</li>
                  <li>• Error handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>☁️ File Storage</CardTitle>
                <CardDescription>
                  Scalable storage with Cloudflare R2
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• File upload/download</li>
                  <li>• Presigned URLs</li>
                  <li>• File validation</li>
                  <li>• CDN integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏢 Multi-tenant</CardTitle>
                <CardDescription>
                  Organization-based architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Organization management</li>
                  <li>• Role-based access</li>
                  <li>• Team collaboration</li>
                  <li>• Audit logging</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-8">Built With Modern Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'Next.js 15',
              'TypeScript',
              'Drizzle ORM',
              'PostgreSQL',
              'Better Auth',
              'shadcn/ui',
              'TanStack Query',
              'Cloudflare R2',
              'Tailwind CSS',
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-muted rounded-full text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

