import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Large, Subheading } from "@/components/ui/typography";

export const Header = () => {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <Large>Products</Large>
        <Subheading>Manage your products </Subheading>
      </div>
      <Button
        nativeButton={false}
        render={
          <Link href={"/products/create"}>
            <PlusIcon className="size-4" />
            New Product
          </Link>
        }
      ></Button>
    </div>
  );
};
