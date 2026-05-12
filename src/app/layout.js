import Head from 'next/head';
import Script from 'next/script';



export const metadata = {
  title: "Auctus - IT Solutions for Growing Businesses",
  description: "IT Solutions for Growing Businesses",
  icons: {
    icon: "/assets/images/fav.png", // Ensure the path is correct
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Auctus - IT Solutions for Growing Businesses</title>
        <meta name="author" content="Auctus Technologies" />
        <meta name="description" content="Auctus - IT Solutions for Growing Businesses" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/images/fav.png" />
      </Head>
      <body className='index-one'>
        {children}
        <Script
          src="/assets/js/plugins/smooth-scroll.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
