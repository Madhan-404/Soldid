import { Progress } from '@/components/ui/progress';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Progress value={33} className="w-[60%]" />
      <p className="mt-4 text-lg font-semibold">Loading Streams...</p>
    </div>
  );
}
