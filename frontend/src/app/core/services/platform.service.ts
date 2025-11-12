import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private isNative = Capacitor.isNativePlatform();

  async initialize(): Promise<void> {
    if (!this.isBrowser || !this.isNative) return;

    try {
      // Set status bar style to light (white text) for dark navbar
      await StatusBar.setStyle({ style: Style.Light });
      
      // Set background color to match navbar
      await StatusBar.setBackgroundColor({ color: '#1a1a2e' });
      
      // Show the status bar if hidden
      await StatusBar.show();
    } catch (error) {
      console.warn('StatusBar plugin not available:', error);
    }
  }
}
