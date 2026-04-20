"use client";

import { useEffect, useState } from "react";
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";
export type LoadingProps = {
  text?: string;
};
export default function Loading({ text = "Loading..." }: LoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="z-9 mx-auto flex h-dvh flex-col items-center justify-center overflow-hidden p-6">
      <Field className="w-full max-w-sm">
        <FieldLabel htmlFor="progress-upload">
          <span>{text}</span>
          <span className="ml-auto">{progress}%</span>
        </FieldLabel>
        <Progress value={progress} id="progress-upload" />
      </Field>
    </div>
  );
}
