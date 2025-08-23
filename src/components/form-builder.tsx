"use client";

import { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Trash2,
  X,
  AlignLeft,
  Calendar,
  CheckSquare,
  ChevronDownSquare,
  Clock,
  FileUp,
  Minus,
  Star,
  Circle,
  Image as ImageIcon,
  Heart,
  ThumbsUp,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

// Import types from the main create page
import type { FormState, FormElementStyle, QuestionType } from "@/app/create/page";

export type Option = { id: string; value: string; imageUrl?: string; };
export type RatingIcon = "star" | "heart" | "thumbs-up";

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  style: FormElementStyle;
  options?: Option[];
  imageUrl?: string;
  ratingConfig?: {
    scale: number;
    icon: RatingIcon;
  };
};

type FormBuilderProps = {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState | null>>;
  selectedElement: string | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function FormBuilder({ 
  formState, 
  setFormState, 
  selectedElement, 
  setSelectedElement 
}: FormBuilderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{questionId: string; optionId?: string} | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && uploadTarget) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      const { questionId, optionId } = uploadTarget;

      setFormState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          questions: prev.questions.map(q => {
            if (q.id === questionId) {
              if (optionId) {
                return {
                  ...q,
                  options: q.options?.map(opt =>
                    opt.id === optionId ? { ...opt, imageUrl } : opt
                  )
                };
              }
              return { ...q, imageUrl };
            }
            return q;
          })
        };
      });
    }
    setUploadTarget(null);
  };

  const triggerImageUpload = (questionId: string, optionId?: string) => {
    setUploadTarget({ questionId, optionId });
    fileInputRef.current?.click();
  };

  const removeImage = (questionId: string, optionId?: string) => {
    setFormState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id === questionId) {
            if (optionId) {
              return {
                ...q,
                options: q.options?.map(opt =>
                  opt.id === optionId ? { ...opt, imageUrl: undefined } : opt
                )
              };
            }
            return { ...q, imageUrl: undefined };
          }
          return q;
        })
      };
    });
  };

  const addQuestion = () => {
    setFormState((prev) => {
      if (!prev) return null;
      const newQuestionId = crypto.randomUUID();
      const newQuestion: Question = {
        id: newQuestionId,
        text: "",
        type: "short-answer",
        style: { font: "inter", fontSize: 16, isBold: false, isItalic: false },
      };
      setSelectedElement(null);
      return {
        ...prev,
        questions: [...prev.questions, newQuestion],
      };
    });
  };

  const updateQuestion = (id: string, newText: string) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === id ? { ...q, text: newText } : q
        ),
      };
    });
  };

  const updateQuestionType = (id: string, type: QuestionType) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id === id) {
            const newQuestion: Question = { ...q, type };
            if (
              (type === "radio-group" ||
               type === "checkboxes" ||
               type === "dropdown") &&
              !newQuestion.options
            ) {
              newQuestion.options = [{ id: crypto.randomUUID(), value: "" }];
            }
            if (type === "rating" && !newQuestion.ratingConfig) {
              newQuestion.ratingConfig = { scale: 5, icon: "star" };
            }
            return newQuestion;
          }
          return q;
        }),
      };
    });
  };

  const updateRatingConfig = (questionId: string, property: keyof NonNullable<Question['ratingConfig']>, value: any) => {
    setFormState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map(q =>
          q.id === questionId && q.ratingConfig
            ? { ...q, ratingConfig: { ...q.ratingConfig, [property]: value } }
            : q
        )
      };
    });
  };

  const deleteQuestion = (id: string) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.filter((q) => q.id !== id),
      };
    });
  };

  const addOption = (questionId: string) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: [
                  ...(q.options || []),
                  { id: crypto.randomUUID(), value: "" },
                ],
              }
            : q
        ),
      };
    });
  };

  const updateOption = (questionId: string, optionId: string, newValue: string) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: (q.options || []).map((opt) =>
                  opt.id === optionId ? { ...opt, value: newValue } : opt
                ),
              }
            : q
        ),
      };
    });
  };

  const deleteOption = (questionId: string, optionId: string) => {
    setFormState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? { ...q, options: (q.options || []).filter((o) => o.id !== optionId) }
            : q
        ),
      };
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    setFormState(prev => {
      if (!prev) return null;
      const newQuestions = Array.from(prev.questions);
      const [reorderedItem] = newQuestions.splice(result.source.index, 1);
      newQuestions.splice(result.destination.index, 0, reorderedItem);
      return { ...prev, questions: newQuestions };
    });
  };

  const getStyleProps = (style: FormElementStyle) => {
    return {
      className: cn({
        'font-bold': style.isBold,
        'italic': style.isItalic,
        'font-inter': style.font === 'inter',
        'font-arial': style.font === 'arial',
        'font-georgia': style.font === 'georgia',
        'font-times-new-roman': style.font === 'times-new-roman',
        'font-roboto': style.font === 'roboto',
        'font-open-sans': style.font === 'open-sans',
        'font-lato': style.font === 'lato',
        'font-montserrat': style.font === 'montserrat',
      }),
      style: {
        fontSize: `${style.fontSize}px`,
      }
    };
  };

  const RatingIconDisplay = ({ icon, ...props }: { icon: RatingIcon } & React.ComponentProps<typeof Star>) => {
    switch (icon) {
      case 'heart':
        return <Heart {...props} />;
      case 'thumbs-up':
        return <ThumbsUp {...props} />;
      case 'star':
      default:
        return <Star {...props} />;
    }
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case "short-answer":
        return <Input placeholder="Short answer text" disabled />;
      case "paragraph":
        return <Textarea placeholder="Long answer text" disabled />;
      case "radio-group":
        return (
          <div className="space-y-2">
            {(question.options || []).map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                {opt.imageUrl && (
                  <div className="relative h-10 w-10">
                    <img 
                      src={opt.imageUrl} 
                      alt="Option image" 
                      className="h-10 w-10 object-cover rounded-md" 
                      data-ai-hint="option image" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full" 
                      onClick={() => removeImage(question.id, opt.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Input
                  placeholder="Option"
                  value={opt.value}
                  onChange={(e) => updateOption(question.id, opt.id, e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => triggerImageUpload(question.id, opt.id)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOption(question.id, opt.id)}
                  disabled={(question.options || []).length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addOption(question.id)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Option
            </Button>
          </div>
        );
      case "checkboxes":
        return (
          <div className="space-y-2">
            {(question.options || []).map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                {opt.imageUrl && (
                  <div className="relative h-10 w-10">
                    <img 
                      src={opt.imageUrl} 
                      alt="Option image" 
                      className="h-10 w-10 object-cover rounded-md" 
                      data-ai-hint="option image" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full" 
                      onClick={() => removeImage(question.id, opt.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Input
                  placeholder="Option"
                  value={opt.value}
                  onChange={(e) => updateOption(question.id, opt.id, e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => triggerImageUpload(question.id, opt.id)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOption(question.id, opt.id)}
                  disabled={(question.options || []).length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addOption(question.id)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Option
            </Button>
          </div>
        );
      case "dropdown":
        return (
          <div className="space-y-2">
            {(question.options || []).map((opt, index) => (
              <div key={opt.id} className="flex items-center gap-2">
                {opt.imageUrl && (
                  <div className="relative h-10 w-10">
                    <img 
                      src={opt.imageUrl} 
                      alt="Option image" 
                      className="h-10 w-10 object-cover rounded-md" 
                      data-ai-hint="option image" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full" 
                      onClick={() => removeImage(question.id, opt.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <span className="text-sm text-muted-foreground">{index + 1}.</span>
                <Input
                  placeholder="Option"
                  value={opt.value}
                  onChange={(e) => updateOption(question.id, opt.id, e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => triggerImageUpload(question.id, opt.id)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOption(question.id, opt.id)}
                  disabled={(question.options || []).length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addOption(question.id)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Option
            </Button>
          </div>
        );
      case "address":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input disabled />
            </div>
            <div className="space-y-2">
              <Label>Street Address Line 2</Label>
              <Input disabled />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input disabled />
              </div>
              <div className="space-y-2">
                <Label>State / Province</Label>
                <Input disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Postal / Zip Code</Label>
              <Input disabled />
            </div>
          </div>
        );
      case "file-upload":
        return (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" disabled />
            </label>
          </div>
        );
      case "rating":
        const { scale = 5, icon = "star" } = question.ratingConfig || {};
        return (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select 
                value={String(scale)} 
                onValueChange={(value) => updateRatingConfig(question.id, 'scale', parseInt(value, 10))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={icon} 
                onValueChange={(value: RatingIcon) => updateRatingConfig(question.id, 'icon', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue>
                    <RatingIconDisplay icon={icon} className="w-5 h-5" />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="star"><Star className="w-5 h-5 text-yellow-400" /></SelectItem>
                  <SelectItem value="heart"><Heart className="w-5 h-5 text-red-500" /></SelectItem>
                  <SelectItem value="thumbs-up"><ThumbsUp className="w-5 h-5 text-blue-500" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: scale }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <RatingIconDisplay icon={icon} className="w-8 h-8 text-gray-300" />
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "date":
        return <Input type="date" disabled />;
      case "time":
        return <Input type="time" disabled />;
      default:
        return null;
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
        accept="image/*" 
      />
      <Card
        className="w-full max-w-3xl shadow-lg"
        onClick={(e) => { e.stopPropagation(); setSelectedElement(null); }}
      >
        <CardHeader
          onClick={(e) => { e.stopPropagation(); setSelectedElement('title'); }}
          data-selected={selectedElement === 'title'}
          className="cursor-pointer"
        >
          {formState.headerImageUrl && (
            <div className="relative mb-4">
              <img 
                src={formState.headerImageUrl} 
                alt="Form header" 
                className="h-48 w-full object-cover rounded-t-lg" 
                data-ai-hint="header image" 
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setFormState(prev => prev ? ({ ...prev, headerImageUrl: undefined }) : null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Input
            className={cn(
              "text-2xl font-bold border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto", 
              getStyleProps(formState.title.style).className
            )}
            style={getStyleProps(formState.title.style).style}
            placeholder="Form Title"
            value={formState.title.text}
            onChange={(e) =>
              setFormState((prev) => prev ? ({ 
                ...prev, 
                title: {...prev.title, text: e.target.value} 
              }) : null)
            }
          />
        </CardHeader>
        
        <CardContent
          className="pt-0 cursor-pointer"
          data-selected={selectedElement === 'description'}
          onClick={(e) => { e.stopPropagation(); setSelectedElement('description'); }}
        >
          <Textarea
            className={cn(
              "mt-2 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0", 
              getStyleProps(formState.description.style).className
            )}
            style={getStyleProps(formState.description.style).style}
            placeholder="Form description..."
            value={formState.description.text}
            onChange={(e) =>
              setFormState((prev) => prev ? ({ 
                ...prev, 
                description: {...prev.description, text: e.target.value} 
              }) : null)
            }
          />
        </CardContent>
        
        <CardContent className="space-y-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                  {formState.questions.map((q, qIndex) => (
                    <Draggable key={q.id} draggableId={q.id} index={qIndex}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card 
                            data-selected={selectedElement === q.id}
                            className={cn("bg-background/50", snapshot.isDragging && "shadow-2xl")} 
                            onClick={(e) => { e.stopPropagation(); setSelectedElement(q.id); }}
                          >
                            <div className="flex items-start p-4">
                              <div className="p-2 cursor-grab">
                                <div className="w-5 h-5"></div>
                              </div>
                              <div className="flex-1 space-y-4">
                                <CardHeader className="flex flex-row items-center justify-between p-0 gap-4">
                                  <div className="flex items-center gap-4 flex-1">
                                    <span className="text-primary font-semibold">{qIndex + 1}</span>
                                    <div className="flex-1">
                                      {q.imageUrl && (
                                        <div className="relative mb-2">
                                          <img 
                                            src={q.imageUrl} 
                                            alt="Question image" 
                                            className="h-32 w-full object-cover rounded-md" 
                                            data-ai-hint="question image" 
                                          />
                                          <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className="absolute top-2 right-2 h-6 w-6" 
                                            onClick={() => removeImage(q.id)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      )}
                                      <Input
                                        placeholder="Question"
                                        value={q.text}
                                        onChange={(e) => updateQuestion(q.id, e.target.value)}
                                        className={cn("flex-1", getStyleProps(q.style).className)}
                                        style={getStyleProps(q.style).style}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => triggerImageUpload(q.id)}
                                    >
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                    <Select
                                      value={q.type}
                                      onValueChange={(value: QuestionType) =>
                                        updateQuestionType(q.id, value)
                                      }
                                    >
                                      <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Question Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="short-answer">
                                          <Minus className="inline-block mr-2 h-4 w-4" />Short answer
                                        </SelectItem>
                                        <SelectItem value="paragraph">
                                          <AlignLeft className="inline-block mr-2 h-4 w-4" />Paragraph
                                        </SelectItem>
                                        <SelectItem value="radio-group">
                                          <Circle className="inline-block mr-2 h-4 w-4" />Radio group
                                        </SelectItem>
                                        <SelectItem value="checkboxes">
                                          <CheckSquare className="inline-block mr-2 h-4 w-4" />Checkboxes
                                        </SelectItem>
                                        <SelectItem value="dropdown">
                                          <ChevronDownSquare className="inline-block mr-2 h-4 w-4" />Drop-down
                                        </SelectItem>
                                        <SelectItem value="address">
                                          <Home className="inline-block mr-2 h-4 w-4" />Address
                                        </SelectItem>
                                        <SelectItem value="file-upload">
                                          <FileUp className="inline-block mr-2 h-4 w-4" />File upload
                                        </SelectItem>
                                        <SelectItem value="rating">
                                          <div className="flex items-center">
                                            <Star className="inline-block mr-2 h-4 w-4" />
                                            Rating
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="date">
                                          <Calendar className="inline-block mr-2 h-4 w-4" />Date
                                        </SelectItem>
                                        <SelectItem value="time">
                                          <Clock className="inline-block mr-2 h-4 w-4" />Time
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                  {renderQuestionInput(q)}
                                </CardContent>
                                <CardFooter className="flex justify-end p-0">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => deleteQuestion(q.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </CardFooter>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          <Button variant="outline" className="w-full" onClick={addQuestion}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
