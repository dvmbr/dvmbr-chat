export default function EntryLoading() {
  return (
    <section className="flex h-full flex-col overflow-y-auto">
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="mb-4 text-center">
          Hi! It&apos;s Dvmbr Chat!
          <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
        </h1>
        <p>
          This is a chat application built with Next.js, Tailwind CSS, and
          shadcn/ui.
        </p>
      </div>
    </section>
  );
}
