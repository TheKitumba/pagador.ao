import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { type ComponentProps, forwardRef } from "react";

import { Button } from "@/components/ui/button";

type Props = { icon: IconSvgElement; label: string; collapse?: boolean } & ComponentProps<typeof Button>;

/** Page action with icon; the label hides on phones but stays available to screen readers. */
export const HeaderButton = forwardRef<HTMLButtonElement, Props>(({ icon, label, collapse = true, ...props }, ref) => (
  <Button ref={ref} {...props}>
    <HugeiconsIcon icon={icon} aria-hidden />
    {collapse ? (
      <>
        <span className="hidden sm:inline">{label}</span>
        <span className="sr-only sm:hidden">{label}</span>
      </>
    ) : (
      label
    )}
  </Button>
));
HeaderButton.displayName = "HeaderButton";
