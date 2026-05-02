import { Header } from "@/components/Header";

/**
 * Site público + área de convidados (lista, conta, login mágico).
 * O painel `/admin` fica fora deste grupo — não mostra o header do site.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
