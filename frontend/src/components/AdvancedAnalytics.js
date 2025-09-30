// AdvancedAnalytics.js
import React, { useState, useEffect, useRef } from 'react';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const [activeTab, setActiveTab] = useState('visitors');
  const [timeRange, setTimeRange] = useState('week');
  const canvasRef = useRef(null);

  // Mock data for analytics
  const [analyticsData, setAnalyticsData] = useState({
    visitors: {
      total: 15420,
      change: '+12.5%',
      data: [120, 145, 160, 180, 165, 190, 210]
    },
    revenue: {
      total: 890450,
      change: '+8.2%',
      data: [15000, 18000, 16500, 22000, 19500, 25000, 28000]
    },
    orders: {
      total: 3460,
      change: '+15.3%',
      data: [45, 52, 48, 65, 58, 72, 78]
    },
    satisfaction: {
      total: 4.8,
      change: '+0.3',
      data: [4.2, 4.4, 4.6, 4.5, 4.7, 4.8, 4.8]
    }
  });

  const kpiCards = [
    {
      title: 'Загальні відвідувачі',
      value: analyticsData.visitors.total.toLocaleString(),
      change: analyticsData.visitors.change,
      icon: '👥',
      color: '#10B981'
    },
    {
      title: 'Дохід',
      value: `₴${analyticsData.revenue.total.toLocaleString()}`,
      change: analyticsData.revenue.change,
      icon: '💰',
      color: '#F59E0B'
    },
    {
      title: 'Замовлення',
      value: analyticsData.orders.total.toLocaleString(),
      change: analyticsData.orders.change,
      icon: '📋',
      color: '#3B82F6'
    },
    {
      title: 'Оцінка',
      value: analyticsData.satisfaction.total,
      change: analyticsData.satisfaction.change,
      icon: '⭐',
      color: '#8B5CF6'
    }
  ];

  // Chart drawing functions
  const drawLineChart = (canvas, data, color = '#10B981') => {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Setup
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Background
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (chartWidth / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Data line
    if (data && data.length > 0) {
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '10');
      
      ctx.beginPath();
      
      // Draw line and area
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = height - padding - ((data[i] - min) / range) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Draw points
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      ctx.stroke();
      
      // Fill area under line
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  };

  const drawBarChart = (canvas, data, color = '#3B82F6') => {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Background
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    if (data && data.length > 0) {
      const max = Math.max(...data);
      const barWidth = chartWidth / data.length * 0.6;
      const barSpacing = chartWidth / data.length * 0.4;
      
      data.forEach((value, index) => {
        const barHeight = (value / max) * chartHeight;
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
        const y = height - padding - barHeight;
        
        // Create gradient for bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '60');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Add value label
        ctx.fillStyle = '#E5E7EB';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      });
    }
  };

  const drawPieChart = (canvas, data, colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']) => {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    if (data && data.length > 0) {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 20;
      
      const total = data.reduce((sum, value) => sum + value, 0);
      let currentAngle = -Math.PI / 2;
      
      data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        
        // Add percentage label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * radius * 0.7;
        const labelY = centerY + Math.sin(labelAngle) * radius * 0.7;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${((value / total) * 100).toFixed(1)}%`, labelX, labelY);
        
        currentAngle += sliceAngle;
      });
    }
  };

  const drawAreaChart = (canvas, data, color = '#8B5CF6') => {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Background
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    if (data && data.length > 0) {
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      
      // Create smooth curve
      ctx.beginPath();
      
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = height - padding - ((data[i] - min) / range) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = padding + (chartWidth / (data.length - 1)) * (i - 1);
          const prevY = height - padding - ((data[i - 1] - min) / range) * chartHeight;
          
          const cpX1 = prevX + (x - prevX) * 0.5;
          const cpY1 = prevY;
          const cpX2 = prevX + (x - prevX) * 0.5;
          const cpY2 = y;
          
          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x, y);
        }
      }
      
      // Complete the area
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color + '60');
      gradient.addColorStop(1, color + '10');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw border line
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const y = height - padding - ((data[i] - min) / range) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = padding + (chartWidth / (data.length - 1)) * (i - 1);
          const prevY = height - padding - ((data[i - 1] - min) / range) * chartHeight;
          
          const cpX1 = prevX + (x - prevX) * 0.5;
          const cpY1 = prevY;
          const cpX2 = prevX + (x - prevX) * 0.5;
          const cpY2 = y;
          
          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x, y);
        }
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  // Update chart when active tab or time range changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    switch (activeTab) {
      case 'visitors':
        drawLineChart(canvas, analyticsData.visitors.data, '#10B981');
        break;
      case 'revenue':
        drawBarChart(canvas, analyticsData.revenue.data, '#F59E0B');
        break;
      case 'orders':
        drawAreaChart(canvas, analyticsData.orders.data, '#3B82F6');
        break;
      case 'satisfaction':
        drawLineChart(canvas, analyticsData.satisfaction.data, '#8B5CF6');
        break;
      case 'demographics':
        drawPieChart(canvas, [35, 25, 20, 20], ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']);
        break;
      default:
        break;
    }
  }, [activeTab, timeRange, analyticsData]);

  const tabs = [
    { id: 'visitors', name: 'Відвідувачі', icon: '👥' },
    { id: 'revenue', name: 'Дохід', icon: '💰' },
    { id: 'orders', name: 'Замовлення', icon: '📋' },
    { id: 'satisfaction', name: 'Задоволеність', icon: '⭐' },
    { id: 'demographics', name: 'Демографія', icon: '📊' }
  ];

  const timeRanges = [
    { id: 'day', name: 'День' },
    { id: 'week', name: 'Тиждень' },
    { id: 'month', name: 'Місяць' },
    { id: 'quarter', name: 'Квартал' },
    { id: 'year', name: 'Рік' }
  ];

  return (
    <div className="analytics-dashboard">
      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <div className="header-content">
            <h1>Розширена Аналітика</h1>
            <p>Детальний аналіз ефективності вашого бізнесу</p>
          </div>
          <div className="time-range-selector">
            {timeRanges.map(range => (
              <button
                key={range.id}
                className={`time-btn ${timeRange === range.id ? 'active' : ''}`}
                onClick={() => setTimeRange(range.id)}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-cards">
          {kpiCards.map((card, index) => (
            <div key={index} className="kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon" style={{ background: card.color + '20' }}>
                  {card.icon}
                </div>
                <div className={`kpi-change ${card.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {card.change}
                </div>
              </div>
              <div className="kpi-value">{card.value}</div>
              <div className="kpi-title">{card.title}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="analytics-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>
              {tabs.find(tab => tab.id === activeTab)?.name} - {timeRanges.find(range => range.id === timeRange)?.name}
            </h3>
            <div className="chart-controls">
              <button className="export-btn">
                📊 Експорт
              </button>
              <button className="fullscreen-btn">
                ⛶ Повний екран
              </button>
            </div>
          </div>
          <div className="chart-wrapper">
            <canvas ref={canvasRef} className="analytics-chart"></canvas>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="additional-analytics">
          <div className="analytics-grid">
            {/* Top Locations */}
            <div className="analytics-card">
              <h3>Топ Локації</h3>
              <div className="location-list">
                {[
                  { name: 'Київ', visitors: 5420, percentage: 35 },
                  { name: 'Львів', visitors: 3260, percentage: 21 },
                  { name: 'Одеса', visitors: 2890, percentage: 19 },
                  { name: 'Харків', visitors: 2140, percentage: 14 },
                  { name: 'Дніпро', visitors: 1710, percentage: 11 }
                ].map((location, index) => (
                  <div key={index} className="location-item">
                    <div className="location-info">
                      <span className="location-name">{location.name}</span>
                      <span className="location-visitors">{location.visitors} відвідувачів</span>
                    </div>
                    <div className="location-bar">
                      <div 
                        className="location-fill" 
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="location-percentage">{location.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="analytics-card">
              <h3>Джерела Трафіку</h3>
              <div className="traffic-sources">
                {[
                  { source: 'Органічний пошук', visitors: 6240, color: '#10B981' },
                  { source: 'Соціальні мережі', visitors: 4130, color: '#3B82F6' },
                  { source: 'Пряме відвідування', visitors: 3520, color: '#F59E0B' },
                  { source: 'Реферальні сайти', visitors: 1530, color: '#8B5CF6' }
                ].map((source, index) => (
                  <div key={index} className="traffic-item">
                    <div className="traffic-indicator" style={{ background: source.color }}></div>
                    <div className="traffic-info">
                      <span className="traffic-source">{source.source}</span>
                      <span className="traffic-visitors">{source.visitors.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Items */}
            <div className="analytics-card">
              <h3>Популярні Страви</h3>
              <div className="popular-items">
                {[
                  { name: 'Борщ традиційний', orders: 324, revenue: 25920 },
                  { name: 'Котлета по-київськи', orders: 298, revenue: 35760 },
                  { name: 'Вареники з картоплею', orders: 276, revenue: 19320 },
                  { name: 'Курка в горшочку', orders: 234, revenue: 28080 },
                  { name: 'Салат "Олів\'є"', orders: 198, revenue: 11880 }
                ].map((item, index) => (
                  <div key={index} className="popular-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-stats">
                        {item.orders} замовлень • ₴{item.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;