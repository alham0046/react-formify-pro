// types/arrayTypes.ts
export interface AddArgs {
    index?: number;
    count?: number;
    initialValue?: Record<string, any>[] | Record<string, any>;
}

export interface ArrayController {
  readonly length: number;
  add: (args?: AddArgs) => void;
  remove: (index: number) => void;
  clear: () => void;
}