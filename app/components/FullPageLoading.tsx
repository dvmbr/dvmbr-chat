"use client";

type Props = {
  text: string;
};

export default function FullPageLoading({ text }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/70 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          {/* base ring */}
          <div className="absolute inset-0 rounded-full border-2 border-text-muted/20" />

          {/* spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>

        {/* Text */}
        <p className="text-xs tracking-widest text-text-muted">{text}</p>
      </div>
    </div>
  );
}
