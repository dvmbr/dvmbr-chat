"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!ready) return null;

  return createPortal(
    <div className="fixed inset-0 overflow-y-auto bg-white">
      <SwaggerUI url="/api/openapi" />
    </div>,
    document.body
  );
}
