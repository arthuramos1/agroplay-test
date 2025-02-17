"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import { getEvents, updateEvent } from "@/service/axios.http";

export function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetEvents = async () => {
    try {
      const events = await getEvents();
      setEvents(events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedEvent) return;

    const updatedEvent: any = events?.find(
      (event: any) => event.id === selectedEvent.id
    );

    if (updatedEvent) {
      const payload = {
        ...updatedEvent,
        soldTickets: updatedEvent.soldTickets + ticketQuantity,
      };

      delete payload.id;

      await updateEvent(selectedEvent.id, payload);
    }

    await handleGetEvents();

    setIsModalOpen(false);
    setTicketQuantity(1);
  };

  const openPurchaseModal = (event: any) => {
    setSelectedEvent(event);
    setTicketQuantity(1);
    setIsModalOpen(true);
  };

  useEffect(() => {
    handleGetEvents();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event: any) => {
          const remainingTickets = event.totalTickets - event.soldTickets;
          const isSoldOut = remainingTickets === 0;

          return (
            <Card key={event.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className=" mb-4">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(new Date(event.date))}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Ticket className="w-4 h-4 mr-2" />
                    R${event.price.toFixed(2)}
                  </div>
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>{remainingTickets} ingressos restantes</span>
                      <span>{event.totalTickets} total</span>
                    </div>
                    <Progress
                      value={(event.soldTickets / event.totalTickets) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => openPurchaseModal(event)}
                  disabled={isSoldOut}
                >
                  {isSoldOut ? "Esgotado!" : "Comprar ingressos"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comprar Ingressos</DialogTitle>
            {selectedEvent && (
              <DialogDescription>
                {selectedEvent?.title} - R${selectedEvent?.price.toFixed(2)} por
                ingresso
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={selectedEvent.totalTickets - selectedEvent.soldTickets}
                  value={ticketQuantity}
                  onChange={(e) =>
                    setTicketQuantity(
                      Math.min(
                        Math.max(1, parseInt(e.target.value) || 1),
                        selectedEvent.totalTickets - selectedEvent.soldTickets
                      )
                    )
                  }
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Tickets Remaining</span>
                  <span>
                    {selectedEvent.totalTickets - selectedEvent.soldTickets}
                  </span>
                </div>
                <Progress
                  value={
                    (selectedEvent.soldTickets / selectedEvent.totalTickets) *
                    100
                  }
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>
                    R${(selectedEvent.price * ticketQuantity).toFixed(2)}
                  </span>
                </div>
                <Button className="w-full" onClick={handlePurchase}>
                  Comprar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
