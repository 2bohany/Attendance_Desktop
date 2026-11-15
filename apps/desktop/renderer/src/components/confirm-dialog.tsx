import { useCallback, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { t } from '@/lib/i18n';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  const locale = useAppStore((state) => state.locale);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel ?? t(locale, 'common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={buttonVariants({ variant: variant === 'destructive' ? 'destructive' : 'default' })}
          >
            {confirmLabel ?? t(locale, 'common.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type ConfirmRequest = Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>;

/** Imperative confirm: `confirm({...})` opens the dialog; render `dialog` once. */
export function useConfirm() {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);

  const confirm = useCallback((next: ConfirmRequest) => setRequest(next), []);

  const dialog = request ? (
    <ConfirmDialog
      open
      onOpenChange={(open) => {
        if (!open) setRequest(null);
      }}
      {...request}
      onConfirm={() => {
        request.onConfirm();
        setRequest(null);
      }}
    />
  ) : null;

  return { confirm, dialog };
}
