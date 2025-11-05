// Importamos los componentes de UI que necesitamos.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction } from "lucide-react";

// Esta es la función principal que define la página de Amparos MEP.
export default function AmparosMepPage() {
  return (
    <Card>
      {/* El encabezado de la tarjeta muestra el título y la descripción de la página. */}
      <CardHeader>
        <CardTitle>Amparos MEP</CardTitle>
        <CardDescription>
          Gestión de amparos relacionados con el Ministerio de Educación Pública.
        </CardDescription>
      </CardHeader>
      {/* El contenido de la tarjeta muestra un mensaje de "En construcción". */}
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 text-center h-64">
          <Construction className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Página en Construcción</h2>
          <p className="text-muted-foreground">
            Estamos trabajando para traer esta sección lo antes posible.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
