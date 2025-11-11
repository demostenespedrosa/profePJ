"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";


type School = {
    id: number;
    name: string;
    color: string;
}

type NewLessonFormProps = {
  schools: School[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const baseSchema = z.object({
  schoolId: z.string().min(1, "Selecione uma escola."),
  startTime: z.string().min(1, "Defina o horário de início."),
  endTime: z.string().min(1, "Defina o horário de término."),
});

const singleLessonSchema = baseSchema.extend({
  date: z.date({ required_error: "Selecione uma data." }),
});

const batchLessonSchema = baseSchema.extend({
  dates: z.array(z.date()).min(1, "Selecione pelo menos uma data."),
});

export default function NewLessonForm({ schools, onSubmit, onCancel }: NewLessonFormProps) {
  const [activeTab, setActiveTab] = useState("single");
  
  const form = useForm({
    resolver: zodResolver(activeTab === 'single' ? singleLessonSchema : batchLessonSchema),
    defaultValues: {
      schoolId: "",
      startTime: "",
      endTime: "",
      date: undefined,
      dates: [],
    },
  });

  function handleSubmit(values: any) {
    onSubmit({
        type: activeTab,
        ...values
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            // Reset validation when switching tabs
            form.clearErrors();
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Aula Única</TabsTrigger>
            <TabsTrigger value="batch">Várias Aulas</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="space-y-4 pt-4">
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Data da Aula</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                            ) : (
                                <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                            locale={ptBR}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
             />
          </TabsContent>
          <TabsContent value="batch" className="space-y-4 pt-4">
             <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                    <FormLabel className="self-start">Datas das Aulas</FormLabel>
                     <Calendar
                        mode="multiple"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                        locale={ptBR}
                    />
                    <FormMessage />
                    </FormItem>
                )}
             />
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instituição</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escola" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {schools.map(school => (
                        <SelectItem key={school.id} value={String(school.id)}>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: school.color }}/>
                                <span>{school.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Início</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fim</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Agendar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
