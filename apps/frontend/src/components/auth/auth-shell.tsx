import Link from "next/link";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLinkLabel,
  footerLinkHref
}: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid w-full gap-8 rounded-xl border border-border/70 bg-white/70 p-6 shadow-[0_16px_45px_-25px_rgba(35,56,42,0.35)] backdrop-blur-sm md:grid-cols-2 md:p-10">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account access</p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {footerText}{" "}
            <Link href={footerLinkHref} className="font-semibold text-primary hover:underline">
              {footerLinkLabel}
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-background/80 p-5 sm:p-6">{children}</div>
      </section>
    </main>
  );
}
