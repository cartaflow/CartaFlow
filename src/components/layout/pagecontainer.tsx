import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageContainerVariants = cva("mx-auto w-full px-6 py-12", {
  variants: {
    size: {
      narrow: "max-w-lg",
      default: "max-w-3xl",
      wide: "max-w-6xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function PageContainer({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof pageContainerVariants>) {
  return <div className={cn(pageContainerVariants({ size, className }))} {...props} />;
}

export { PageContainer };
