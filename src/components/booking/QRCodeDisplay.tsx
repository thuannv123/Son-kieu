"use client";

import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <div className="inline-block rounded-xl bg-white p-4 shadow-inner ring-1 ring-gray-100">
      <QRCode value={value} size={size} />
    </div>
  );
}
