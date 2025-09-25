import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import Footer from '../components/Footer';
<<<<<<< HEAD
import { mockMenuItems, getMockMenuItems } from '../data/mockData';
import { useTranslation } from 'react-i18next';
=======
import { mockMenuItems } from '../data/mockData';
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
<<<<<<< HEAD
    const { language } = require('i18next');
    setTimeout(() => {
      const localized = getMockMenuItems(language);
      setMenuItems(localized);
      const uniqueCategories = ['all', ...new Set(localized.map(item => item.category))];
=======
    setTimeout(() => {
      setMenuItems(mockMenuItems);
      const uniqueCategories = ['all', ...new Set(mockMenuItems.map(item => item.category))];
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
      setCategories(uniqueCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="home-page">
      <Header />
      <Hero />
      <MenuSection
        items={filteredItems}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
      />
      <Footer />
    </div>
  );
};

export default HomePage;