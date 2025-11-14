"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Calendar, DollarSign, TrendingUp, Heart, Shield, Smartphone, Zap, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/profe/logo";
import { useFirebase } from "@/firebase";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LandingPage() {
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading while checking auth
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Logo className="h-12 w-auto text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo className="h-8 w-auto text-primary" />
          <Button variant="ghost" onClick={() => router.push('/login')}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            14 dias grátis • Cancele quando quiser
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Finalmente, um app que{" "}
            <span className="text-primary">fala a sua língua</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Você ensina, inspira e transforma vidas. A gente cuida da parte chata: DAS, potinhos, organização financeira.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg h-14 px-8"
              onClick={() => router.push('/cadastro')}
            >
              Começar agora de graça
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg h-14 px-8"
              onClick={() => router.push('/login')}
            >
              Já tenho conta
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Junte-se a centenas de professores que já estão no controle
          </p>
        </div>
      </section>

      {/* Problemas Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A gente sabe como é...
            </h2>
            <p className="text-lg text-muted-foreground">
              Ser professor já é desafiador. Lidar com MEI não deveria ser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold text-lg">DAS todo mês</h3>
                <p className="text-muted-foreground">
                  Você esquece, paga atrasado, fica com aquela culpa... E o boleto sempre vence no pior dia.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center mx-auto">
                  <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-lg">Férias e 13º</h3>
                <p className="text-muted-foreground">
                  Chega dezembro e você pensa: "Cadê o dinheiro que eu ganhei esse ano?". Spoiler: você gastou sem separar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg">Controle zero</h3>
                <p className="text-muted-foreground">
                  Planilha chata, app complicado, contador caro... Você só quer dar aula, não virar contador!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Imagina ter isso na palma da mão
            </h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa, sem complicação. Simples assim.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Lembrete automático do DAS</h3>
                  <p className="text-muted-foreground">
                    Nunca mais esqueça. O app te avisa 5 dias antes, com aquela dopamina quando você marca como pago.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Potinhos automáticos</h3>
                  <p className="text-muted-foreground">
                    Férias, 13º, impostos... O app separa sozinho. Você só vê o dinheiro crescer.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Agenda que entende seu ritmo</h3>
                  <p className="text-muted-foreground">
                    Registre suas aulas, veja quanto vai ganhar no mês, saiba quando tem recesso chegando.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Feito com carinho</h3>
                  <p className="text-muted-foreground">
                    Mensagens motivadoras, IA que entende seu momento, design que não estressa. É tipo ter um amigo CFO.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">No celular, sempre</h3>
                  <p className="text-muted-foreground">
                    Instala como app no seu celular. Funciona offline. Rápido, leve, sempre ali quando você precisa.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Seus dados seguros</h3>
                  <p className="text-muted-foreground">
                    Tudo criptografado, backup automático, sem vender seus dados. Só você acessa suas informações.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Emocionais */}
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mais do que organização
            </h2>
            <p className="text-lg text-muted-foreground">
              É sobre ter paz de espírito pra focar no que você ama: ensinar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="text-4xl mb-2">🧘‍♀️</div>
                <h3 className="font-bold text-lg">Menos estresse</h3>
                <p className="text-muted-foreground">
                  Acabou aquele aperto no peito toda vez que lembra do DAS. Ou pior: quando já passou.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="text-4xl mb-2">⏰</div>
                <h3 className="font-bold text-lg">Mais tempo livre</h3>
                <p className="text-muted-foreground">
                  5 minutos por semana vs horas quebrando cabeça. Você decide o que fazer com o tempo que sobra.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="text-4xl mb-2">🚀</div>
                <h3 className="font-bold text-lg">Sensação de controle</h3>
                <p className="text-muted-foreground">
                  Ver seus potinhos crescendo, saber exatamente pra onde vai seu dinheiro. Isso é empoderamento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Menos que um Uber
            </h2>
            <p className="text-lg text-muted-foreground">
              Sério. É mais barato que você imagina.
            </p>
          </div>

          <Card className="max-w-md mx-auto border-2 border-primary relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary">Melhor escolha</Badge>
            </div>
            <CardContent className="pt-8 text-center space-y-6">
              <div>
                <div className="text-5xl font-bold mb-2">
                  R$ 19<span className="text-2xl">,90</span>
                </div>
                <p className="text-muted-foreground">por mês</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>14 dias grátis pra testar tudo</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Lembretes automáticos do DAS</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Potinhos ilimitados</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Agenda completa de aulas</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>IA que te motiva todo dia</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Suporte por email</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Cancele quando quiser (mas não vai querer)</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full text-lg h-14"
                onClick={() => router.push('/cadastro')}
              >
                Começar 14 dias grátis
              </Button>

              <p className="text-sm text-muted-foreground">
                💳 Sem cobrar agora. Cancele antes do trial sem pagar nada.
              </p>
            </CardContent>
          </Card>

          <div className="max-w-md mx-auto mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Pensa só:</strong> É menos que 2 cafés por semana. E você economiza muito mais do que isso só não esquecendo do DAS. 😉
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Dúvidas? A gente responde
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    Não entendo nada de tecnologia. Vai ser difícil?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Relaxa! Se você usa WhatsApp, vai usar o Profe PJ. É tudo visual, intuitivo, sem termos complicados. E se travar, a gente ajuda.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    Meus dados ficam seguros?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  100%. Usamos a mesma tecnologia de bancos (Firebase do Google). Seus dados são criptografados, com backup automático, e nunca vendemos pra ninguém. Só você acessa.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    Funciona sem internet?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim! Você pode registrar aulas, ver seus potinhos, consultar a agenda mesmo offline. Quando voltar a internet, sincroniza tudo automaticamente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    Posso cancelar quando quiser?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Claro! Sem multa, sem pegadinha. Você cancela direto no app em 2 cliques. E se voltar depois, seus dados continuam salvos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    O que acontece nos 14 dias grátis?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Você usa TUDO sem pagar nada. No 14º dia, a gente te avisa antes de cobrar. Se não gostar, é só cancelar. Zero risco.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    Preciso instalar alguma coisa?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Não precisa ir na loja de apps! Você acessa pelo navegador e pode "Adicionar à Tela Inicial". Vira um app de verdade, mas sem ocupar espaço.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    Funciona em qualquer celular?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim! Android, iPhone, tablet, computador... Qualquer dispositivo com navegador. E sincroniza entre todos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-left font-semibold">
                    O app faz a declaração de imposto pra mim?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ainda não, mas te ajuda DEMAIS. Com tudo organizado (ganhos, DAS pagos, etc), fica muito mais fácil declarar ou passar pro contador.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-primary text-primary-foreground border-0">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Pronto pra ter controle de verdade?
              </h2>
              <p className="text-lg opacity-90 max-w-xl mx-auto">
                Centenas de professores já estão vivendo mais tranquilos. Sua vez de parar de se preocupar com DAS, potinhos e organização.
              </p>
              <div className="pt-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg h-14 px-8"
                  onClick={() => router.push('/cadastro')}
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Começar 14 dias grátis agora
                </Button>
              </div>
              <p className="text-sm opacity-75">
                Sem cartão de crédito agora. Leva 2 minutos.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Logo className="h-8 w-auto mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              Feito com ❤️ para professores que merecem ter paz financeira
            </p>
            <div className="flex gap-6 justify-center text-sm text-muted-foreground">
              <a href="/login" className="hover:text-primary transition-colors">Login</a>
              <a href="/cadastro" className="hover:text-primary transition-colors">Cadastro</a>
              <span>•</span>
              <span>R$ 19,90/mês</span>
              <span>•</span>
              <span>14 dias grátis</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
