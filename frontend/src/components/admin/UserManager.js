import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Crown,
  Shield
} from 'lucide-react';
import './UserManager.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@lounge.com',
        phone: '+380123456789',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-09-30T10:30:00Z',
        createdAt: '2024-01-15T09:00:00Z',
        avatar: null,
        totalOrders: 0,
        totalSpent: 0
      },
      {
        id: 2,
        username: 'john_doe',
        email: 'john@example.com',
        phone: '+380987654321',
        role: 'user',
        status: 'active',
        lastLogin: '2024-09-29T18:45:00Z',
        createdAt: '2024-02-20T14:30:00Z',
        avatar: null,
        totalOrders: 15,
        totalSpent: 2500
      },
      {
        id: 3,
        username: 'staff_maria',
        email: 'maria@lounge.com',
        phone: '+380555123456',
        role: 'staff',
        status: 'active',
        lastLogin: '2024-09-30T08:15:00Z',
        createdAt: '2024-03-10T11:00:00Z',
        avatar: null,
        totalOrders: 0,
        totalSpent: 0
      },
      {
        id: 4,
        username: 'alex_smith',
        email: 'alex@example.com',
        phone: '+380777888999',
        role: 'user',
        status: 'banned',
        lastLogin: '2024-09-25T20:00:00Z',
        createdAt: '2024-04-05T16:45:00Z',
        avatar: null,
        totalOrders: 3,
        totalSpent: 450
      },
      {
        id: 5,
        username: 'vip_client',
        email: 'vip@example.com',
        phone: '+380111222333',
        role: 'vip',
        status: 'active',
        lastLogin: '2024-09-30T12:00:00Z',
        createdAt: '2024-01-30T10:20:00Z',
        avatar: null,
        totalOrders: 45,
        totalSpent: 12500
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, filterRole, filterStatus]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown size={16} />;
      case 'staff': return <Shield size={16} />;
      case 'vip': return <Crown size={16} />;
      default: return <Users size={16} />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'staff': return 'role-badge staff';
      case 'vip': return 'role-badge vip';
      default: return 'role-badge user';
    }
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`;
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return;
    
    switch (action) {
      case 'activate':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'active' }
            : user
        ));
        break;
      case 'ban':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'banned' }
            : user
        ));
        break;
      case 'delete':
        if (window.confirm(`Видалити ${selectedUsers.length} користувачів?`)) {
          setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
        }
        break;
    }
    
    setSelectedUsers([]);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  if (isLoading) {
    return (
      <div className="user-manager">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Завантаження користувачів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-info">
          <h2>Управління користувачами</h2>
          <p>Всього користувачів: {users.length}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          Додати користувача
        </button>
      </div>

      {/* Filters */}
      <div className="manager-filters">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Пошук за іменем, email або телефоном..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Всі ролі</option>
            <option value="admin">Адміністратори</option>
            <option value="staff">Персонал</option>
            <option value="vip">VIP клієнти</option>
            <option value="user">Користувачі</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Всі статуси</option>
            <option value="active">Активні</option>
            <option value="banned">Заблоковані</option>
            <option value="pending">Очікують</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span>Вибрано: {selectedUsers.length}</span>
          <div className="bulk-buttons">
            <button 
              className="btn btn-secondary"
              onClick={() => handleBulkAction('activate')}
            >
              <CheckCircle size={16} />
              Активувати
            </button>
            <button 
              className="btn btn-warning"
              onClick={() => handleBulkAction('ban')}
            >
              <Ban size={16} />
              Заблокувати
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => handleBulkAction('delete')}
            >
              <Trash2 size={16} />
              Видалити
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Користувач</th>
              <th>Контакти</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Останній вхід</th>
              <th>Статистика</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                  />
                </td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.username}</div>
                      <div className="user-id">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <div className="contact-item">
                      <Mail size={14} />
                      {user.email}
                    </div>
                    <div className="contact-item">
                      <Phone size={14} />
                      {user.phone}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {getRoleIcon(user.role)}
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(user.status)}>
                    {user.status === 'active' ? 'Активний' :
                     user.status === 'banned' ? 'Заблокований' :
                     user.status === 'pending' ? 'Очікує' : user.status}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} />
                    {formatDate(user.lastLogin)}
                  </div>
                </td>
                <td>
                  <div className="stats-cell">
                    <div>Замовлень: {user.totalOrders}</div>
                    <div>Витрачено: ₴{user.totalSpent}</div>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn"
                      onClick={() => setEditingUser(user)}
                      title="Редагувати"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn danger"
                      onClick={() => {
                        if (window.confirm('Видалити користувача?')) {
                          setUsers(prev => prev.filter(u => u.id !== user.id));
                        }
                      }}
                      title="Видалити"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <h3>Користувачів не знайдено</h3>
            <p>Спробуйте змінити параметри пошуку</p>
          </div>
        )}
      </div>

      {/* Модалки для додавання/редагування - заглушки */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Додати користувача</h3>
            <p>Функція в розробці</p>
            <button onClick={() => setShowAddModal(false)}>Закрити</button>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Редагувати користувача: {editingUser.username}</h3>
            <p>Функція в розробці</p>
            <button onClick={() => setEditingUser(null)}>Закрити</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;