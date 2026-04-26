"use client";

import { useEffect, useState } from "react";
import { Field, FieldLabel } from "./field";
import { Progress } from "./progress";
import { Loader } from "lucide-react";
export type LoadingProps = {
  text?: string;
  delay?: number;
  showProgress?: boolean;
};
export default function Loading({
  text = "Loading...",
  delay = 100,
  showProgress = true,
}: LoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), delay);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="bg-background fixed inset-0 z-9999 mx-auto flex h-dvh flex-col items-center justify-center overflow-hidden p-6">
      {showProgress ? (
        <Field className="w-full max-w-sm">
          <FieldLabel htmlFor="progress-upload">
            <span>{text}</span>
            <span className="ml-auto">{progress}%</span>
          </FieldLabel>
          <Progress value={progress} id="progress-upload" />
        </Field>
      ) : (
        <div className="flex w-full justify-center">
          <span className="mt-1">{text}</span>
          <Loader className="h-3 w-3 animate-spin" />
        </div>
      )}
    </div>
  );
}
