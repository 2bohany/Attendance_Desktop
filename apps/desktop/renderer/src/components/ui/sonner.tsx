import { Toaster as Sonner } from 'sonner';
import { useAppStore } from '@/stores/app-store';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const resolvedTheme = useAppStore((state) => state.resolvedTheme);
  const direction = useAppStore((state) => state.direction);

  return (
    <Sonner
      theme={resolvedTheme}
      dir={direction}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lifted group-[.toaster]:font-sans',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
