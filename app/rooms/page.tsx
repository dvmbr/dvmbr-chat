import prisma from "@/lib/db";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="h-full">
      <section className="container mx-auto flex h-full max-w-3xl flex-col">
        <h2 className="text-3xl font-bold">Rooms</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="bg-muted hover:bg-muted/80 rounded-lg border p-4 transition-colors"
            >
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <p className="text-muted-foreground text-sm">
                Created at: {room.createdAt.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
