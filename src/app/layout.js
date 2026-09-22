import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: "MILO Admin",
  description: "MILO administration dashboard",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
