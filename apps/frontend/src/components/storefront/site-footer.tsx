import Link from "next/link";

const footerGroups = [
  {
    title: "Shop",
    links: ["Backpacks", "Outerwear", "Camp Kitchen", "Accessories"]
  },
  {
    title: "Company",
    links: ["Journal", "Shipping", "Returns", "Support"]
  }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-[linear-gradient(180deg,transparent,rgba(225,235,227,0.7))]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Katta Adventure
          </p>
          <h2 className="mt-3 max-w-lg font-serif text-3xl tracking-tight text-foreground">
            Gear yang terasa siap pakai bahkan sebelum pendakian dimulai.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Fondasi storefront ini disiapkan untuk katalog, cart, dan integrasi backend
            berikutnya tanpa perlu bongkar ulang struktur halaman.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link href="/products" className="hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
