import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import Header from "./Header";
import StatusBar from "./StatusBar";
import MenuItem from "./MenuItem";
import Footer from "./Footer";
import { mockMenuData } from "../data/mockData";
import "./PopularPage.css";

const PopularPage = () => {
  // Get popular items from all categories (items with high ratings)
  const popularItems = Object.values(mockMenuData)
    .flatMap(category => category.items)
    .filter(item => item.rating && item.rating >= 5)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);

  return (
    <div className="popular-page">
      <Header />
      <StatusBar />
      
      <div className="popular-container">
        <div className="popular-header">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} />
            <span>Назад до меню</span>
          </Link>
          
          <div className="popular-title">
            <Star size={24} />
            <h1>Популярні страви</h1>
          </div>
        </div>
        
        <div className="popular-content">
          {popularItems.length > 0 ? (
            <div className="popular-items">
              {popularItems.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="no-popular">
              <Star size={48} />
              <h3>Поки що немає популярних страв</h3>
              <p>Перші відгуки допоможуть сформувати список популярних страв</p>
              <Link to="/" className="back-to-menu">
                Переглянути меню
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PopularPage;