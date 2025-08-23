
"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check, Download, QrCode, Share, Globe, Code, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { DialogProps } from "@radix-ui/react-dialog";
import QRCode from "react-qr-code";

type ShareDialogProps = DialogProps & {
  formId: string;
};


export function ShareDialog({ formId, ...props }: ShareDialogProps) {
  const [link, setLink] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const [hasEmbedCopied, setHasEmbedCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (props.open && formId) {
      setLink(`${window.location.origin}/preview?formId=${formId}`);
      setHasCopied(false);
      setHasEmbedCopied(false);
    }
  }, [props.open, formId]);

  const copyToClipboard = (text: string, setCopied: (value: boolean) => void, message: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: message,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `form-${formId}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareToSocial = (platform: string) => {
    const text = 'Check out this form I created!';
    const url = encodeURIComponent(link);
    const encodedText = encodeURIComponent(text);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedText}&body=Hi there!%0A%0AI'd love for you to fill out this form: ${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const embedCode = `<iframe src="${link}" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>`;

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Your Form
          </DialogTitle>
          <DialogDescription>
            Your form is live and ready to collect responses. Choose how you'd like to share it.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="link" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Link
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-1">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Share className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="embed" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Embed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Direct Link</CardTitle>
                <CardDescription>
                  Share this link directly with your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input id="link" value={link} readOnly className="font-mono text-sm" />
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={() => copyToClipboard(link, setHasCopied, "Link copied to clipboard!")}
                  >
                    {hasCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Anyone with this link can view and respond to your form
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code</CardTitle>
                <CardDescription>
                  Perfect for print materials, presentations, or mobile sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div ref={qrRef} className="bg-white p-4 rounded-lg">
                  <QRCode
                    value={link}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox="0 0 256 256"
                  />
                </div>
                <div className="flex gap-2 w-full">
                  <Button 
                    onClick={() => copyToClipboard(link, setHasCopied, "Link copied to clipboard!")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button onClick={downloadQR} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media</CardTitle>
                <CardDescription>
                  Share your form on social platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('linkedin')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => shareToSocial('email')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Embed Code</CardTitle>
                <CardDescription>
                  Add this form directly to your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="embed-code">HTML Embed Code</Label>
                <div className="flex items-start space-x-2">
                  <textarea
                    id="embed-code"
                    value={embedCode}
                    readOnly
                    className="flex-1 min-h-[100px] p-3 text-sm font-mono border rounded-md resize-none bg-muted"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => copyToClipboard(embedCode, setHasEmbedCopied, "Embed code copied to clipboard!")}
                  >
                    {hasEmbedCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Copy and paste this code into your website's HTML where you want the form to appear.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
