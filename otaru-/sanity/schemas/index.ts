/**
 * OTARU — Sanity Schema Index
 */

import { blockContent } from './blockContent';
import { chapter } from './chapter';
import { journal } from './journal';
import { studioPage } from './studio';
import { symbol } from './symbol';
import { materialSpec } from './materialSpec';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
  blockContent,
  chapter,
  journal,
  studioPage,
  symbol,
  materialSpec,
  siteSettings,
];
