import { create } from "@bentoo/state-man";

const useCommandMenuStore = create(false);

/** Global search / command palette (⌘K, Ctrl+K or "/"). */
export function useCommandMenu() {
  const { state: isOpen, setState: setOpen } = useCommandMenuStore();

  return {
    isOpen,
    setOpen,
    open: () => setOpen(true),
    toggle: () => setOpen((current) => !current),
  };
}
