declare module 'react-speadsheet-grid' {
  type ColumnId = string
  type ColumnWidthValues = Record<ColumnId, number>

  type Column = {
    value: () => string
    id: ColumnId
    title?: string | (() => string)
    width?: PropTypes.number
  }
  type Row = any
  type Cell = { x: number; y: number }

  export type Grid = React.Component<{
    // required props
    columns: Column[]
    getRowKey: (row: Row) => string

    // optional props
    rows?: Row[]
    placeholder?: string
    focusOnSingleClick?: boolean
    headerHeight?: number
    rowHeight?: number
    isScrollable?: boolean
    isColumnsResizable?: boolean
    disabledCellChecker?: (row: Row, columnId: ColumnId) => boolean
    onCellClick?: (row: Row, columnId: ColumnId) => void
    onActiveCellChanged?: (cell: Cell) => void
    onScroll?: (scrollTop: number) => void
    onScrollReachesBottom?: () => void
    onColumnResize?: (columnWidthValues: ColumnWidthValues) => void
  }>

  export type Input = React.Component<{
    value?: string | number
    placeholder?: string
    selectTextOnFocus?: boolean
    onChange?: (value: string) => void
  }>

  type SelectItem = {
    id: string | number
    value: string
  }

  export type Select = React.Component<{
    selectedId?: string | number
    items?: SelectItem[]
    placeholder?: string
    isOpen?: boolean
    onChange?: (selectedId: string | number, item: SelectItem) => void
  }>
}
