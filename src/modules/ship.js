export default function Ship(len = 3) {
  const body = new Array(len).fill(false);

  const { length } = body;

  const hit = (position) => {
    if (body[position]) return false;
    body[position] = true;
    return body[position];
  };

  const isSunk = () => body.every((part) => part);

  return { length, hit, isSunk };
}
