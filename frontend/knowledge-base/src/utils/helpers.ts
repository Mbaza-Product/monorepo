/* eslint-disable no-restricted-syntax */
import { ICategory } from '@/types/category.type';

interface ITreeCategory {
  title: string;
  key: string;
  children?: ITreeCategory[];
}
export const formatTreeCategoryData = (
  data: ICategory[],
  parentKey?: string,
): ITreeCategory[] => {
  if (data.length === 0) return [];
  return data.map(category => {
    const key = parentKey
      ? `${category.id},${parentKey}`
      : category.id.toString();

    const formattedChildren = formatTreeCategoryData(
      category.children,
      key,
    );
    const add = {
      title: 'Add new',
      key: `${category.id},${category.id},add`,
      icon: '➕ ',
    };
    return {
      title: category.name,
      key,
      children: [add, ...formattedChildren],
    };
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('en', {
    month: 'long',
  }).format(date);
  const year = date.getFullYear();
  const suffix =
    // eslint-disable-next-line no-nested-ternary
    day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
  return `${day} ${month} ${year}`;
};

export function findCategoryById(
  categories: ICategory[],
  categoryId: number,
): ICategory | null {
  // Iterate through each category in the current level
  for (const category of categories) {
    // Check if the current category has the desired ID
    if (category.id === categoryId) {
      return category; // Found the category
    }

    // If the current category has children, recursively search within them
    if (category.children && category.children.length > 0) {
      const foundCategory = findCategoryById(
        category.children,
        categoryId,
      );
      if (foundCategory) {
        return foundCategory; // Found the category in children
      }
    }
  }

  return null; // Category not found
}
