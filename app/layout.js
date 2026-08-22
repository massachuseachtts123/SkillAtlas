import "./globals.css"

export const metadata = {
  title: "SkillAtlas",
  description: "Turn any GitHub profile into a Technical Identity Graph and compare it against target career paths"
}

export default function RootLayout({
  children
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-background" suppressHydrationWarning>{children}</body>
    </html>
  )
}
