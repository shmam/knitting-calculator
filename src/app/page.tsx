"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { saveData, loadData } from "./userDataService";
import type { RowData, SectionData, SessionData } from "./types";
import Help from "./help";
import Section from "./Section";
import Image from 'next/image';

export default function Home() {
  const sectionOptions = [0, 1, 2, 3, 4, 5];
  const [displayHelp, setDisplayHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<Array<SectionData>>(Array(4).fill({
    count: 0, 
    increment: 0
  }));
  const [rowCount, setRowCount] = useState(0);
  const [pastRows, setPastRows] = useState<Array<RowData>>([])

  // attempt to load user data on inital load
  useEffect(() => {
    setIsLoading(true)
    const fetchedLocalStoreData: SessionData = loadData()

    console.log(fetchedLocalStoreData)

    if (fetchedLocalStoreData === null || Object.keys(fetchedLocalStoreData).length === 0) {
      console.log("failed to load user data")
    } else {
      setSections(fetchedLocalStoreData.sections)
      setRowCount(fetchedLocalStoreData.rowCount)
      setPastRows(fetchedLocalStoreData.rows)
    }
    setIsLoading(false)
  }, [])

  function saveAllSessionData() {
    // save all session data
    saveData({
      rowCount,
      sections,
      rows: pastRows
    })
  }

  function onValueChange(sectionIdx: number, count: number, increment: number, changeEvery: number) {
    sections[sectionIdx] = {
      count, 
      increment,
      changeEvery
    }
    console.debug(sections)
    setSections(sections)
    try {
      setIsLoading(true)
      saveAllSessionData()
    } catch(e) {
      // handle errors
    } finally {
      setIsLoading(false)
    }
  }

  function onSectionChange(e: any) {
    const targetLength = Number(e.target.value)
    let newSection = new Array<SectionData>;

    // if we have to add new sections
    if (targetLength > sections.length) {     
      const del = targetLength - sections.length  
      newSection = sections.concat(Array(del).fill({
        count: 0, 
        increment: 0
      }))

    // if we have to remove a section
    } else if (targetLength < sections.length) {
      newSection = sections.slice(0,targetLength)
    }
    setSections(newSection)
    saveAllSessionData()
  }

  function rowWithIncrement() {
    sections.forEach((section) => {
      if (rowCount % section.changeEvery === 0) {
        section.count += section.increment;
      }
    });

    setSections(sections);
    setRowCount(rowCount + 1);
    const newRow: RowData = {
      index: rowCount + 1,
      values: sections.flatMap((s) => s.count)
    }
    setPastRows([newRow].concat(pastRows))
    saveAllSessionData();
  }

  function reset() {
    let length = sections.length
    setSections(new Array(length).fill({
      count: 0,
      increment: 0,
      changeEvery: 1
    }))
    setRowCount(0)
    setPastRows([])
    saveAllSessionData()
  }

  return (
    <main className={styles.main}>
      <div className={styles.titleSection}>
        <h1>🧶 grace&apos;s knitting calculator</h1>
        <button onClick={() => {setDisplayHelp(!displayHelp);}}>help?</button>
      </div>
      
      {displayHelp && <Help />}

      <div>
        {/* dropdown to select number of sections */}
        <div className={styles.config}>
          <label htmlFor="sectionCount">select number of sections: </label>
          <select
            id="sectionCount"
            value={sections.length}
            onChange={onSectionChange}
          >
            {sectionOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* row counter */}
        <p>row count: <strong>{rowCount}</strong></p>

        <div className={styles.sectionLayout}>
          {sections.map((obj, index) => (
            <Section 
              key={index}
              idx={index}
              initialCount={obj.count}
              initialIncr={obj.increment}
              initalChangeEvery={obj.changeEvery}
              onChange={onValueChange}
            />
          ))}
        </div>
        {isLoading ? <p>loading...</p> : <></>}

        <div className={styles.buttonRow}>
          <div className={styles.actionButtonRow}>
            <button onClick={rowWithIncrement}>add row ✨</button>
          </div>
          <button onClick={reset}>reset all data</button>
        </div>
      </div>

      <Row
        rows={pastRows}
      />
        

      <footer>
        <Image
          priority
          src="/github-mark.svg"
          height={16}
          width={16}
          alt="github logo"
        />
        <a href="https://github.com/shmam/knitting-calculator">github</a>
        <a href="mailto:samuel.d.crochet@gmail.com">notes?</a>
      </footer>
    </main>
  );
}

function Row({rows = []}: {rows: RowData[]}) {
  const [isDisplayRows, setIsDisplayRows] = useState(true)

  return(
    <div className={styles.rowSection}>
       <label>display rows?</label>
       <input type="checkbox" checked={isDisplayRows} onChange={() => setIsDisplayRows(!isDisplayRows)}></input>
       {isDisplayRows ? rows.map((obj, index) => (
        <div className={styles.row} key={index}>
          <p>{obj.index}</p>
          <p>{obj.values.join(',')}</p>
        </div>
       )) : <></>}
    </div>
  );

}