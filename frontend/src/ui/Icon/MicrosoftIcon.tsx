export default function MicrosoftIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="9.5" height="9.5" fill="#f25022" rx="1" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7fba00" rx="1" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00a4ef" rx="1" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#ffb900" rx="1" />
    </svg>
  );
}
