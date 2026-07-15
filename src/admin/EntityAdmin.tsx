import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { supabase } from "../lib/supabase";
import { uploadIcon } from "./uploadIcon";
import { EntityConfig } from "./entityConfigs";
import { Alert } from "../components";
import useAlert from "../hooks/useAlert";

type Row = Record<string, unknown> & {
  id: string;
  sort_order: number;
  icon_url?: string | null;
};

function emptyForm(config: EntityConfig): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  config.fields.forEach((field) => {
    form[field.key] = field.type === "string-array" ? [] : "";
  });
  return form;
}

function rowToForm(config: EntityConfig, row: Row): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  config.fields.forEach((field) => {
    const value = row[field.key];
    if (field.type === "string-array") {
      form[field.key] = Array.isArray(value) ? (value as string[]).join("\n") : "";
    } else {
      form[field.key] = value ?? "";
    }
  });
  return form;
}

function formToPayload(config: EntityConfig, form: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};
  config.fields.forEach((field) => {
    if (field.type === "string-array") {
      payload[field.key] = String(form[field.key] ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else {
      payload[field.key] = form[field.key];
    }
  });
  return payload;
}

function SortableRow({
  row,
  config,
  onEdit,
  onDelete,
}: {
  row: Row;
  config: EntityConfig;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm border border-slate-200"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-slate-400 px-1"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      {config.hasIcon && row.icon_url ? (
        <img
          src={String(row.icon_url)}
          alt=""
          className="w-8 h-8 object-contain"
        />
      ) : null}
      <span className="flex-1 font-medium">
        {String(row[config.titleField] ?? "(untitled)")}
      </span>
      <button type="button" className="btn" onClick={onEdit}>
        Edit
      </button>
      <button
        type="button"
        className="btn bg-red-600"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}

function EntityAdmin({ config }: { config: EntityConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { alert, showAlert } = useAlert(3000);

  const sensors = useSensors(useSensor(PointerSensor));

  const currentTableRef = useRef(config.table);
  currentTableRef.current = config.table;

  const loadRows = async () => {
    const table = config.table;
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("sort_order");

    if (currentTableRef.current !== table) return;

    if (error) showAlert({ text: error.message, type: "danger" });
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    loadRows();
    setEditingId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table]);

  const startNew = () => {
    setEditingId("new");
    setForm(emptyForm(config));
    setIconFile(null);
  };

  const startEdit = (row: Row) => {
    setEditingId(row.id);
    setForm(rowToForm(config, row));
    setIconFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIconFile(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = formToPayload(config, form);

      if (iconFile) {
        payload.icon_url = await uploadIcon(config.table, iconFile);
      }

      if (editingId === "new") {
        payload.sort_order = rows.length;
        const { error } = await supabase.from(config.table).insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(config.table)
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      }

      showAlert({ text: "Saved", type: "success" });
      setEditingId(null);
      setIconFile(null);
      await loadRows();
    } catch (err) {
      showAlert({
        text: err instanceof Error ? err.message : "Save failed",
        type: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    const { error } = await supabase.from(config.table).delete().eq("id", id);
    if (error) {
      showAlert({ text: error.message, type: "danger" });
      return;
    }
    await loadRows();
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    const reordered = arrayMove(rows, oldIndex, newIndex);
    setRows(reordered);

    const updates = reordered.map((row, index) =>
      supabase.from(config.table).update({ sort_order: index }).eq("id", row.id)
    );
    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);
    if (failed?.error) {
      showAlert({ text: failed.error.message, type: "danger" });
      await loadRows();
    }
  };

  return (
    <div className="max-w-2xl relative">
      {alert.show && <Alert {...alert} />}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{config.label}</h2>
        <button type="button" className="btn" onClick={startNew}>
          Add new
        </button>
      </div>

      {editingId && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-4">
          {config.fields.map((field) => (
            <label key={field.key} className="flex flex-col gap-1 text-sm font-medium">
              {field.label}
              {field.type === "textarea" || field.type === "string-array" ? (
                <textarea
                  className="textarea"
                  rows={field.type === "string-array" ? 4 : 3}
                  value={String(form[field.key] ?? "")}
                  onChange={(event) =>
                    setForm({ ...form, [field.key]: event.target.value })
                  }
                />
              ) : (
                <input
                  type="text"
                  className="input"
                  value={String(form[field.key] ?? "")}
                  onChange={(event) =>
                    setForm({ ...form, [field.key]: event.target.value })
                  }
                />
              )}
            </label>
          ))}

          {config.hasIcon && (
            <label className="flex flex-col gap-1 text-sm font-medium">
              Icon image
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setIconFile(event.target.files?.[0] ?? null)
                }
              />
            </label>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              className="btn"
              disabled={saving}
              onClick={save}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn bg-slate-500" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  config={config}
                  onEdit={() => startEdit(row)}
                  onDelete={() => deleteRow(row.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export default EntityAdmin;
