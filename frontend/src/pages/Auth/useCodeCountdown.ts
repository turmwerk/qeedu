import { useCallback, useEffect, useState } from "react";

const CODE_COOLDOWN_SECONDS = 60;

export function useCodeCountdown() {
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const run = useCallback(
    async (send: () => Promise<void>) => {
      if (sending || cooldown > 0) return false;
      setSending(true);
      try {
        await send();
        setCooldown(CODE_COOLDOWN_SECONDS);
        return true;
      } finally {
        setSending(false);
      }
    },
    [cooldown, sending],
  );

  return { cooldown, sending, run };
}
