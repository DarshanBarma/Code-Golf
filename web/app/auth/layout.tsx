import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Page content */}
      <main className="pt-20">{children}</main>
    </>
  );
}
