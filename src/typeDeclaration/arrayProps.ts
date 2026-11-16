// types/arrayTypes.ts

type IndexedItem = { index: number } & Record<string, any>;

export interface AddArgs {
    index?: number;
    count?: number;
    initialValue?: Record<string, any>[] | Record<string, any> | IndexedItem[];
}

export interface ArrayController {
  readonly length: number;
  add: (args?: AddArgs) => void;
  remove: (index: number) => void;
  clear: () => void;
  // currentIndex: number | undefined
}