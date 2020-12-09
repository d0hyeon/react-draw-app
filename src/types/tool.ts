export type Tool = {
  isColor: boolean;
  icon?: string;
};

export type ToolLiteral = 'pen';
export type Tools = {
  [key: string]: Tool;
};
export type Colors = [string, string];
