export default function Logo({ size = 32, className = '' }) {
  return (
    <img
      src="/logo-farol-clima.png"
      alt="Farol Clima"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
