export interface ValidatedPdf {
  buffer: Buffer;
  size: number;
  checksum: string;
  sanitizedName: string;
}
