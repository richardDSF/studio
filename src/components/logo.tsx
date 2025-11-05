// Este componente representa el logo de la aplicación.
export function Logo() {
  // La función devuelve el JSX (la estructura HTML) del logo.
  return (
    // 'div' es el contenedor principal del logo.
    // 'flex items-center gap-2' son clases de Tailwind CSS para alinear el ícono y el texto.
    <div className="flex items-center gap-2">
      {/* En lugar de un ícono, mostramos las iniciales "DSF" */}
      <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-primary-foreground font-bold">
        DSF
      </div>
      {/* 'span' contiene el nombre de la aplicación, con un estilo específico. */}
      <span className="font-headline text-lg font-semibold">
        DSF Admin
      </span>
    </div>
  );
}
