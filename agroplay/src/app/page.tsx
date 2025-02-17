import { EventList } from "@/components/event-list";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-2">Próximo Eventos</h2>
      <EventList />
    </div>
  );
}
