import { atom } from 'nanostores';

// The atom to hold the slugs of products to compare.
export const compareProducts = atom<string[]>([]);

// Helper function to add a product to the comparison list.
export function addProductToCompare(slug: string) {
  const currentProducts = compareProducts.get();
  if (currentProducts.length < 2 && !currentProducts.includes(slug)) {
    compareProducts.set([...currentProducts, slug]);
  } else if (currentProducts.length >= 2) {
    // Optional: provide feedback to the user.
    console.log("Comparison list is full. Can't add more than 2 products.");
    // In a real app, you might use a toast notification.
  }
}

// Helper function to remove a product from the comparison list.
export function removeProductFromCompare(slug: string) {
  const currentProducts = compareProducts.get();
  compareProducts.set(currentProducts.filter(p => p !== slug));
}

// Helper function to check if the list is full.
export function isCompareListFull() {
  return compareProducts.get().length >= 2;
}
