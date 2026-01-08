"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export type DeviceType = "mobile" | "pad" | "pc";
export type TemplateType = "default";

export interface TemplateConfig {
  template: TemplateType;
  device: DeviceType;
}

export const BREAKPOINTS = {
  mobile: 768,
  pad: 1024,
} as const;

export function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) return "mobile";
  if (width < BREAKPOINTS.pad) return "pad";
  return "pc";
}

export function getDeviceTypeFromUA(ua?: string | null): DeviceType {
  if (!ua) return "pc";
  const uaLower = ua.toLowerCase();
  if (uaLower.includes("ipad") || uaLower.includes("tablet")) return "pad";
  if (
    uaLower.includes("iphone") ||
    uaLower.includes("android") ||
    uaLower.includes("mobile")
  ) {
    return "mobile";
  }
  return "pc";
}

export type TemplateMap<P = unknown> = Record<
  TemplateType,
  Record<DeviceType, React.ComponentType<P>>
>;

interface TemplateContextValue {
  serverDevice: DeviceType;
}

export const TemplateContext = createContext<TemplateContextValue>({
  serverDevice: "pc",
});

function subscribeToWindowSize(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getWindowWidthSnapshot(): number {
  if (typeof window === "undefined") {
    return 1024;
  }
  return window.innerWidth;
}

export function useTemplate(): TemplateConfig {
  const { serverDevice } = useContext(TemplateContext);

  const device = useSyncExternalStore(
    subscribeToWindowSize,
    () => getDeviceType(getWindowWidthSnapshot()),
    () => serverDevice
  );

  return {
    template: "default",
    device,
  };
}


