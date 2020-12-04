export type Tool = {
  isColor: boolean;
  icon?: string;
}

export type Tools = {
  [key: string]: Tool;
}
