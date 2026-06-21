"use client";

import { useState } from "react";
import type { IBusinessIdea, TGenerationMode, TMarketType } from "@/types/blueprint";
import { GenerationModeSwitcher } from "./GenerationModeSwitcher";

interface IIdeaFormProps {
  initialIdea: IBusinessIdea;
  generationMode: TGenerationMode;
  onGenerationModeChange: (mode: TGenerationMode) => void;
  onSubmit: (idea: IBusinessIdea) => void;
}

const MARKET_TYPES: TMarketType[] = ["b2b", "b2c", "b2b2c", "marketplace"];

const REQUIRED_FIELDS: (keyof IBusinessIdea)[] = [
  "productName",
  "businessDescription",
  "problemStatement",
  "coreIdea",
];

export function IdeaForm({
  initialIdea,
  generationMode,
  onGenerationModeChange,
  onSubmit,
}: IIdeaFormProps) {
  const [idea, setIdea] = useState<IBusinessIdea>(initialIdea);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof IBusinessIdea>(key: K, value: IBusinessIdea[K]) {
    setIdea((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = REQUIRED_FIELDS.filter((field) => !idea[field]);
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      return;
    }
    setError(null);
    onSubmit(idea);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Describe your business idea</h1>

      <FormSection title="Business information">
        <TextField
          label="Product name"
          value={idea.productName}
          onChange={(value) => update("productName", value)}
          required
        />
        <TextField
          label="Industry"
          value={idea.industry}
          onChange={(value) => update("industry", value)}
        />
        <TextAreaField
          label="Business description"
          value={idea.businessDescription}
          onChange={(value) => update("businessDescription", value)}
          required
        />
      </FormSection>

      <FormSection title="Target audience">
        <TextField
          label="Target users"
          value={idea.targetUsers}
          onChange={(value) => update("targetUsers", value)}
        />
        <TextField
          label="Geography"
          value={idea.geography}
          onChange={(value) => update("geography", value)}
        />
        <SelectField
          label="Market type"
          value={idea.marketType}
          options={MARKET_TYPES}
          onChange={(value) => update("marketType", value as TMarketType)}
        />
      </FormSection>

      <FormSection title="Problem">
        <TextAreaField
          label="Problem statement"
          value={idea.problemStatement}
          onChange={(value) => update("problemStatement", value)}
          required
        />
        <TextAreaField
          label="Current alternatives"
          value={idea.currentAlternatives}
          onChange={(value) => update("currentAlternatives", value)}
        />
      </FormSection>

      <FormSection title="Solution">
        <TextAreaField
          label="Core idea"
          value={idea.coreIdea}
          onChange={(value) => update("coreIdea", value)}
          required
        />
        <TextAreaField
          label="Key features"
          value={idea.keyFeatures}
          onChange={(value) => update("keyFeatures", value)}
        />
      </FormSection>

      <FormSection title="Constraints">
        <TextField
          label="Budget"
          value={idea.budget}
          onChange={(value) => update("budget", value)}
        />
        <TextField
          label="Timeline"
          value={idea.timeline}
          onChange={(value) => update("timeline", value)}
        />
        <TextField
          label="Team size"
          value={idea.teamSize}
          onChange={(value) => update("teamSize", value)}
        />
      </FormSection>

      <FormSection title="Data and security">
        <CheckboxField
          label="Handles personal data"
          checked={idea.hasPersonalData}
          onChange={(value) => update("hasPersonalData", value)}
        />
        <CheckboxField
          label="Handles financial data"
          checked={idea.hasFinancialData}
          onChange={(value) => update("hasFinancialData", value)}
        />
        <CheckboxField
          label="Handles health data"
          checked={idea.hasHealthData}
          onChange={(value) => update("hasHealthData", value)}
        />
        <TextAreaField
          label="Other sensitive information"
          value={idea.sensitiveInfoNotes}
          onChange={(value) => update("sensitiveInfoNotes", value)}
        />
      </FormSection>

      <GenerationModeSwitcher mode={generationMode} onChange={onGenerationModeChange} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Generate blueprint
      </button>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <legend className="px-1 text-sm font-semibold text-slate-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300"
      />
      {label}
    </label>
  );
}
