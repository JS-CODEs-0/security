import { useMemo } from "react";

export type PageTypographyProps = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export type LandingPageCustomization = PageTypographyProps & {
  css?: string;
};

export const COMPLETE_SHELF_TYPOGRAPHY: LandingPageCustomization = {
  headingFont: "iowan-old-style",
  bodyFont: "inter",
  headingWeight: "400",
  bodyWeight: "400",
  primaryColor: "#c084fc",
  headingSize: 60,
  bodySize: 12,
  headingLetterSpacing: -0.055,
};

const TYPOGRAPHY_KEYS: Array<keyof PageTypographyProps> = [
  "headingFont",
  "bodyFont",
  "headingWeight",
  "bodyWeight",
  "primaryColor",
  "headingSize",
  "bodySize",
  "headingLetterSpacing",
];

export function splitTypographyProps<T extends Record<string, any>>(
  props: T
): [PageTypographyProps, Omit<T, keyof PageTypographyProps>] {
  const typography: Record<string, any> = {};
  const rest: Record<string, any> = {};

  for (const [key, value] of Object.entries(props)) {
    if (TYPOGRAPHY_KEYS.includes(key as keyof PageTypographyProps)) {
      typography[key] = value;
    } else {
      rest[key] = value;
    }
  }

  return [typography as PageTypographyProps, rest as Omit<T, keyof PageTypographyProps>];
}

export function usePageTypography(
  recipe: LandingPageCustomization = COMPLETE_SHELF_TYPOGRAPHY,
  props: PageTypographyProps = {}
): LandingPageCustomization {
  return useMemo(() => {
    return {
      ...recipe,
      ...props,
    };
  }, [recipe, props]);
}

const CUSTOMIZATION_STYLE_ID = "threeui-page-typography-customization";

export function applyPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization
) {
  if (!frame || !customization) return;
  const doc = frame.contentDocument;
  if (!doc) return;

  let styleTag = doc.getElementById(CUSTOMIZATION_STYLE_ID) as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = doc.createElement("style");
    styleTag.id = CUSTOMIZATION_STYLE_ID;
    doc.head?.appendChild(styleTag);
  }

  const cssRules: string[] = [];

  if (customization.primaryColor) {
    cssRules.push(`--accent: ${customization.primaryColor} !important;`);
  }
  if (customization.headingFont) {
    cssRules.push(`--font-heading: "${customization.headingFont}", serif !important;`);
  }
  if (customization.bodyFont) {
    cssRules.push(`--font-body: "${customization.bodyFont}", sans-serif !important;`);
  }
  if (customization.headingSize) {
    cssRules.push(`--heading-size: ${customization.headingSize}px !important;`);
  }
  if (customization.bodySize) {
    cssRules.push(`--body-size: ${customization.bodySize}px !important;`);
  }
  if (customization.headingLetterSpacing !== undefined) {
    cssRules.push(`--heading-spacing: ${customization.headingLetterSpacing}em !important;`);
  }

  styleTag.textContent = `
    :root {
      ${cssRules.join("\n      ")}
    }
    ${customization.css || ""}
  `;
}

export function postPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization
) {
  if (!frame || !customization) return;
  try {
    frame.contentWindow?.postMessage(
      {
        type: "threeui:customization",
        ...customization,
      },
      "*"
    );
  } catch {
    // Cross-origin safe
  }
}
