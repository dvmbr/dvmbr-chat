"use client";

type ErrorViewProps = {
  text: string;
};
export default function ErrorView({ text }: ErrorViewProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <p>{text}</p>
    </div>
  );
}
