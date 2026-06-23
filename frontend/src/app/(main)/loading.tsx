import { Spinner } from '@/shared/ui/components/Spinner/Spinner';

export default function MainLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
}
