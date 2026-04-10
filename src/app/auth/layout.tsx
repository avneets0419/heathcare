export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] p-6 md:p-10 dark:bg-[#0f172a]">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
