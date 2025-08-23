
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Link from 'next/link';
import { templates } from '@/lib/template-data';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

export default function TemplatesPage() {

  const renderIcon = (name: string) => {
    const IconComponent = LucideIcons[name as IconName] as React.ElementType;
    if (IconComponent) {
      return <IconComponent className="w-8 h-8 text-primary" />;
    }
    return <LucideIcons.File className="w-8 h-8 text-primary" />;
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header showDashboardButton={true} />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Choose a Template</h1>
          <p className="text-lg text-muted-foreground mt-2">Get a head start with our pre-designed forms.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {templates.map((template) => (
            <Link href={`/create?template=${template.id}`} key={template.id} className="block hover:shadow-xl transition-shadow duration-300 rounded-lg">
              <Card className="h-full flex flex-col items-center text-center p-6">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    {renderIcon(template.icon)}
                  </div>
                  <CardTitle>{template.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
