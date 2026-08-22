import type { ReactNode } from "react";
import Button from "@/components/Button";
import styles from "./PageCta.module.css";

type PageCtaProps = {
  title: ReactNode;
  description?: ReactNode;
  buttonLabel: ReactNode;
  href: string;
};

// Shared closing CTA section used at the end of standalone pages (About,
// Services, ...) that render their own closing CTA instead of the global
// ClosingCta (see the pathname check in ClosingCta.tsx). Centralizing the
// markup/styling here keeps the look unified and makes future styling
// changes a single edit instead of one per page.
export default function PageCta({ title, description, buttonLabel, href }: PageCtaProps) {
  return (
    <section className={`section ${styles.cta}`}>
      <div className={`container ${styles.ctaInner}`}>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
        <Button href={href} variant="brand">
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
