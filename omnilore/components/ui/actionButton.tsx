import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonStyles: Record<
  "add" | "delete" | "edit",
  { fillColor: string }
> = {
  add: {
    fillColor: "#C9FFAE",
  },
  delete: {
    fillColor: "#FFC3C3",
  },
  edit: {
    fillColor: "#E5E7EB",
  },
};

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  actionType: "add" | "delete" | "edit";
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ actionType, className, ...props }, ref) => {
    const { fillColor } = buttonStyles[actionType];

    return (
      <button
        className={cn(
          "flex items-center gap-1 rounded-3xl px-2 text-sm font-medium transition-colors pl-4 pr-4",
          className
        )}
        ref={ref}
        style={{
          backgroundColor: fillColor,
        }}
        {...props}
      >
        <span className="font-semibold">{actionType}</span>
      </button>
    );
  }
);
ActionButton.displayName = "ActionButton";

export { ActionButton };
