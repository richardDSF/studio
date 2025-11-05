// Importamos los iconos y componentes de la interfaz de usuario que necesitamos.
import { MoreHorizontal, PlusCircle } from "lucide-react";
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
// Importamos los datos de ejemplo para las sucursales.
import { branches } from "@/lib/data";

// Esta es la función principal que define la página de Sucursales.
export default function BranchesPage() {
  // La función devuelve una tarjeta (Card) que contiene la tabla de sucursales.
  return (
    <Card>
      {/* El encabezado de la tarjeta muestra el título y un botón para agregar nuevas sucursales. */}
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Sucursales</CardTitle>
                <CardDescription>Gestiona los puntos autorizados y su información.</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Agregar Sucursal
            </Button>
        </div>
      </CardHeader>
      {/* El contenido de la tarjeta es la tabla con la lista de sucursales. */}
      <CardContent>
        <Table>
          {/* El encabezado de la tabla define las columnas. */}
          <TableHeader>
            <TableRow>
              <TableHead>Nombre de Sucursal</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="hidden md:table-cell">Gerente</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* El cuerpo de la tabla se llena con los datos de las sucursales. */}
          <TableBody>
            {/* Usamos la función 'map' para crear una fila en la tabla por cada sucursal en nuestros datos. */}
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell className="hidden md:table-cell">{branch.manager}</TableCell>
                <TableCell>
                  {/* Cada fila tiene un menú desplegable con acciones como ver detalles, editar o eliminar. */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Alternar menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
