import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Section({
  idx,
  initialCount = 0,
  initialIncr = 0,
  initalChangeEvery = 1,
  onChange,
}: {
  idx: number;
  initialCount?: number;
  initialIncr?: number;
  initalChangeEvery?: number;
  onChange: (sectionIdx: number, count: number, increment: number, changeEvery: number) => void;
}) {
  const [count, setCount] = useState(initialCount);
  const [increment, setIncrement] = useState(initialIncr);
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [changeEvery, setChangeEvery] = useState(initalChangeEvery);

  const handleEdit = () => {
    setIsEditingCount(!isEditingCount);
  };

  useEffect(() => {
    setCount(initialCount);
    setIncrement(initialIncr);
    setChangeEvery(initalChangeEvery);
  }, [initialCount, initialIncr, initalChangeEvery]);

  useEffect(() => {
    console.log("saving data");
    onChange(idx, count, increment, changeEvery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, increment, isEditingCount]);

  return (
    <div className={styles.section}>
      <label>change every:</label>
      <br/>
      <input
        className={styles.changeEvery}
        type="number"
        value={changeEvery}
        onChange={(e) => setChangeEvery(parseInt(e.target.value))}
      />
      <label> rows</label>

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
      <p className={styles.sectionIncrementLabel}>increments of</p>
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
