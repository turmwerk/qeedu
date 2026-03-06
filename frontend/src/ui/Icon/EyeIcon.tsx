export default function EyeIcon({ on }: { on?: boolean }) {
  return (
    <svg className="block" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {on ? (
        <>
          <path d="M2.2 12c1.9-4.7 5.4-7.5 9.8-7.5S19.9 7.3 21.8 12c-1.9 4.7-5.4 7.5-9.8 7.5S4.1 16.7 2.2 12Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
        </>
      ) : (
        <>
          <path d="M3 12c2.1-4.7 5.6-7.5 9-7.5 3.4 0 6.9 2.8 9 7.5-2.1 4.7-5.6 7.5-9 7.5-3.4 0-6.9-2.8-9-7.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
