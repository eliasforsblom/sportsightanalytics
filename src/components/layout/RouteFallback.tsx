export const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      <p className="font-display text-sm uppercase tracking-[0.22em] text-muted-foreground">
        Loading
      </p>
    </div>
  </div>
);
