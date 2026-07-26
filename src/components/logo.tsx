import Image from "next/image";

type Props = Partial<React.ComponentProps<typeof Image>>;
export function Logo({ className, ...rest }: Props) {
  return (
    <Image
      src="/distrible.svg"
      alt="Distrible"
      width={120}
      height={38}
      priority
      className={`dark:invert ${className ?? ""}`}
      {...rest}
    />
  );
}
