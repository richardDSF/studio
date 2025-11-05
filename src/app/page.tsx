// Importamos componentes de UI, el componente de Imagen de Next.js y el de Enlace.
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
// Importamos un ícono de la librería lucide-react.
import { ArrowRight } from "lucide-react";
// Importamos los datos de las imágenes de marcador de posición desde un archivo JSON.
import placeholderImages from "@/lib/placeholder-images.json";

// Esta es la función principal que define la página de inicio.
export default function Home() {
  // Buscamos la imagen del héroe (hero image) en nuestro archivo JSON de imágenes.
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === "hero");

  // La función devuelve el contenido JSX que se renderizará en la página.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        {/* Creamos una rejilla (grid) para organizar el contenido en dos columnas en dispositivos medianos y grandes. */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* La primera columna contiene el texto principal. */}
          <div className="text-center md:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
              Panel de Administración de DSF
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/80">
              Gestiona usuarios, casos y voluntarios con eficiencia y claridad. Tu centro de mando para la coordinación de ayuda legal.
            </p>
            {/* Contenedor para el botón de llamada a la acción. */}
            <div className="mt-10 flex items-center justify-center gap-x-6 md:justify-start">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Ir al Panel <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          {/* La segunda columna contiene la imagen del héroe. */}
          <div className="flex justify-center">
            {/* Solo mostramos la imagen si la encontramos en el archivo JSON. */}
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                // 'data-ai-hint' es una pista para herramientas de IA sobre el contenido de la imagen.
                data-ai-hint={heroImage.imageHint}
                // 'priority' le dice a Next.js que cargue esta imagen primero, ya que es importante.
                priority
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
