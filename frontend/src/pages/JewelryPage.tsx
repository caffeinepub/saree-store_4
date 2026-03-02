import React from 'react';
import { Category } from '../backend';
import CategoryPage from './CategoryPage';

export default function JewelryPage() {
  return (
    <CategoryPage
      category={Category.jewelry}
      title="Jewelry"
      subtitle="Ornate Splendour"
      bannerImage="/assets/generated/jewelry-category.dim_600x400.png"
    />
  );
}
