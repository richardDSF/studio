'use client';
import React, { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle, Loader2, AlertCircle, Filter, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

// Importamos la conexión real y los tipos
import api from '@/lib/axios';
import { type Client, type Lead, type User } from '@/lib/data';

type LeadStatus = {
    id: number;
    name: string;
};

export default function ClientesPage() {
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [activeTab, setActiveTab] = useState("leads");
  const [activeFilter, setActiveFilter] = useState<string>("all"); // Active/Inactive
  const [searchQuery, setSearchQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Shared state for specific status
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Lists for Dropdowns
  const [agents, setAgents] = useState<User[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);

  // Fetch Lists (Agents & Statuses) once
  useEffect(() => {
    const fetchLists = async () => {
        try {
            const [resAgents, resStatuses] = await Promise.all([
                api.get('/api/agents'),
                api.get('/api/lead-statuses')
            ]);
            setAgents(resAgents.data);
            setLeadStatuses(resStatuses.data);
        } catch (err) {
            console.error("Error loading lists:", err);
        }
    };
    fetchLists();
  }, []);

  // Fetch Data when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const commonParams: any = {};
        if (activeFilter !== "all") commonParams.is_active = activeFilter === "active" ? 1 : 0;
        if (searchQuery) commonParams.q = searchQuery;
        if (agentFilter !== "all") commonParams.assigned_to_id = agentFilter;
        if (dateFrom) commonParams.date_from = dateFrom;
        if (dateTo) commonParams.date_to = dateTo;

        // Prepare specific params
        const leadParams = { ...commonParams };
        const clientParams = { ...commonParams };

        if (statusFilter !== "all") {
            if (activeTab === "leads") {
                leadParams.lead_status_id = statusFilter;
            } else {
                clientParams.status = statusFilter;
            }
        }

        // Hacemos las peticiones paralelas
        const [resClients, resLeads] = await Promise.all([
          api.get('/api/clients', { params: clientParams }),
          api.get('/api/leads', { params: leadParams })
        ]);

        // Manejo robusto de la respuesta (por si viene paginada o no)
        const clientsArray = resClients.data.data || resClients.data;
        const leadsArray = resLeads.data.data || resLeads.data;

        setClientsData(Array.isArray(clientsArray) ? clientsArray : []);
        setLeadsData(Array.isArray(leadsArray) ? leadsArray : []);

      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error de conexión. Verifica que el backend esté corriendo.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
        fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchQuery, agentFilter, statusFilter, activeTab, dateFrom, dateTo]);

  // Reset specific status filter when switching tabs
  const handleTabChange = (value: string) => {
      setActiveTab(value);
      setStatusFilter("all");
  };

  if (error) return <div className="p-8 text-center text-destructive">{error}</div>;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
            <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Agregar
                </Button>
            </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/20 rounded-lg border">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar por nombre, cédula..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Estado Global" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos (Act/Inact)</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
            </Select>

            <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Agente Asignado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los Agentes</SelectItem>
                    {agents.map(agent => (
                        <SelectItem key={agent.id} value={String(agent.id)}>{agent.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
                <Input 
                    type="date" 
                    value={dateFrom} 
                    onChange={(e) => setDateFrom(e.target.value)} 
                    className="w-[140px]"
                    placeholder="Desde"
                />
                <Input 
                    type="date" 
                    value={dateTo} 
                    onChange={(e) => setDateTo(e.target.value)} 
                    className="w-[140px]"
                    placeholder="Hasta"
                />
            </div>

            {activeTab === "leads" ? (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Estado del Lead" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los Estados</SelectItem>
                        {leadStatuses.map(status => (
                            <SelectItem key={status.id} value={String(status.id)}>{status.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Estado del Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los Estados</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                        <SelectItem value="Cliente Premium">Cliente Premium</SelectItem>
                        <SelectItem value="Prospecto">Prospecto</SelectItem>
                        <SelectItem value="Descartado">Descartado</SelectItem>
                    </SelectContent>
                </Select>
            )}
        </div>
      </div>

      <TabsContent value="leads">
        <Card>
          <CardHeader>
            <CardTitle>Leads ({leadsData.length})</CardTitle>
            <CardDescription>Gestiona los leads o clientes potenciales.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div> : <LeadsTable data={leadsData} />}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="clientes">
        <Card>
          <CardHeader>
            <CardTitle>Clientes ({clientsData.length})</CardTitle>
            <CardDescription>Gestiona los clientes existentes.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div> : <ClientsTable data={clientsData} />}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// --- Componentes de Tabla ---

function ClientsTable({ data }: { data: Client[] }) {
    if (data.length === 0) return <div className="text-center p-4 text-muted-foreground">No hay clientes registrados.</div>;

    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead className="hidden md:table-cell">Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${client.name}`} />
                      <AvatarFallback>{client.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{client.name}</div>
                  </div>
                </TableCell>
                <TableCell>{client.cedula}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm text-muted-foreground">{client.email}</div>
                  <div className="text-sm text-muted-foreground">{client.phone}</div>
                </TableCell>
                <TableCell>
                    <Badge variant={client.status === 'Activo' ? "default" : "secondary"}>
                        {client.status || (client.is_active ? 'Activo' : 'Inactivo')}
                    </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    )
}

function LeadsTable({ data }: { data: Lead[] }) {
    if (data.length === 0) return <div className="text-center p-4 text-muted-foreground">No hay leads registrados.</div>;

    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead className="hidden md:table-cell">Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${lead.name}&background=random`} />
                        <AvatarFallback>{lead.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{lead.name}</div>
                  </div>
                </TableCell>
                <TableCell>{lead.cedula}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">
                        {lead.lead_status?.name || lead.lead_status_id || 'Nuevo'}
                    </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>Convertir a Cliente</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    );
}