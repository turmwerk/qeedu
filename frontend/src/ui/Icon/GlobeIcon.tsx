export default function GlobeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3c-2.4 4.5-2.4 13.5 0 18M12 3c2.4 4.5 2.4 13.5 0 18M3.5 12h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.5 8.5h15M4.5 15.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
