export type SectionData = {
  count: number;
  increment: number;
};

export type RowData = {
  index: number
  values: number[];
}

export type SessionData = {
    rowCount: number;
    sections: Array<SectionData>;
    rows: Array<RowData>
}