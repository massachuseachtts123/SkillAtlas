// Monochrome technology marks - one consistent visual grammar: simplified
// single-color brand geometry, currentColor, no emoji, no mixed stroke styles.

type IconProps = { className?: string }

const S = ({ className, children }: IconProps & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    {children}
  </svg>
)

const ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  react: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4.1" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="12" cy="12" rx="10" ry="4.1" stroke="currentColor" strokeWidth="1.3" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.1" stroke="currentColor" strokeWidth="1.3" transform="rotate(120 12 12)" />
    </svg>
  ),
  javascript: ({ className }) => (
    <S className={className}>
      <path d="M3 3h18v18H3V3Zm10.1 13.9c.4.7 1 1.2 2 1.2 1.7 0 2.7-.8 2.7-2.2 0-1.3-.7-1.9-2-2.5l-.4-.2c-.6-.3-.9-.4-.9-.9 0-.4.3-.7.8-.7.5 0 .8.2 1.1.8l1.2-.8c-.5-.9-1.2-1.2-2.3-1.2-1.4 0-2.4.9-2.4 2.1 0 1.3.7 1.9 1.9 2.4l.4.2c.7.3 1 .5 1 1 0 .4-.3.7-1 .7s-1.1-.4-1.4-1l-1.2.7Zm-4.6-.1c.5.5 1.1.7 1.9.7 1.4 0 2.3-.7 2.3-2v-4.6h-1.4V15.4c0 .7-.3 1-1 1s-1-.4-1.3-1L7.5 16.8Z" />
    </S>
  ),
  python: ({ className }) => (
    <S className={className}>
      <path d="M11.9 2c-1.7 0-3.2.2-4.3.5C5.9 3 5.6 3.9 5.6 5.4V8h6.3v1H4.1c-1.6 0-3 1-3.4 2.9-.5 2.1-.5 3.4 0 5.6C1 19.2 2 20.3 3.6 20.3h2.4v-3c0-1.7 1.5-3.2 3.3-3.2h5.5c1.5 0 2.7-1.2 2.7-2.6V5.4c0-1.4-1.2-2.5-2.7-2.7-1-.2-1.9-.3-2.9-.7ZM9.1 4.3c.5 0 .9.4.9 1 0 .5-.4.9-.9.9-.5 0-.9-.4-.9-1 0-.5.4-.9.9-.9Zm8.9 2.4v2.9c0 1.8-1.5 3.3-3.3 3.3h-5.5c-1.4 0-2.7 1.2-2.7 2.6v5.5c0 1.4 1.2 2.3 2.7 2.7 1.8.5 3.5.6 5.5 0 1.3-.4 2.7-1.1 2.7-2.7V18h-6.3v-1h9c1.6 0 2.1-1 2.7-2.5.5-1.7.5-3.3 0-5.6-.4-1.8-1.4-3-3-3h-2.1Zm-3.4 12.9c.5 0 .9.4.9.9 0 .6-.4 1-.9 1-.5 0-.9-.4-.9-1 0-.5.4-.9.9-.9Z" />
    </S>
  ),
  "node.js": ({ className }) => (
    <S className={className}>
      <path d="M12 1.9 2.6 7.3v9.4L12 22.1l9.4-5.4V7.3L12 1.9Zm0 2.3 7.4 4.3v7.4L12 20.2l-7.4-4.3V8.5L12 4.2Zm-2.5 6v3.9c0 .9.7 1.5 1.6 1.5.9 0 1.6-.6 1.6-1.5v-2.4h1.1v2.4c0 1.5-1.2 2.6-2.7 2.6s-2.7-1.1-2.7-2.6v-3.9h1.1Zm5.6 0h1.1v5.4c0 1.5-1.2 2.6-2.7 2.6-.2 0-.4 0-.5-.1l.4-1.1c.9 0 1.7-.6 1.7-1.5V10.2Z" />
    </S>
  ),
  mongodb: ({ className }) => (
    <S className={className}>
      <path d="M12 1.8c-.2 1.5-.6 2.6-1.4 3.7-1.5 2-3.2 3.7-3.2 6.5 0 2.9 2 5.4 4.1 6.1l.1 1.9c0 .3.2.5.4.5s.4-.2.4-.5l.1-1.9c2.2-.8 4.1-3.3 4.1-6.2 0-2.8-1.7-4.4-3.2-6.4-.8-1.1-1.2-2.2-1.4-3.7Zm.4 14.9c-.1 0-.2-.1-.2-.2l.2-6.6c0-.1.1-.2.2-.2s.2.1.2.2l.2 6.6c0 .1-.1.2-.2.2h-.4Z" />
    </S>
  ),
  firebase: ({ className }) => (
    <S className={className}>
      <path d="M4.2 17.1 6.4 2.6c.1-.5.7-.6 1-.2l2.3 4.3 1-1.9c.2-.4.7-.4.9 0l5.2 9.7-11.4 4.4c-.8.3-1.6-.1-1.8-.9-.2-.3-.4-.6-.4-.9Zm13.9-1.9 1.7-10.5c0-.5-.6-.7-.8-.3l-2.5 4.7 1.6 6.1Zm-9.6 4.5 8.3-3.2-2.4-4.6-5.9 7.8Z" />
    </S>
  ),
  flask: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M10 3h4M11 3v5.5a6 6 0 0 1-3.4 5.4A4.5 4.5 0 0 0 5 18a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3 4.5 4.5 0 0 0-2.6-4.1A6 6 0 0 1 13 8.5V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="17.5" r="1.1" fill="currentColor" />
    </svg>
  ),
  html: ({ className }) => (
    <S className={className}>
      <path d="M3.5 3h17l-1.5 16.5L12 21.5l-7-2L3.5 3Zm3.6 4.5.3 2.5h8.4l-.3 2.6H9.6l.3 2.6 2.1.6 2.1-.6.3-1.4h2.2l-.5 3.2L12 18.9l-4.1-1.1-.5-4.7-.2-1.9-.5-3.7h9.6l-.2 1.9H7.1Z" />
    </S>
  ),
  css: ({ className }) => (
    <S className={className}>
      <path d="M3.5 3h17L19 19.5 12 21.5l-7-2L3.5 3Zm3.6 4.5.3 2.5h8.4l-.3 2.6H9.6l.2 2.1 2.2.6 2.2-.6.2-1.3h2.2l-.4 3.1L12 17.6l-4-.8-.4-3.7-.2-2.1-.4-3.5H7.1Z" />
    </S>
  ),
  git: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="7" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 7.5v9M17 11.5c0 3-3 4-6.5 4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  docker: ({ className }) => (
    <S className={className}>
      <path d="M4 13h2.4v2.3H4V13Zm3.4 0h2.4v2.3H7.4V13Zm3.4 0H13.2v2.3h-2.4V13Zm-3.4-3.3h2.4V12H7.4V9.7Zm3.4 0h2.4V12h-2.4V9.7Zm3.4 0h2.4V12h-2.4V9.7Zm3.3.3c.8.6 1.2 1.5 1.1 2.7-.1 2.3-1.9 4.4-4.7 4.4H4.6C4.2 17 3.6 15 4.5 14c.3-.4.7-.5 1-.5h.5V16h1V9.4h2.4v-1c0-.3.2-.4.4-.4h.6v2h2.4v-2h-2.4v-2h2.4v2h2.4V6h2v3.3c.5.1 1 .3 1.4.7Z" />
    </S>
  ),
}
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const key = name.trim().toLowerCase()
  const Cmp = ICONS[key] ?? ICONS.default
  return <Cmp className={className} />
}

ICONS.default = ({ className }: IconProps) => (
  <S className={className}>
    <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9 15V9l6 6V9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </S>
)
