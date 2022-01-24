export default function Ship() {
  const body = new Array(3).fill(false);
  const { length } = body;
  const hit = (position) => {
    if (body[position]) return false;
    body[position] = true;
    return body[position];
  };
  const isSunk = () => body.every((part) => part);
  return { length, hit, isSunk };
}
