import { Logo } from '@/shared/ui/components/Logo/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary-900 to-primary-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="h-12 mx-auto" />
        </div>
        {children}
      </div>
    </div>
  );
}
