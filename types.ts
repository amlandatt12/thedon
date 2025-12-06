import React from 'react';
import { LucideIcon } from 'lucide-react';

export enum Category {
  TEXT = 'Text & String',
  IMAGE = 'Image & Graphics',
  PDF = 'PDF & Docs',
  DEV = 'Developer Tools',
  MATH = 'Math & Unit',
  FINANCE = 'Finance',
  FILE = 'File & Zip',
  PRODUCTIVITY = 'Productivity',
  CONVERSION = 'Conversion',
  GENERATOR = 'Generators'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: LucideIcon;
  component: React.ComponentType;
  popular?: boolean;
  new?: boolean;
}

export type Theme = 'dark' | 'light';