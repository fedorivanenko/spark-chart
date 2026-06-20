"use client";

import type * as React from "react";
import { cn } from "../lib/utils";

export type BrailleTooltipProps = React.HTMLAttributes<HTMLDivElement>;

export function BrailleTooltip({ className, ...props }: BrailleTooltipProps) {
	return <div className={cn("braille-chart__tooltip", className)} {...props} />;
}
