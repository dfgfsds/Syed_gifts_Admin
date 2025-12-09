import { create } from 'zustand';
import { Theme } from '../types';

interface ThemeState {
  themes: Theme[];
  loading: boolean;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  themes: [
    {
      id: '1',
      name: 'Modern Minimal',
      description: 'Clean and minimalist design for modern brands',
      previewUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      price: 79,
    },
    {
      id: '2',
      name: 'Bold Commerce',
      description: 'Stand out with bold typography and vibrant colors',
      previewUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
      price: 99,
    },
    {
      id: '3',
      name: 'Elegant Boutique',
      description: 'Sophisticated design for luxury brands',
      previewUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      price: 129,
    },
  ],
  loading: false,
}));