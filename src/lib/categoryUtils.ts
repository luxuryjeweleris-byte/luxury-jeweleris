/**
 * Category utility functions for consistent category normalization, 
 * canonical definitions, and strict matching across User and Admin interfaces.
 */

export const CANONICAL_CATEGORIES = [
  'Ring',
  'Earrings',
  'Necklace',
  'Bracelet',
  'Wedding Band',
  'Diamond',
  'Gift'
] as const;

export type CanonicalCategory = typeof CANONICAL_CATEGORIES[number];

/**
 * Maps any input category string or alias to a canonical category name.
 */
export function normalizeCategory(categoryInput?: string | null): string {
  if (!categoryInput) return 'Other';
  const clean = categoryInput.trim().toLowerCase();

  if (clean === 'ring' || clean === 'rings' || clean === 'engagement' || clean === 'engagement ring' || clean === 'engagement rings') {
    return 'Ring';
  }
  if (clean === 'earring' || clean === 'earrings' || clean === 'stud' || clean === 'studs' || clean === 'hoop' || clean === 'hoops') {
    return 'Earrings';
  }
  if (clean === 'necklace' || clean === 'necklaces' || clean === 'pendant' || clean === 'pendants' || clean === 'choker' || clean === 'chain') {
    return 'Necklace';
  }
  if (clean === 'bracelet' || clean === 'bracelets' || clean === 'bangle' || clean === 'bangles') {
    return 'Bracelet';
  }
  if (clean === 'wedding band' || clean === 'wedding bands' || clean === 'wedding ring' || clean === 'wedding rings' || clean === 'wedding') {
    return 'Wedding Band';
  }
  if (clean === 'diamond' || clean === 'diamonds' || clean === 'loose diamond' || clean === 'loose gemstone' || clean === 'gemstones') {
    return 'Diamond';
  }
  if (clean === 'gift' || clean === 'gifts') {
    return 'Gift';
  }

  // Capitalize fallback
  return categoryInput.charAt(0).toUpperCase() + categoryInput.slice(1);
}

/**
 * Strict category matching that prevents substring collisions (e.g. 'earrings' matching 'ring').
 */
export function isCategoryMatch(productCategory?: string | null, targetCategory?: string | null): boolean {
  if (!targetCategory || targetCategory === 'All' || targetCategory === 'All Jewelry' || targetCategory === 'All Featured') {
    return true;
  }
  if (!productCategory) return false;

  const normProduct = normalizeCategory(productCategory);
  const normTarget = normalizeCategory(targetCategory);

  return normProduct.toLowerCase() === normTarget.toLowerCase();
}

/**
 * Returns human-readable plural label for display in UI tabs or filters.
 */
export function getCategoryDisplayLabel(categoryKey: string): string {
  const norm = normalizeCategory(categoryKey);
  switch (norm) {
    case 'Ring': return 'Rings';
    case 'Earrings': return 'Earrings';
    case 'Necklace': return 'Necklaces';
    case 'Bracelet': return 'Bracelets';
    case 'Wedding Band': return 'Wedding Bands';
    case 'Diamond': return 'Diamonds';
    case 'Gift': return 'Gifts';
    default:
      return norm.endsWith('s') ? norm : `${norm}s`;
  }
}

/**
 * Safe search query matching using word boundaries so searching "ring" won't match "earring".
 */
export function productMatchesSearchQuery(
  product: { name: string; category?: string | null; style?: string | null; metal?: string | null; shape?: string | null },
  rawQuery: string
): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const name = (product.name || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const style = (product.style || '').toLowerCase();
  const metal = (product.metal || '').toLowerCase();
  const shape = (product.shape || '').toLowerCase();

  // If query is 'ring' or 'rings', avoid matching 'earring' or 'earrings'
  if (q === 'ring' || q === 'rings') {
    const ringRegex = /\bring\b|\brings\b/i;
    const isEarring = category.includes('earring') || name.includes('earring');
    if (isEarring) return false;
    return ringRegex.test(name) || normalizeCategory(product.category) === 'Ring' || ringRegex.test(style);
  }

  return name.includes(q) || category.includes(q) || style.includes(q) || metal.includes(q) || shape.includes(q);
}
