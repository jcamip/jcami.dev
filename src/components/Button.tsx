import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "accent" | "ghost" | "invert";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btnPrimary",
  accent: "btnAccent",
  ghost: "btnGhost",
  invert: "btnInvert",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  href,
  ...rest
}: ButtonProps) {
  const classes = `btn ${VARIANT_CLASS[variant]} ${className}`.trim();

  if (href) {
    const { target, rel } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
