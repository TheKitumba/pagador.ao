"use client";

import {
  type Announcements,
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  type UniqueIdentifier,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { pipelineStages } from "@/mocks/people";
import { toastService } from "@/services/toast.service";

import { type Candidate, CandidateCardFace, CandidateSheet } from "./candidate-card";

/** Stage → candidate ids, in board order. */
type Columns = Record<string, string[]>;

// Column drop zones are prefixed so they can never collide with a candidate id.
const COLUMN = "stage:";
const columnId = (stage: string) => `${COLUMN}${stage}`;

const toColumns = (candidates: Candidate[]): Columns =>
  Object.fromEntries(pipelineStages.map((stage) => [stage, candidates.filter((candidate) => candidate.stage === stage).map((candidate) => candidate.name)]));

const stageIn = (columns: Columns, id: string) => Object.keys(columns).find((stage) => columns[stage].includes(id)) ?? "";

/**
 * Recruitment pipeline as a drag-and-drop board. Mouse and touch use dnd-kit; the keyboard is handled
 * here as direct moves (Space lifts, arrows move between and within stages, Space or Enter drops,
 * Escape cancels), because dnd-kit's keyboard sensor spends arrow presses scrolling the board first.
 * Every move is announced to screen readers. Candidates are keyed by name in the fixtures.
 */
export function CandidateBoard({ initialCandidates }: { initialCandidates: Candidate[] }) {
  const [candidates, setCandidates] = useState(() => new Map(initialCandidates.map((candidate) => [candidate.name, candidate])));
  const [columns, setColumns] = useState<Columns>(() => toColumns(initialCandidates));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  // Where the dragged card started, to restore on cancel and to tell a stage change from a reorder.
  const dragStart = useRef<{ stage: string; columns: Columns } | null>(null);
  // A drag ends with a mouseup; the click that may follow must not open the candidate.
  const justDropped = useRef(false);
  // Keyboard move in progress: the lifted card and the board as it was, for Escape.
  const [lifted, setLifted] = useState<{ id: string; stage: string; columns: Columns } | null>(null);
  const [message, setMessage] = useState("");

  const sensors = useSensors(
    // A plain click still opens the candidate: dragging starts only after the pointer moves.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // On touch, a short press starts dragging so a swipe still scrolls the board sideways.
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  );

  const stageOf = (id: UniqueIdentifier | undefined): string | undefined => {
    if (id === undefined) return undefined;
    const key = String(id);
    if (key.startsWith(COLUMN)) return key.slice(COLUMN.length);
    return Object.keys(columns).find((stage) => columns[stage].includes(key));
  };

  const nameOf = (id: UniqueIdentifier) => candidates.get(String(id))?.name ?? String(id);

  /** Commits a stage change made by dragging or from the candidate sheet. */
  const commitStage = (id: string, stage: string) => {
    setCandidates((current) => {
      const candidate = current.get(id);
      if (!candidate || candidate.stage === stage) return current;
      return new Map(current).set(id, { ...candidate, stage });
    });
    toastService.success("Candidato movido", `${nameOf(id)} → ${stage}`);
  };

  /** From the sheet: move to the end of the target stage. */
  const moveFromSheet = (id: string, stage: string) => {
    setColumns((current) => {
      const from = Object.keys(current).find((key) => current[key].includes(id));
      if (!from || from === stage) return current;
      return { ...current, [from]: current[from].filter((item) => item !== id), [stage]: [...current[stage], id] };
    });
    commitStage(id, stage);
  };

  // A card moved by keyboard remounts in its new column: keep focus on it and keep it in view.
  useEffect(() => {
    if (!lifted) return;
    const node = document.querySelector<HTMLElement>(`[data-candidate-id="${window.CSS.escape(lifted.id)}"]`);
    if (node && document.activeElement !== node) node.focus();
    node?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [columns, lifted]);

  const where = (cols: Columns, id: string) => {
    const stage = stageIn(cols, id);
    return { stage, index: cols[stage].indexOf(id), count: cols[stage].length };
  };

  /** Keyboard handling for a focused card. */
  const onCardKeyDown = (id: string, event: KeyboardEvent<HTMLElement>) => {
    const name = nameOf(id);

    if (!lifted) {
      if (event.key === "Enter") {
        event.preventDefault();
        setOpenId(id);
      } else if (event.key === " ") {
        event.preventDefault();
        const at = where(columns, id);
        setLifted({ id, stage: at.stage, columns });
        setMessage(`Pegou em ${name}, na fase ${at.stage}, posição ${at.index + 1} de ${at.count}. Setas para mover, Espaço para largar, Escape para cancelar.`);
      }
      return;
    }
    if (lifted.id !== id) return;

    const at = where(columns, id);
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight": {
        event.preventDefault();
        const target = pipelineStages[pipelineStages.indexOf(at.stage as (typeof pipelineStages)[number]) + (event.key === "ArrowRight" ? 1 : -1)];
        if (!target) {
          setMessage(`${name} já está na ${event.key === "ArrowRight" ? "última" : "primeira"} fase.`);
          return;
        }
        const items = [...columns[target]];
        const index = Math.min(at.index, items.length);
        items.splice(index, 0, id);
        setColumns({ ...columns, [at.stage]: columns[at.stage].filter((item) => item !== id), [target]: items });
        setMessage(`${name}: fase ${target}, posição ${index + 1} de ${items.length}.`);
        return;
      }
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        const index = at.index + (event.key === "ArrowDown" ? 1 : -1);
        if (index < 0 || index >= at.count) {
          setMessage(`${name} já está ${index < 0 ? "no topo" : "no fim"} da fase ${at.stage}.`);
          return;
        }
        setColumns({ ...columns, [at.stage]: arrayMove(columns[at.stage], at.index, index) });
        setMessage(`${name}: fase ${at.stage}, posição ${index + 1} de ${at.count}.`);
        return;
      }
      case " ":
      case "Enter":
      case "Tab": {
        // Tab drops too, so focus never leaves a card stranded mid-move.
        if (event.key !== "Tab") event.preventDefault();
        setLifted(null);
        if (at.stage !== lifted.stage) commitStage(id, at.stage);
        setMessage(`${name} largado na fase ${at.stage}, posição ${at.index + 1} de ${at.count}.`);
        return;
      }
      case "Escape": {
        event.preventDefault();
        setColumns(lifted.columns);
        setLifted(null);
        setMessage(`Movimento cancelado. ${name} voltou à fase ${lifted.stage}.`);
        return;
      }
    }
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
    dragStart.current = { stage: stageOf(active.id) ?? "", columns };
  };

  // Moving across columns happens while dragging, so the card makes room where it will land.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    const from = stageOf(active.id);
    const to = stageOf(over?.id);
    if (!over || !from || !to || from === to) return;

    setColumns((current) => {
      const target = [...current[to]];
      const overIndex = target.indexOf(String(over.id));
      const translated = active.rect.current.translated;
      const below = overIndex >= 0 && translated !== null && translated.top > over.rect.top + over.rect.height / 2;
      target.splice(overIndex >= 0 ? overIndex + (below ? 1 : 0) : target.length, 0, String(active.id));
      return { ...current, [from]: current[from].filter((item) => item !== active.id), [to]: target };
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const id = String(active.id);
    const stage = stageOf(active.id);
    const overId = over ? String(over.id) : null;

    if (stage && overId && !overId.startsWith(COLUMN) && overId !== id) {
      setColumns((current) => {
        const items = current[stage];
        const from = items.indexOf(id);
        const to = items.indexOf(overId);
        return from >= 0 && to >= 0 ? { ...current, [stage]: arrayMove(items, from, to) } : current;
      });
    }
    if (stage && stage !== dragStart.current?.stage) commitStage(id, stage);

    setActiveId(null);
    dragStart.current = null;
    justDropped.current = true;
    setTimeout(() => (justDropped.current = false), 0);
  };

  const onDragCancel = () => {
    if (dragStart.current) setColumns(dragStart.current.columns);
    setActiveId(null);
    dragStart.current = null;
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Pegou em ${nameOf(active.id)}, na fase ${stageOf(active.id)}.`,
    onDragOver: ({ active, over }) => (over ? `${nameOf(active.id)} está sobre a fase ${stageOf(over.id)}.` : `${nameOf(active.id)} não está sobre nenhuma fase.`),
    onDragEnd: ({ active, over }) => (over ? `${nameOf(active.id)} foi largado na fase ${stageOf(over.id)}.` : `${nameOf(active.id)} foi largado.`),
    onDragCancel: ({ active }) => `Movimento cancelado. ${nameOf(active.id)} ficou na fase ${dragStart.current?.stage ?? stageOf(active.id)}.`,
  };

  const activeCandidate = activeId ? candidates.get(activeId) : undefined;
  const activeStage = activeId ? stageOf(activeId) : lifted ? stageIn(columns, lifted.id) : undefined;
  const openCandidate = openId ? (candidates.get(openId) ?? null) : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable:
              "Enter abre a ficha do candidato. Para o mover, prima Espaço, use as setas para mudar de fase (esquerda e direita) ou de posição (cima e baixo) e prima Espaço para largar. Escape cancela.",
          },
        }}
      >
        <div className="-mx-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6" role="region" aria-label="Quadro de candidatos por fase" tabIndex={0}>
          <ol className="flex min-w-max gap-4" aria-label="Fases do processo de recrutamento">
            {pipelineStages.map((stage) => (
              <StageColumn
                key={stage}
                stage={stage}
                ids={columns[stage]}
                candidates={candidates}
                highlighted={activeStage === stage}
                liftedId={lifted?.id ?? null}
                onOpen={(id) => !justDropped.current && setOpenId(id)}
                onCardKeyDown={onCardKeyDown}
              />
            ))}
          </ol>
        </div>

        <DragOverlay>
          {activeCandidate ? <CandidateCardFace candidate={activeCandidate} className="w-[17rem] rotate-[1.5deg] cursor-grabbing shadow-overlay ring-1 ring-primary/30" /> : null}
        </DragOverlay>
      </DndContext>

      <p aria-live="assertive" aria-atomic="true" className="sr-only">
        {message}
      </p>

      <CandidateSheet
        candidate={openCandidate}
        open={openId !== null}
        onOpenChange={(open) => !open && setOpenId(null)}
        onMove={(stage) => openId && moveFromSheet(openId, stage)}
      />
    </>
  );
}

function StageColumn({
  stage,
  ids,
  candidates,
  highlighted,
  liftedId,
  onOpen,
  onCardKeyDown,
}: {
  stage: string;
  ids: string[];
  candidates: Map<string, Candidate>;
  highlighted: boolean;
  liftedId: string | null;
  onOpen: (id: string) => void;
  onCardKeyDown: (id: string, event: KeyboardEvent<HTMLElement>) => void;
}) {
  // The whole column accepts drops, so an empty stage is still a target.
  const { setNodeRef } = useDroppable({ id: columnId(stage) });
  const items = useMemo(() => ids.map((id) => candidates.get(id)).filter((candidate): candidate is Candidate => Boolean(candidate)), [ids, candidates]);

  return (
    <li className={cn("flex w-72 flex-col rounded-xl border bg-muted/40 p-2 transition-colors", highlighted && "border-primary/40 bg-primary/[0.04]")}>
      <h2 className="flex items-center justify-between px-2 py-1.5 text-sm font-semibold">
        {stage}
        <span className="tabular text-xs font-normal text-muted-foreground">{items.length}</span>
      </h2>
      <SortableContext id={stage} items={ids} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="mt-1 flex min-h-24 flex-1 flex-col gap-2">
          {items.map((candidate) => (
            <SortableCandidate key={candidate.name} candidate={candidate} lifted={liftedId === candidate.name} onOpen={onOpen} onKeyDown={onCardKeyDown} />
          ))}
          {items.length === 0 && (
            <li aria-hidden className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
              {highlighted ? "Largue aqui" : "Sem candidatos"}
            </li>
          )}
        </ul>
      </SortableContext>
    </li>
  );
}

function SortableCandidate({
  candidate,
  lifted,
  onOpen,
  onKeyDown,
}: {
  candidate: Candidate;
  lifted: boolean;
  onOpen: (id: string) => void;
  onKeyDown: (id: string, event: KeyboardEvent<HTMLElement>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: candidate.name,
    attributes: { roleDescription: "candidato arrastável" },
  });

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }}>
      <div
        {...attributes}
        {...listeners}
        data-candidate-id={candidate.name}
        aria-pressed={isDragging || lifted}
        onKeyDown={(event) => onKeyDown(candidate.name, event)}
        onClick={() => onOpen(candidate.name)}
        aria-label={`${candidate.name}, ${candidate.job}, fase ${candidate.stage}`}
        className={cn(
          "cursor-grab touch-manipulation select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:cursor-grabbing",
          isDragging && "opacity-40",
        )}
      >
        <CandidateCardFace
          candidate={candidate}
          className={cn(
            "transition-[border-color,box-shadow,transform] hover:border-foreground/15",
            isDragging && "border-dashed shadow-none",
            lifted && "-translate-y-0.5 border-primary/50 shadow-overlay",
          )}
        />
      </div>
    </li>
  );
}
