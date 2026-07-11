import { type HTMLAttributes, forwardRef } from "react";

/**
 * Design system Card component.
 *
 * Soft shadow, rounded-xl, generous padding (p-6 / p-8),
 * no hard borders, subtle border on light bg for definition.
 * Elevation via shadow hierarchy: card < card-hover < modal.
 */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Makes the card respond to hover with lift + shadow */
  interactive?: boolean;
  /** Use tighter padding (p-4 instead of p-6/p-8) */
  compact?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, compact = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${interactive ? "card-interactive" : "card"}
          ${compact ? "p-4" : ""}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* ── Sub-components for structured cards ──────────────────── */

function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-xl font-bold text-text-primary ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm text-text-secondary mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

function CardContent({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-6 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps };
