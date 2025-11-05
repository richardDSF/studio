// Importamos los componentes de tarjeta (Card) para la interfaz de usuario.
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  // Esta es la función principal que define la página de Configuración.
  export default function SettingsPage() {
    // La función devuelve el contenido de la página.
    return (
      <div className="space-y-6">
        <Card>
          {/* El encabezado de la tarjeta muestra el título y la descripción de la página. */}
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>Gestiona la configuración de tu aplicación aquí.</CardDescription>
          </CardHeader>
          {/* El contenido de la tarjeta, por ahora, solo muestra un mensaje. */}
          <CardContent>
            <p>La página de configuración está en construcción.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  