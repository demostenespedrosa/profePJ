export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
      <div>
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Olá, Professor(a)!
        </h1>
        <p className="text-sm text-muted-foreground">Aqui está seu resumo de hoje.</p>
      </div>
    </header>
  );
}
