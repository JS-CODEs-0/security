"use client";

import {
  splitTypographyProps,
  usePageTypography,
  COMPLETE_SHELF_TYPOGRAPHY,
  type PageTypographyProps,
} from "./pageTypography";
import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";

export interface CompleteShelfLandingPageProps extends LandingPageProps, PageTypographyProps {
  onFrameLoad?: (frame: HTMLIFrameElement) => void;
}

export function CompleteShelfLandingPage(props: CompleteShelfLandingPageProps) {
  const [typography, frame] = splitTypographyProps(props);
  const customization = usePageTypography(COMPLETE_SHELF_TYPOGRAPHY, typography);

  return (
    <LandingPageFrame
      {...frame}
      customization={customization}
      title="Digital Safety Intelligence — Seven Field Guides for Cyber Defense"
      sourceUrl="/landing-pages/complete-shelf-v2.html"
    />
  );
}
