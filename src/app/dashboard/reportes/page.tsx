// Importamos los componentes de UI que necesitamos.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction } from "lucide-react";

// Esta es la función principal que define la página de Reportes.
export default function ReportesPage() {
  return (
    <Card>
      {/* El encabezado de la tarjeta muestra el título y la descripción de la página. */}
      <CardHeader>
        <CardTitle>Reportes</CardTitle>
        <CardDescription>
          Visualización y generación de reportes.
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
