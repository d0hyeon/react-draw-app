import { ToolComponentProps } from "src/types/toolType";
import { Brash } from "./Brash";


export function Remover (props: ToolComponentProps) {
  return (
    <Brash {...props} globalCompositeOperation="destination-out" />
  );
}

Remover.key = 'remover';
Remover.icon = 'https://img.icons8.com/ios-filled/344/ffffff/eraser.png';
Remover.Navigate = Brash.Navigate;