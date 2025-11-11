"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';

const formSchema = z.object({
  startDate: z.coerce.date({
    required_error: "A data de início é obrigatória.",
  }),
  endDate: z.coerce.date({
    required_error: "A data de fim é obrigatória.",
  }),
}).refine((data) => {
    if (!data.startDate || !data.endDate) return true;
    return data.endDate > data.startDate;
}, {
  message: "A data final deve ser posterior à data inicial.",
  path: ["endDate"], 
});

type AddRecessFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export default function AddRecessForm({ onSubmit, onCancel }: AddRecessFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        startDate: undefined,
        endDate: undefined,
    }
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    form.reset();
  }

  const startDateValue = form.watch("startDate");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Início do Recesso</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    value={field.value instanceof Date && !isNaN(field.value.getTime()) ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => field.onChange(e.target.valueAsDate)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Fim do Recesso</FormLabel>
                 <FormControl>
                  <Input 
                    type="date" 
                    value={field.value instanceof Date && !isNaN(field.value.getTime()) ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => field.onChange(e.target.valueAsDate)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                    min={startDateValue instanceof Date ? format(startDateValue, 'yyyy-MM-dd') : undefined}
                   />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Salvar Recesso</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
