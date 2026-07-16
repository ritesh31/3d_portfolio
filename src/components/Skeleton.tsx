function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export function HeroSkeleton() {
  return (
    <div className="py-4 px-8 mx-5 rounded-lg w-[300px]">
      <Bar className="h-6 w-40 mx-auto mb-3" />
      <Bar className="h-6 w-56 mx-auto" />
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Bar className="h-10 w-64" />
      <Bar className="h-4 w-full max-w-xl" />
      <Bar className="h-4 w-3/4 max-w-xl" />
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="mt-16 flex flex-wrap gap-12">
      {Array.from({ length: 8 }).map((_, index) => (
        <Bar key={index} className="w-20 h-20 rounded-xl" />
      ))}
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="mt-12 flex flex-col gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2 max-w-xl">
          <Bar className="h-5 w-48" />
          <Bar className="h-4 w-36" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="flex flex-wrap my-20 gap-16">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="lg:w-[400px] w-full flex flex-col gap-4" key={index}>
          <Bar className="w-12 h-12 rounded-xl" />
          <Bar className="h-6 w-1/2" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="flex flex-wrap my-20 gap-16">
      {Array.from({ length: 2 }).map((_, index) => (
        <div className="lg:w-[400px] w-full flex flex-col gap-4" key={index}>
          <Bar className="w-full h-40 rounded-xl" />
          <Bar className="h-6 w-1/2" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}
