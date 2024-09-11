import { ReactNode } from "react";
import "../styles/globals.css";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <html>
      <head>
        <title>{title || "Tiêu đề mặc định"}</title>
        <link
          rel="icon"
          href="https://firebasestorage.googleapis.com/v0/b/ptit-b42bf.appspot.com/o/images%2Fanh%20gau.jpg?alt=media&token=fe503724-0a84-4086-9d56-acb2fc1f976e"
          type="text"
        />
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
