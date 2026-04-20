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
    <div className="z-9999 flex h-dvh w-dvw flex-col items-center justify-center">
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
