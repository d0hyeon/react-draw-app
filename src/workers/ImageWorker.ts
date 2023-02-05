
export function getRectCoordinate (imageData: ImageData) {
  const { data, width } = imageData;
  
  let sx = Infinity, sy = Infinity;
  let sw = 0, sh = 0;
  for(let i = 0, leng = data.length; i < leng; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i+2], data[i+3]];
    const isFill = Math.max(r, g, b, a) > 0;
    
    if(isFill) {
      const y = Math.floor(Math.max(i / 4) / width);
      const x = Math.max(i / 4) - width * y;

      sx = Math.min(sx, x);
      sw = Math.max(sw, x);

      sy = Math.min(sy, y);
      sh = Math.max(sh, y);
    }
  }

  return { 
    sx: sx === Infinity ? 0 : sx, 
    sw, 
    sy: sy === Infinity ? 0 : sy, 
    sh 
  };
};