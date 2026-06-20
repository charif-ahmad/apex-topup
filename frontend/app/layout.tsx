import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'APEX | Digital Top-Up Platform',
  description: 'Fast, secure digital top-up and wallet services.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark h-full`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Material Symbols is subset to ONLY the icons this app renders via the
          `icon_names` param — this shrinks the icon font from the full library
          (hundreds of KiB) to a few KiB. If you add a new icon anywhere, append
          its ligature name to this list or it will render as plain text.
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_balance,account_balance_wallet,account_tree,add,add_circle,admin_panel_settings,alternate_email,apps,arrow_downward,arrow_forward,arrow_upward,block,bolt,calendar_today,cancel,card_giftcard,category,check_circle,chevron_left,chevron_right,close,dashboard,delete_forever,edit,fingerprint,group,hourglass_empty,insights,lock,lock_open,logout,manage_accounts,menu,payments,policy,receipt_long,search,shield,smartphone,swap_horiz,tag,trending_flat,trending_up,verified,verified_user,visibility,visibility_off,warning,wifi&display=block"
        />
      </head>
      <body className="min-h-full antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
