"use client";

import {useState, useCallback} from "react";

export function usePreventDoubleSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startSubmit = useCallback(() => {
    setIsSubmitting(true);
  }, []);

  const endSubmit = useCallback(() => {
    setIsSubmitting(false);
  }, []);

  return {
    isSubmitting,
    startSubmit,
    endSubmit,
  };
}
