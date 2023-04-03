import QRCode from "qrcode";

export async function generateQrCodeImage(
  stringifyData: string
): Promise<string> {
  if (!stringifyData) {
    return "";
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(stringifyData);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error(`Error generating QR code image: ${error}`);
  }
}
