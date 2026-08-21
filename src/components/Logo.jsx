export default function Logo({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M60 10 C90 10 110 30 110 60 C110 95 85 120 60 138 C35 120 10 95 10 60 C10 30 30 10 60 10Z" fill="#0F766E"/>
      <path d="M60 18 C85 18 102 34 102 60 C102 90 80 112 60 128 C40 112 18 90 18 60 C18 34 35 18 60 18Z" fill="#134E4A"/>
      <path d="M60 42 C72 54 78 72 72 90 C66 78 54 72 42 72 C48 60 54 48 60 42Z" fill="#5EEAD4" opacity="0.9"/>
      <path d="M60 45 C63 58 64 72 60 86" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="60" cy="32" r="6" fill="#FBBF24"/>
      <circle cx="60" cy="32" r="10" fill="#FBBF24" opacity="0.15"/>
    </svg>
  )
}
