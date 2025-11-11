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

const formSchema = z.object({
  startDate: z.coerce.date({
    required_error: "A data de início é obrigatória.",
    invalid_type_error: "Formato de data inválido.",
  }),
  endDate: z.coerce.date({
    required_error: "A data de fim é obrigatória.",
    invalid_type_error: "Formato de data inválido.",
  }),
}).refine((data) => {
    // A coerção pode resultar em datas inválidas se a string for vazia.
    if (!data.startDate || !data.endDate || isNaN(data.startDate.getTime()) || isNaN(data.endDate.getTime())) return true;
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
    // Use strings vazias para inputs de texto/data. `undefined` pode causar problemas.
    defaultValues: {
      startDate: '' as any,
      endDate: '' as any,
    }
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    form.reset();
  }
  
  const startDateString = form.watch("startDate") as any;
  const minEndDate = startDateString ? new Date(startDateString) : undefined;
  if(minEndDate) {
    minEndDate.setDate(minEndDate.getDate() + 1);
  }

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
                    {...field}
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
                    {...field}
                    min={minEndDate?.toISOString().split('T')[0]}
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
