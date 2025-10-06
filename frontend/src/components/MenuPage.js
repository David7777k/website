import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./legacy/Header";
import StatusBar from "./legacy/StatusBar";
import Sidebar from "./legacy/Sidebar";
import MenuContent from "./legacy/MenuContent";
import RestaurantInfo from "./legacy/RestaurantInfo";
import Footer from "./legacy/Footer";
import { mockMenuData } from "../data/mockData";
import "./MenuPage.css";

const MenuPage = () => {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || "kalyan");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const toggleFavorite = (itemId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const currentCategoryData = mockMenuData[selectedCategory] || mockMenuData.kalyan;

  return (
    <div className="menu-page">
      <Header />
      <StatusBar />
      
      <div className="main-container">
        <div className="gradient-background">
          <div className="gradient-left"></div>
          <div className="gradient-right"></div>
        </div>
        
        <div className="content-wrapper">
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          
          <MenuContent 
            categoryData={currentCategoryData}
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
          
          <RestaurantInfo 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MenuPage;