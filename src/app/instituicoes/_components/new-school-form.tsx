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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";


const schoolColors = [
    { value: "#34D399", label: "Verde" },
    { value: "#F87171", label: "Vermelho" },
    { value: "#60A5FA", label: "Azul" },
    { value: "#FBBF24", label: "Amarelo" },
    { value: "#A78BFA", label: "Roxo" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  hourlyRate: z.coerce.number().min(1, {
    message: "O valor deve ser maior que zero.",
  }),
  color: z.string().min(1, { message: "Selecione uma cor." }),
});

type NewSchoolFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export default function NewSchoolForm({ onSubmit, onCancel }: NewSchoolFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hourlyRate: 0,
      color: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Instituição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Escola Foguete" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Hora/Aula</FormLabel>
              <FormControl>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">R$</span>
                    <Input type="number" placeholder="50.00" className="pl-9" {...field} />
                 </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor de Identificação</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {schoolColors.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-4 h-4 rounded-full")} style={{ backgroundColor: color.value }}/>
                                <span>{color.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
