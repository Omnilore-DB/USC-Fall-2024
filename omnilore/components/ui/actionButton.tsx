import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonStyles: Record<
  "add" | "delete" | "edit",
  { fillColor: string; borderColor: string; icon: React.ReactNode }
> = {
  add: {
    fillColor: "#EDF3FF",
    borderColor: "#D1E0FF",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.35589 34.4857C7.36679 35.4748 6.69668 35.8257 6.34052 37.7341C5.98435 39.6425 6.13897 48.2491 6.13897 48.2491C6.13897 48.2491 14.7458 48.404 16.6542 48.0478C18.5627 47.6916 18.9135 47.0215 19.9026 46.0324M8.35589 34.4857C9.15698 33.6846 28.3898 14.4518 35.6745 7.16706M8.35589 34.4857L19.9026 46.0324M35.6745 7.16706C37.3847 5.45684 38.4364 4.40516 38.4364 4.40516C39.8641 2.97742 43.7516 1.23558 48.4499 5.93819C53.1525 10.6364 51.4108 14.5241 49.9831 15.9519C49.9831 15.9519 48.9314 17.0035 47.2212 18.7138M35.6745 7.16706L47.2212 18.7138M19.9026 46.0324C20.7037 45.2313 39.9365 25.9985 47.2212 18.7138" stroke="#000000" stroke-width="3"/>
      </svg>
    ),
  },
  delete: {
    fillColor: "#FFE5E5",
    borderColor: "#FFCECE",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 50 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M24.8557 9.01631V0.856934H18.9138L16.2137 3.55275H0.0224609V9.01631H2.9033L7.96929 50.9346C8.42372 53.007 10.1294 54.5487 12.7373 54.8086H24.8557V49.3063H13.2327L8.5369 9.01631H24.8557ZM41.1745 9.01631H24.8557V0.856934H30.7977L33.4977 3.55275H49.689V9.01631H46.8081L41.7421 50.9346C41.2877 53.007 39.582 54.5487 36.9741 54.8086H24.8557V49.3063H36.4787L41.1745 9.01631Z" fill="black"/>
      </svg>
      

    ),
  },
  edit: {
    fillColor: "#F8F8F8",
    borderColor: "#EBEBEB",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27.8384" cy="27.0938" r="25.4424" stroke="black" stroke-width="3"/>
        <path d="M27.835 38.1208V16.0654" stroke="black" stroke-width="3"/>
        <path d="M38.8655 27.0903L16.8101 27.0903" stroke="black" stroke-width="3"/>
      </svg>
      
    ),
  },
};

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  actionType: "add" | "delete" | "edit";
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ actionType, className, ...props }, ref) => {
    const { fillColor, borderColor, icon } = buttonStyles[actionType];

    return (
      <button
        className={cn(
          "flex items-center gap-1 rounded-md px-2 text-sm font-medium transition-colors",
          "border-2",
          className
        )}
        ref={ref}
        style={{
          backgroundColor: fillColor,
          borderColor: borderColor,
        }}
        {...props}
      >
        {icon}
        <span className="font-bold">{actionType}</span>
      </button>
    );
  }
);
ActionButton.displayName = "ActionButton";

export { ActionButton };
