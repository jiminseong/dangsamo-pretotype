export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "danger" | "warning" | "success" | "info";
}) {
  const variants = {
    default: "badge badge-default",
    danger: "badge badge-danger",
    warning: "badge badge-warning",
    success: "badge badge-success",
    info: "badge badge-info",
  };

  return <span className={variants[variant]}>{children}</span>;
}
