
"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Sparkles, PieChart, FilePlus2, Pencil, FileText, CheckSquare, BarChart3, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "AI-Powered Creation",
      description: "Generate complete forms from a simple text prompt. Let AI do the heavy lifting.",
    },
    {
      icon: <FilePlus2 className="w-8 h-8 text-primary" />,
      title: "Intuitive Builder",
      description: "Easily drag, drop, and customize questions to build the perfect form for your needs.",
    },
    {
      icon: <PieChart className="w-8 h-8 text-primary" />,
      title: "Actionable Insights",
      description: "Analyze responses with clear summaries and beautiful charts to make data-driven decisions.",
    },
  ];

  const backgroundIcons = [
    { icon: Pencil, className: "top-[10%] left-[10%] w-12 h-12" },
    { icon: FileText, className: "top-[20%] right-[15%] w-16 h-16" },
    { icon: CheckSquare, className: "bottom-[15%] left-[20%] w-14 h-14" },
    { icon: BarChart3, className: "bottom-[10%] right-[10%] w-12 h-12" },
    { icon: HelpCircle, className: "top-[50%] left-[30%] w-10 h-10" },
    { icon: Sparkles, className: "top-[40%] right-[40%] w-10 h-10" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative container mx-auto px-4 py-20 md:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--accent)),transparent)]"></div>
          </div>

          {/* Background Icons */}
          {backgroundIcons.map((item, index) => {
            const Icon = item.icon;
            return (
              <Icon
                key={index}
                className={`absolute text-primary/20 animate-pulse-slow ${item.className}`}
                style={{ animationDelay: `${index * 0.5}s`, animationDuration: '5s' }}
              />
            );
          })}

          <div className="max-w-4xl mx-auto animate-fade-in-slow">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-slide-up-slow">
              Build Intelligent Forms, Effortlessly
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up-medium">
              SmartForms uses AI to help you create beautiful, effective forms and surveys in minutes, not hours.
            </p>
            <div className="flex justify-center gap-4 animate-slide-up-fast">
              <Button size="lg" onClick={() => router.push('/auth')}>
                Get Started for Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/auth')}>
                Sign In
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-slide-up-slow">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose SmartForms?</h2>
              <p className="text-lg text-muted-foreground mt-2">Everything you need to gather feedback and grow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, i) => (
                <div key={feature.title} className="animate-slide-up-medium" style={{animationDelay: `${i * 150}ms`, animationFillMode: 'backwards'}}>
                  <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                     <CardHeader>
                      <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto animate-slide-up-medium">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to revolutionize your forms?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators and start building smarter forms today. No credit card required.
            </p>
            <Button size="lg" onClick={() => router.push('/auth')} className="animate-pulse">
              Sign Up Now <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
