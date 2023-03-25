export function bufferify(hexString: string): Buffer {
  return Buffer.from(hexString, "hex");
}
