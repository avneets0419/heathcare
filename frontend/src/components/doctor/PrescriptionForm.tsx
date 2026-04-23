"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPrescription } from "@/services/doctor.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Loader2, Pill } from "lucide-react";

const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name required"),
  dosage: z.string().min(1, "Dosage required"),
  frequency: z.string().min(1, "Frequency required"),
  duration: z.string().min(1, "Duration required"),
});

const schema = z.object({
  appointmentId: z.string().min(1),
  medicines: z.array(medicineSchema).min(1, "Add at least one medicine"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PrescriptionFormProps {
  appointmentId: string;
  patientName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PrescriptionForm({
  appointmentId,
  patientName,
  onSuccess,
  onCancel,
}: PrescriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      appointmentId,
      medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createPrescription({
        appointmentId: values.appointmentId,
        medicines: values.medicines,
        notes: values.notes ?? "",
      });
      onSuccess?.();
    } catch {
      setError("Failed to save prescription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("appointmentId")} />

      {/* Patient banner */}
      <div className="rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 px-4 py-3 flex items-center gap-2">
        <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
          Writing prescription for <strong>{patientName}</strong>
        </span>
      </div>

      {/* Medicines */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Medicines
          </Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-950/30"
            onClick={() =>
              append({ name: "", dosage: "", frequency: "", duration: "" })
            }
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Add Medicine
          </Button>
        </div>

        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Medicine {idx + 1}
              </span>
              {fields.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-rose-400 hover:text-rose-600"
                  onClick={() => remove(idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`med-name-${idx}`} className="text-xs text-slate-600 dark:text-slate-400">
                  Medicine Name
                </Label>
                <Input
                  id={`med-name-${idx}`}
                  placeholder="e.g. Amoxicillin"
                  {...register(`medicines.${idx}.name`)}
                  className="rounded-lg h-9 text-sm"
                />
                {errors.medicines?.[idx]?.name && (
                  <p className="text-xs text-rose-500">{errors.medicines[idx]?.name?.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor={`med-dosage-${idx}`} className="text-xs text-slate-600 dark:text-slate-400">
                  Dosage
                </Label>
                <Input
                  id={`med-dosage-${idx}`}
                  placeholder="e.g. 500mg"
                  {...register(`medicines.${idx}.dosage`)}
                  className="rounded-lg h-9 text-sm"
                />
                {errors.medicines?.[idx]?.dosage && (
                  <p className="text-xs text-rose-500">{errors.medicines[idx]?.dosage?.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor={`med-freq-${idx}`} className="text-xs text-slate-600 dark:text-slate-400">
                  Frequency
                </Label>
                <Input
                  id={`med-freq-${idx}`}
                  placeholder="e.g. Twice daily"
                  {...register(`medicines.${idx}.frequency`)}
                  className="rounded-lg h-9 text-sm"
                />
                {errors.medicines?.[idx]?.frequency && (
                  <p className="text-xs text-rose-500">{errors.medicines[idx]?.frequency?.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor={`med-duration-${idx}`} className="text-xs text-slate-600 dark:text-slate-400">
                  Duration
                </Label>
                <Input
                  id={`med-duration-${idx}`}
                  placeholder="e.g. 7 days"
                  {...register(`medicines.${idx}.duration`)}
                  className="rounded-lg h-9 text-sm"
                />
                {errors.medicines?.[idx]?.duration && (
                  <p className="text-xs text-rose-500">{errors.medicines[idx]?.duration?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {errors.medicines && !Array.isArray(errors.medicines) && (
          <p className="text-xs text-rose-500">{errors.medicines.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="rx-notes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Notes / Instructions
        </Label>
        <Textarea
          id="rx-notes"
          placeholder="Additional instructions for the patient…"
          rows={3}
          {...register("notes")}
          className="rounded-xl text-sm resize-none border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" className="rounded-xl" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            "Save Prescription"
          )}
        </Button>
      </div>
    </form>
  );
}
