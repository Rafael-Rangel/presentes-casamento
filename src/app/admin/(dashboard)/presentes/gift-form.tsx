"use client";

import {
  createGift,
  updateGift,
  type GiftActionState,
} from "@/app/actions/gifts";
import type { Gift } from "@/lib/types";
import { ImageIcon, Link2, Palette } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

const initial: GiftActionState = { ok: false };

export function GiftCreateForm() {
  const [state, formAction, pending] = useActionState(createGift, initial);
  return <GiftFields formAction={formAction} pending={pending} state={state} />;
}

export function GiftEditForm({ gift }: { gift: Gift }) {
  const boundUpdate = updateGift.bind(null, gift.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initial);
  return (
    <GiftFields
      formAction={formAction}
      pending={pending}
      state={state}
      gift={gift}
    />
  );
}

function GiftFields({
  formAction,
  pending,
  state,
  gift,
}: {
  formAction: (payload: FormData) => void;
  pending: boolean;
  state: GiftActionState;
  gift?: Gift;
}) {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="admin-card max-w-2xl space-y-8"
    >
      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-terracotta/35 bg-terracotta/5 px-3 py-2.5 text-sm text-ink"
        >
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl border border-ocean/25 bg-ocean/5 px-3 py-2 text-sm font-medium text-ocean-deep">
          Guardado com sucesso.
        </p>
      ) : null}

      <section className="space-y-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-medium text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean/10 text-ocean">
            <ImageIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          Destaque
        </h2>

        <label className="admin-label">
          Nome do presente
          <input
            required
            name="title"
            defaultValue={gift?.title}
            className="admin-input"
            placeholder="Ex.: Conjunto de pratos"
          />
        </label>

        <div className="space-y-3">
          <span className="admin-label m-0">Fotografia</span>
          <p className="text-xs leading-relaxed text-muted">
            Carrega uma imagem (guardada no{" "}
            <strong className="text-ink">Supabase Storage</strong>) ou cola um
            link externo (opcional).
          </p>
          <input
            type="file"
            name="imageFile"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="block w-full max-w-md cursor-pointer text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-ocean/12 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-ocean-deep hover:file:bg-ocean/20"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFilePreview((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return f ? URL.createObjectURL(f) : null;
              });
            }}
          />
          {(filePreview || gift?.image_url) && (
            <div className="relative overflow-hidden rounded-2xl border border-border/90 bg-canvas/50 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element -- preview blob: ou URL arbitrária */}
              <img
                src={filePreview ?? gift?.image_url ?? ""}
                alt="Pré-visualização"
                className="max-h-56 w-full object-contain object-center"
              />
            </div>
          )}
        </div>

        <label className="admin-label">
          Ou URL da imagem (externa)
          <input
            name="imageUrl"
            type="url"
            defaultValue={gift?.image_url ?? ""}
            className="admin-input"
            placeholder="https://… (se não enviares ficheiro)"
          />
        </label>

        <label className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
            <Palette className="h-4 w-4 text-terracotta" strokeWidth={1.75} aria-hidden />
            Cor de destaque
          </span>
          <input
            type="color"
            name="accentColor"
            defaultValue={gift?.accent_color ?? "#2d5a75"}
            className="h-11 w-[4.5rem] cursor-pointer rounded-xl border border-border bg-paper shadow-inner"
          />
          <span className="text-xs text-muted">
            Usada nos cartões da lista pública.
          </span>
        </label>

        <label className="admin-label">
          Descrição
          <textarea
            name="description"
            rows={5}
            defaultValue={gift?.description ?? ""}
            className="admin-input min-h-[7rem] resize-y"
            placeholder="O que é o presente, onde comprar ideias, tamanhos…"
          />
        </label>

        <label className="admin-label">
          <span className="inline-flex items-center gap-2">
            <Link2 className="h-4 w-4 text-ocean" strokeWidth={1.75} aria-hidden />
            Link da loja (opcional)
          </span>
          <input
            name="storeUrl"
            type="url"
            defaultValue={gift?.store_url ?? ""}
            className="admin-input"
            placeholder="https://loja.pt/…"
          />
        </label>
      </section>

      <details className="group rounded-2xl border border-border/80 bg-canvas/25 open:border-ocean/20 open:bg-paper/60">
        <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-ink transition marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="text-muted group-open:text-ocean-deep">
            Opções avançadas
          </span>
          <span className="ml-2 font-normal text-muted">
            — preço, categoria, prioridade, estado, mês de liberação
          </span>
        </summary>
        <div className="space-y-5 border-t border-border/60 px-4 pb-5 pt-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="admin-label">
              Preço estimado (€)
              <input
                name="estimatedPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={
                  gift?.estimated_price != null
                    ? String(gift.estimated_price)
                    : ""
                }
                className="admin-input"
              />
            </label>
            <label className="admin-label">
              Categoria
              <input
                name="category"
                defaultValue={gift?.category ?? ""}
                className="admin-input"
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="admin-label">
              Prioridade
              <select
                name="priority"
                defaultValue={gift?.priority ?? "normal"}
                className="admin-select"
              >
                <option value="essential">Essencial</option>
                <option value="high">Alta</option>
                <option value="normal">Normal</option>
              </select>
            </label>
            <label className="admin-label">
              Estado
              <select
                name="status"
                defaultValue={gift?.status ?? "available"}
                className="admin-select"
              >
                <option value="available">Disponível</option>
                <option value="reserved">Reservado</option>
                <option value="confirmed">Confirmado</option>
                <option value="coming_soon">Em breve</option>
              </select>
            </label>
          </div>

          <label className="admin-label">
            Mês de liberação (YYYY-MM)
            <input
              name="releaseMonth"
              defaultValue={gift?.release_month ?? ""}
              placeholder="2026-06 — só aparece no site a partir deste mês"
              pattern="\d{4}-\d{2}"
              className="admin-input"
            />
            <span className="mt-1.5 block text-xs leading-relaxed text-muted">
              Vazio = visível logo. Datas futuras mostram o cartão em modo
              &quot;brevemente&quot;.
            </span>
          </label>
        </div>
      </details>

      <button
        type="submit"
        disabled={pending}
        className="admin-btn-primary min-w-[160px]"
      >
        {pending ? "A guardar…" : "Guardar presente"}
      </button>
    </form>
  );
}
