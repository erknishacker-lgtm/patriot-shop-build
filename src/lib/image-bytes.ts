export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

export function sniffImage(bytes: Uint8Array): { mime: string; ext: string } | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { mime: "image/png", ext: "png" };
  }
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return { mime: "image/gif", ext: "gif" };
  }
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}

export function decodeBase64Bytes(value: string): Uint8Array {
  const binary = Buffer.from(value, "base64");
  return new Uint8Array(binary.buffer, binary.byteOffset, binary.byteLength);
}
