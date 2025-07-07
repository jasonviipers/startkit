import { requireAuth } from '@/lib/auth/utils';

interface LayoutProps {
    children: React.ReactNode;
}
export default async function layout({ children }: LayoutProps) {
    await requireAuth()
    return (
        <div className="bg-black min-h-screen flex flex-col">
            {children}
        </div>
    )
}
