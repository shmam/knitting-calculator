import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Section({
  idx,
  initialCount = 0,
  initialIncr = 0,
  onChange,
}: {
  idx: number;
  initialCount?: number;
  initialIncr?: number;
  onChange: (sectionIdx: number, count: number, increment: number) => void;
}) {
  const [count, setCount] = useState(initialCount);
  const [increment, setIncrement] = useState(initialIncr);
  const [isEditingCount, setIsEditingCount] = useState(false);

  const handleEdit = () => {
    setIsEditingCount(!isEditingCount);
  };

  useEffect(() => {
    setCount(initialCount);
    setIncrement(initialIncr);
  }, [initialCount, initialIncr]);

  useEffect(() => {
    console.log("saving data");
    onChange(idx, count, increment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, increment, isEditingCount]);

  return (
    <div className={styles.section}>
      {isEditingCount ? (
        <div>
          <input
            className={styles.sectionCount}
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          />
          <button onClick={handleEdit}>save</button>
        </div>
      ) : (
        <p className={styles.sectionCount} onClick={handleEdit}>
          {count}
        </p>
      )}
      <p className={styles.sectionIncrementLabel}>increments by</p>
      <button onClick={() => setIncrement(increment - 1)}>-</button>
      <input
        className={styles.sectionIncrementInput}
        type="text"
        value={increment}
        readOnly
        disabled
      />
      <button onClick={() => setIncrement(increment + 1)}>+</button>
    </div>
  );
}
