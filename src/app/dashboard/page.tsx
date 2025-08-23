
"use client";

import { FilePlus2, AppWindow, History, Trash2, Sparkles, PencilRuler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Link from 'next/link';
import { getRecentForms, RecentForm, deleteRecentForm, saveRecentForm } from '@/lib/recent-forms';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AiCreateDialog } from '@/components/ai-create-dialog';
import type { FormState } from '../create/page';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';

export default function Dashboard() {
  const [recentForms, setRecentForms] = useState<RecentForm[]>([]);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setRecentForms(getRecentForms());
  }, []);

  const handleDelete = (e: React.MouseEvent, formId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteRecentForm(formId);
    setRecentForms(getRecentForms());
  };

  const handlePreview = (e: React.MouseEvent, formId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const form = recentForms.find(f => f.id === formId);
    if (!form) return;
    const previewState = { ...form, settings: { ...form.settings, published: true } };
    saveRecentForm(previewState);
    window.open(`/preview?formId=${formId}`, '_blank');
  };
  
  const handleAiFormGenerated = (newFormState: FormState) => {
    saveRecentForm(newFormState);
    router.push(`/create?recent=${newFormState.id}`);
  };


  const options = [
    {
      title: 'Create from scratch',
      description: 'Start with a blank canvas and build your form from scratch.',
      icon: <FilePlus2 className="w-8 h-8 text-primary" />,
      href: '/create',
      onClick: () => router.push('/create'),
    },
    {
      title: 'Create with AI',
      description: 'Describe your form and let AI build the first draft for you.',
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      onClick: () => setIsAiDialogOpen(true),
    },
    {
      title: 'Templates',
      description: 'Choose from a variety of pre-designed templates to get started quickly.',
      icon: <AppWindow className="w-8 h-8 text-primary" />,
      href: '/templates',
      onClick: () => router.push('/templates'),
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <AiCreateDialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen} onFormGenerated={handleAiFormGenerated} />

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to SmartForms</h1>
          <p className="text-lg text-muted-foreground mt-2">What would you like to do today?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {options.map((option) => (
            <div key={option.title} className="block hover:scale-[1.03] transition-transform duration-300 rounded-lg cursor-pointer" onClick={option.onClick}>
              <Card className="h-full flex flex-col items-center text-center p-6">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    {option.icon}
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{option.description}</CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {recentForms.length > 0 && (
          <div className="text-left">
            <div className="flex items-center justify-start mb-8">
              <History className="w-6 h-6 mr-3 text-primary" />
              <h2 className="text-2xl font-bold">Recent Forms</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {recentForms.map((form) => (
                <Card key={form.id} className="h-full flex flex-col p-0 group relative text-left">
                    <div onClick={() => router.push(`/create?recent=${form.id}`)} className="cursor-pointer">
                      <CardHeader className="p-0 mb-4">
                        {form.headerImageUrl ? (
                          <img src={form.headerImageUrl} alt={form.title.text} className="h-32 w-full object-cover rounded-t-lg" data-ai-hint="form header" />
                        ) : (
                          <div className="h-32 w-full bg-muted rounded-t-lg flex items-center justify-center" data-ai-hint="placeholder">
                            <PencilRuler className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-6 pt-0 flex-grow">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg mb-1 truncate flex-1">{form.title.text}</CardTitle>
                        </div>
                        <CardDescription className="text-sm truncate">{form.description.text}</CardDescription>
                      </CardContent>
                    </div>
                     <div className="p-6 pt-0 flex justify-between items-center">
                        <Badge variant={form.settings.published ? 'secondary' : 'default'} className="capitalize">
                          {form.settings.published ? 'Published' : 'Draft'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/create?recent=${form.id}`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handlePreview(e, form.id)}>
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => handleDelete(e, form.id)} className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Button variant="destructive" size="icon" onClick={(e) => handleDelete(e, form.id)} className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
