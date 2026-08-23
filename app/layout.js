import "./globals.css"

export const metadata = {
  title: "SkillAtlas — Your technical journey, mapped.",
  description: "SkillAtlas connects your projects, technologies, learning, experience, achievements, and evidence into one living technical profile."
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
