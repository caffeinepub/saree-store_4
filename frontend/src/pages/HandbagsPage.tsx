import React from 'react';
import { Category } from '../backend';
import CategoryPage from './CategoryPage';

export default function HandbagsPage() {
  return (
    <CategoryPage
      category={Category.handbag}
      title="Handbags"
      subtitle="Artisan Crafted"
      bannerImage="/assets/generated/handbag-category.dim_600x400.png"
    />
  );
}
