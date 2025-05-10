// app/cookies-wrapper.tsx
"use client";

import { CookiesProvider } from "react-cookie";
import React from "react";

export const CookiesWrapper = ({ children }: { children: React.ReactNode }) => {
  return <CookiesProvider>{children}</CookiesProvider>;
};
