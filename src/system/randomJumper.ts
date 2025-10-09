export function RandomJumper(): number {
    const JumperEnum = [
      8,
      9,
      10,
      11,  
      12
      ];
  const randomIndex = Math.floor(Math.random() * JumperEnum.length);
  return JumperEnum[randomIndex];
}