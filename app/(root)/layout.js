import { Inter } from "next/font/google";
import "../globals.css";
import Provider from "@components/Provider";
import TopBar from "@components/TopBar";
import BottomBar from "@components/BottomBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Convonest",
  description: "A Next.js 14 Chat App ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  <body
className={`${inter.className}`}
style={{
  backgroundImage: 'url("/assets/black.avif")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 1.0)', // Adjust the last value (0.5) to change opacity
}}
>
  



        <Provider>
          <TopBar />
         
            {children}
          
          <BottomBar />
        </Provider>
      </body>
    </html>
  );
}
