'use client';

import { MoreHorizontal, PlusCircle, Loader2, Filter } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/lib/axios";
import { type Opportunity } from "@/lib/data";

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Convertido': return 'default';
        case 'Aceptada': return 'default';
        case 'En proceso': return 'secondary';
        case 'Rechazada': return 'destructive';
        default: return 'outline';
    }
}

export default function DealsPage() {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params: any = {};
        if (statusFilter && statusFilter !== "all") {
            params.status = statusFilter;
        }

        const response = await api.get('/api/opportunities', { params });
        const opportunities = response.data.data || response.data;
        setData(Array.isArray(opportunities) ? opportunities : []);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Oportunidades</CardTitle>
                <CardDescription>Gestiona las oportunidades de clientes potenciales.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Abierta">Abierta</SelectItem>
                        <SelectItem value="En proceso">En proceso</SelectItem>
                        <SelectItem value="Aceptada">Aceptada</SelectItem>
                        <SelectItem value="Rechazada">Rechazada</SelectItem>
                        <SelectItem value="Convertido">Convertido</SelectItem>
                    </SelectContent>
                </Select>
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Agregar
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Cédula del Lead</TableHead>
                <TableHead>Monto Solicitado</TableHead>
                <TableHead>Tipo de Crédito</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Fecha de Inicio</TableHead>
                <TableHead className="hidden md:table-cell">Asignado a</TableHead>
                <TableHead>
                    <span className="sr-only">Acciones</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                            No se encontraron oportunidades.
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((opportunity) => (
                    <OpportunityTableRow key={opportunity.id} opportunity={opportunity} />
                    ))
                )}
            </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>
  );
}

const OpportunityTableRow = React.memo(function OpportunityTableRow({ opportunity }: { opportunity: Opportunity }) {
  // Fallback for legacy vs new API fields
  const leadCedula = opportunity.lead_cedula || opportunity.leadCedula || 'N/A';
  const amount = opportunity.amount;
  const type = opportunity.opportunity_type || opportunity.creditType || 'N/A';
  const status = opportunity.status;
  const date = opportunity.created_at ? new Date(opportunity.created_at).toLocaleDateString() : (opportunity.startDate || 'N/A');
  const assignedTo = opportunity.user?.name || opportunity.assignedTo || 'Sin asignar';

  return (
    <TableRow>
      <TableCell className="font-medium">{leadCedula}</TableCell>
      <TableCell>
        ₡{amount?.toLocaleString('de-DE') || 0}
      </TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(status)}>{status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{date}</TableCell>
      <TableCell className="hidden md:table-cell">{assignedTo}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Alternar menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>Ver Detalle</DropdownMenuItem>
            <DropdownMenuItem>Convertir a Crédito</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

/**
 * Función para obtener la variante de color de la insignia según el estado de la oportunidad.
 * @param {Opportunity['status']} status - El estado de la oportunidad.
 * @returns {'default' | 'secondary' | 'destructive' | 'outline'} La variante de color para el Badge.
 */
const getStatusVariant = (status: Opportunity['status']) => {
    switch (status) {
        case 'Convertido': return 'default';
        case 'Aceptada': return 'default';
        case 'En proceso': return 'secondary';
        case 'Rechazada': return 'destructive';
        default: return 'outline';
    }
}


/**
 * Esta es la función principal que define la página de Oportunidades.
 * Muestra una lista de todas las oportunidades de crédito en una tabla.
 */
export default function DealsPage() {
  return (
    <Card>
      {/* El encabezado de la tarjeta con título, descripción y botón para agregar. */}
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Oportunidades</CardTitle>
                <CardDescription>Gestiona las oportunidades de clientes potenciales.</CardDescription>
            </div>
            {/* $$$ CONECTOR MYSQL: La acción de este botón creará un nuevo registro en la tabla de oportunidades. */}
            <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Agregar Oportunidad
            </Button>
        </div>
      </CardHeader>
      {/* El contenido de la tarjeta es la tabla con la lista de oportunidades. */}
      <CardContent>
        <Table>
          {/* El encabezado de la tabla define las columnas. */}
          <TableHeader>
            <TableRow>
              <TableHead>Cédula del Lead</TableHead>
              <TableHead>Monto Solicitado</TableHead>
              <TableHead>Tipo de Crédito</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Fecha de Inicio</TableHead>
              <TableHead className="hidden md:table-cell">Asignado a</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* El cuerpo de la tabla se llena con los datos de las oportunidades. */}
          <TableBody>
            {/* $$$ CONECTOR MYSQL: Se itera sobre la lista de oportunidades. Esto será una consulta a la base de datos (SELECT * FROM oportunidades). */}
            {opportunities.map((opportunity) => (
              <OpportunityTableRow key={opportunity.id} opportunity={opportunity} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/**
 * Componente que renderiza una única fila de la tabla de oportunidades.
 * Usamos React.memo para optimizar el rendimiento, evitando que se vuelva a renderizar si sus props no cambian.
 * @param {{ opportunity: Opportunity }} props - Las propiedades del componente, que incluyen un objeto de oportunidad.
 */
const OpportunityTableRow = React.memo(function OpportunityTableRow({ opportunity }: { opportunity: Opportunity }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{opportunity.leadCedula}</TableCell>
      <TableCell>
        ₡{opportunity.amount.toLocaleString('de-DE')}
      </TableCell>
      <TableCell>{opportunity.creditType}</TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(opportunity.status)}>{opportunity.status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{opportunity.startDate}</TableCell>
      <TableCell className="hidden md:table-cell">{opportunity.assignedTo}</TableCell>
      <TableCell>
        {/* Menú desplegable con acciones para cada oportunidad. */}
        {/* $$$ CONECTOR MYSQL: Las acciones de este menú (convertir, editar, eliminar) afectarán los registros en la base de datos. */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Alternar menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>Ver Detalle</DropdownMenuItem>
            <DropdownMenuItem>Convertir a Crédito</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});
