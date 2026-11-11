import { useParams } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { findEventById } from "../utils/filter-events";
import EventDetail from "../components/events/EventDetail";
import NotFoundPage from "./NotFoundPage";

// Bulur: adresteki id -> context'teki etkinlik -> EventDetail çizer
function EventDetailPage() {
  const { id } = useParams();
  const { events } = useEvents();
  const event = findEventById(events, id ?? "");
  // Sayfa ve sekme başlığını Header adresten kendisi ayarlar

  if (!event) return <NotFoundPage />;

  return (
    <>
      <h2 className="bolum-baslik">{event.title}</h2>
      <EventDetail event={event} />
    </>
  );
}

export default EventDetailPage;
