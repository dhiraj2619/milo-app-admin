import "./globals.css";
export const metadata = {
  title: "MILO Admin",
  description: "MILO administration dashboard",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
