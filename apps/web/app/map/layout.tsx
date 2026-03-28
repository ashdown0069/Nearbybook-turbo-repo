import NaverMapProvider from "./_components/NaverMapProvider";

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NaverMapProvider>{children}</NaverMapProvider>;
}
