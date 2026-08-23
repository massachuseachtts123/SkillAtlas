import "./globals.css"
import { Providers } from "./providers"

export const metadata = {
  title: "SkillAtlas — Your technical journey, mapped.",
  description: "SkillAtlas connects your projects, technologies, learning, experience, achievements, and evidence into one living technical profile."
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('skillatlas-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    // Default to dark if no preference stored
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('skillatlas-theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}