"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const MIN = 24;
const MAX = 72;
const DURATION_MS = 2800;

export default function ProgressBlock() {
  const [percent, setPercent] = useState(MIN);

  useEffect(() => {
    let start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = (now - start) % (DURATION_MS * 2);
      const half = DURATION_MS;
      const t =
        elapsed < half
          ? elapsed / half
          : 2 - elapsed / half;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setPercent(Math.round(MIN + (MAX - MIN) * eased));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressBar}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className={styles.progressMeta}>
        <span className={styles.progressLabel}>Hazırlanıyor</span>
        <span className={styles.progressPercent}>%{percent}</span>
      </div>
    </div>
  );
}
