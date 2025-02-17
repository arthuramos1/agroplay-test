"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { EventForm } from "@/components/event-form";
import { Edit, Trash2, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/service/axios.http";

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();

  const handleCreateEvent = async (eventData: any) => {
    const newEvent = {
      ...eventData,
      soldTickets: 0,
    };

    await createEvent(newEvent);
    await handleGetEvents();
    setIsOpen(false);
  };

  const handleGetEvents = async () => {
    const ev = await getEvents();
    setEvents(ev);
  };

  const handleUpdateEvent = async (eventData: any) => {
    const eId = eventData.id;
    delete eventData.id;

    await updateEvent(eId, eventData);
    await handleGetEvents();

    setIsOpen(false);
    setSelectedEvent(undefined);
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    await handleGetEvents();
  };

  useEffect(() => {
    handleGetEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Controle dos Eventos</h2>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vendidos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {events?.map((event: any) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event?.title}</TableCell>
                <TableCell>{formatDate(new Date(event?.date))}</TableCell>
                <TableCell>{event?.location}</TableCell>
                <TableCell>R${event?.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{event?.soldTickets} vendidos</span>
                      <span>{event?.totalTickets} total</span>
                    </div>
                    <Progress
                      value={(event?.soldTickets / event?.totalTickets) * 100}
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 ml-auto justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? "Editar Evento" : "Novo Evento"}
              </DialogTitle>
            </DialogHeader>
            <EventForm
              event={selectedEvent}
              onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
              onCancel={() => {
                setIsOpen(false);
                setSelectedEvent(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
