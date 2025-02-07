import Image from "next/image";

export default function Logo({
  size = 100,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={size}
        height={size}
        loading="lazy"
      />
      <h1
        style={{ fontSize: `${size / 2}px` }}
        className="font-bold text-white flex"
      >
        <span className="text-secondary">Rio</span>Tube
      </h1>
    </div>
  );
}
