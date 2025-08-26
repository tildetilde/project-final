import React, { useState, useMemo } from 'react';
import { Heading, Button, ErrorMessage } from '../ui';
import { DotPattern } from '../ui';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useItems } from '../hooks/useItems';
import LoginForm from '../components/admin/LoginForm';
import CategoriesTab from '../components/admin/CategoriesTab';
import ItemsTab from '../components/admin/ItemsTab';

const AdminPage: React.FC = () => {
  const { isAuthenticated, admin, token, login, logout, error: authError, loading: authLoading } = useAuth();
  const { 
    categories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    error: categoriesError 
  } = useCategories(token);
  const { 
    items, 
    createItem, 
    updateItem, 
    deleteItem, 
    error: itemsError 
  } = useItems(token);

  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Sort and group items by category
  const sortedAndGroupedItems = useMemo(() => {
    const filteredItems = selectedCategoryFilter === 'all' 
      ? items 
      : items.filter(item => item.categoryId === selectedCategoryFilter);
    
    // Group by category
    const grouped = filteredItems.reduce((acc, item) => {
      const categoryId = item.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Sort items within each category alphabetically
    Object.keys(grouped).forEach(categoryId => {
      grouped[categoryId].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
  }, [items, selectedCategoryFilter]);

  const handleLogin = async (username: string, password: string) => {
    return await login(username, password);
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={handleLogin}
        loading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Logout Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      
      <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div>
              <div className="text-xs sm:text-sm tracking-wider uppercase text-muted-foreground">
                Admin Panel
              </div>
              <Heading
                level={1}
                className="leading-[0.95] text-foreground"
                style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
              >
                Quiz Management
              </Heading>
              <p className="mt-3 sm:mt-4 text-muted-foreground">
                Welcome back, {admin?.username}
              </p>
            </div>
          </div>

          {/* Error Messages */}
          {(authError || categoriesError || itemsError) && (
            <div className="mb-6">
              <ErrorMessage message={authError || categoriesError || itemsError || ''} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <Button
              variant={activeTab === 'categories' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('categories')}
            >
              Categories ({categories.length})
            </Button>
            <Button
              variant={activeTab === 'items' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('items')}
            >
              Items ({items.length})
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'categories' ? (
            <CategoriesTab
              categories={categories}
              onEdit={setEditingCategory}
              onDelete={deleteCategory}
              onCreate={() => setShowCreateForm(true)}
              editingCategory={editingCategory}
              showCreateForm={showCreateForm}
              onSave={createCategory}
              onUpdate={updateCategory}
              onCancel={() => {
                setEditingCategory(null);
                setShowCreateForm(false);
              }}
            />
          ) : (
            <ItemsTab
              items={sortedAndGroupedItems}
              categories={categories}
              onEdit={setEditingItem}
              onDelete={deleteItem}
              onCreate={() => setShowCreateForm(true)}
              editingItem={editingItem}
              showCreateForm={showCreateForm}
              onSave={createItem}
              onUpdate={updateItem}
              onCancel={() => {
                setEditingItem(null);
                setShowCreateForm(false);
              }}
              selectedCategoryFilter={selectedCategoryFilter}
              setSelectedCategoryFilter={setSelectedCategoryFilter}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
