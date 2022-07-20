export function generateString(totalLength: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = ' ';
  const charactersLength = characters.length;
  for (let count = 0; count < totalLength; count += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
