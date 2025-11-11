
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

import MobileScreen from "@/components/layout/mobile-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { signUpAndCreateProfile } from "@/lib/auth";
import { useFirebase } from "@/firebase";

type Message = {
  sender: "bot" | "user";
  text: string | React.ReactNode;
  isInput?: boolean;
};

const initialMessages: Message[] = [
  {
    sender: "bot",
    text: "Oiê! Eu sou o 'Profe PJ' e vou ser seu assistente pessoal pra você nunca mais se preocupar com a parte chata de ser MEI. Vamos lá? 😄",
  },
  { sender: "bot", text: "Pra começar, me conta: qual seu nome?" },
];

const conversationSteps = [
  "name", "schoolName", "hourlyRate", "dasDueDate", "email", "password", "final"
];

export default function CadastroPage() {
  const router = useRouter();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<any>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const step = conversationSteps[currentStep];
    const newUserData = { ...userData, [step]: inputValue };
    setUserData(newUserData);
    setInputValue("");

    // Simulate bot thinking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let botResponse = "";
    if (step === "name") {
      botResponse = `Legal, ${inputValue}! E pra qual escola (ou lugar) você dá aula?`;
      setCurrentStep(1);
    } else if (step === "schoolName") {
      botResponse = `Entendi. E quanto você ganha por hora lá na '${inputValue}'?`;
      setCurrentStep(2);
    } else if (step === "hourlyRate") {
        const rate = parseFloat(inputValue.replace(',', '.'));
        if (isNaN(rate) || rate <= 0) {
            botResponse = "Hmm, parece que isso não é um valor válido. Por favor, digite um número maior que zero.";
            // Don't advance the step
        } else {
            botResponse = "Perfeito! E só pra eu te lembrar (e você nunca esquecer 😜): qual dia do mês vence aquele boleto do MEI (o DAS)? Digite só o número do dia.";
            setCurrentStep(3);
        }
    } else if (step === "dasDueDate") {
        const day = parseInt(inputValue, 10);
        if (isNaN(day) || day < 1 || day > 31) {
            botResponse = "Dia inválido! Por favor, digite um número entre 1 e 31.";
        } else {
            botResponse = "Anotado! Agora, para proteger sua conta, qual é o seu melhor e-mail?";
            setCurrentStep(4);
        }
    } else if (step === "email") {
      botResponse = "Ótimo! Agora, crie uma senha com pelo menos 6 caracteres. Esse e-mail e senha serão seu login, ok?";
      setCurrentStep(5);
    } else if (step === "password") {
      if (inputValue.length < 6) {
        botResponse = "A senha precisa ter no mínimo 6 caracteres. Tente de novo!";
      } else {
        botResponse = "Fechado! Estou criando sua conta e uns 'Potinhos' mágicos pra gente guardar seu 13º e suas Férias sem esforço. Bem-vindo(a) ao Profe Amigo! 🎉";
        setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
        
        // Finalize registration
        try {
          const finalUserData = {
            name: newUserData.name,
            email: newUserData.email,
            password: newUserData.password,
            dasDueDate: parseInt(newUserData.dasDueDate, 10),
            school: {
              name: newUserData.schoolName,
              hourlyRate: parseFloat(newUserData.hourlyRate.replace(',', '.')),
            }
          };

          await signUpAndCreateProfile(auth, firestore, finalUserData);
          
          toast({
            title: "Conta criada com sucesso!",
            description: "Seja bem-vindo(a)! Faça o login para começar.",
          });

          router.push("/login");

        } catch (error: any) {
          console.error("Sign up failed:", error);
          botResponse = `Ops! Tive um problema pra criar sua conta: ${error.message}. Vamos tentar de novo com um e-mail e senha diferentes. Qual seu e-mail?`;
          setCurrentStep(4); // Go back to email step
          setUserData((prev: any) => ({ ...prev, email: "", password: "" }));
        }
      }
    }

    setIsLoading(false);
    if (step !== "password" || (step === "password" && inputValue.length < 6) || (step === "hourlyRate" && isNaN(parseFloat(inputValue.replace(',', '.'))))) {
        setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    }
  };

  const getInputType = () => {
    const step = conversationSteps[currentStep];
    switch(step) {
        case 'hourlyRate': return 'number';
        case 'dasDueDate': return 'number';
        case 'email': return 'email';
        case 'password': return 'password';
        default: return 'text';
    }
  }


  return (
    <MobileScreen>
      <header className="sticky top-0 z-10 flex items-center p-4 bg-background/80 backdrop-blur-sm border-b">
        <h1 className="text-xl font-bold font-headline text-foreground text-center flex-1">
          Vamos Começar!
        </h1>
      </header>

      <main
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex items-end gap-2",
              msg.sender === "user" && "justify-end"
            )}
          >
            {msg.sender === "bot" && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="/profe-pj-avatar.png" alt="Profe PJ" />
                <AvatarFallback>PJ</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%] break-words",
                msg.sender === "bot"
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex items-end gap-2">
                <Avatar className="w-8 h-8">
                <AvatarImage src="/profe-pj-avatar.png" alt="Profe PJ" />
                <AvatarFallback>PJ</AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-2 bg-muted text-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
        )}
      </main>

      <footer className="sticky bottom-0 bg-background p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            type={getInputType()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite aqui..."
            disabled={isLoading || currentStep >= conversationSteps.length -1}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim() || currentStep >= conversationSteps.length -1}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </footer>
    </MobileScreen>
  );
}