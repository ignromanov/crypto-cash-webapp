import QRCode from "qrcode";

export async function generateQrCodeImage(data: string): Promise<string> {
  if (!data) {
    return "";
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error: any) {
    throw new Error(`Error generating QR code image: ${error.message}`);
  }
}
