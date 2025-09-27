'use client';

import React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const CookieConsentBanner = () => {
  const { consents, updateConsent, closeBanner, acceptAllConsents } = useCookieConsent();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Vaše soukromí je pro nás důležité</CardTitle>
          <CardDescription>
            Používáme cookies, abychom vylepšili váš zážitek z prohlížení. Více informací naleznete v našich <Link href="/zasady-ochrany-osobnich-udaju" className="underline">zásadách ochrany osobních údajů</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <Label htmlFor="necessary" className="font-semibold">Nezbytné cookies</Label>
              <Switch id="necessary" checked disabled />
            </div>
            <div className="flex items-center justify-between p-2 rounded-md">
              <Label htmlFor="analytics">Analytické cookies</Label>
              <Switch
                id="analytics"
                checked={consents.analytics}
                onCheckedChange={(checked: boolean) => updateConsent('analytics', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded-md">
              <Label htmlFor="marketing">Marketingové cookies</Label>
              <Switch
                id="marketing"
                checked={consents.marketing}
                onCheckedChange={(checked: boolean) => updateConsent('marketing', checked)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeBanner}>Uložit moje preference</Button>
            <Button onClick={acceptAllConsents}>Přijmout vše</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsentBanner;