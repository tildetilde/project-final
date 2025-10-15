import React, { useState, useMemo } from 'react';
import { Heading, Button, ErrorMessage } from '../ui';
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

  const sortedAndGroupedItems = useMemo(() => {
    const filteredItems = selectedCategoryFilter === 'all' 
      ? items 
      : items.filter(item => item.categoryId === selectedCategoryFilter);
    
    const grouped = filteredItems.reduce((acc, item) => {
      const categoryId = item.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    
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
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      
      <section className="relative mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-12 pb-8 flex-grow">
        <div className="relative z-10">
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

          {(authError || categoriesError || itemsError) && (
            <div className="mb-6">
              <ErrorMessage message={authError || categoriesError || itemsError || ''} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-1 mb-6">
            <Button
              variant={activeTab === 'categories' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('categories')}
              className="w-full sm:w-auto"
            >
              Categories ({categories.length})
            </Button>
            <Button
              variant={activeTab === 'items' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('items')}
              className="w-full sm:w-auto"
            >
              Items ({items.length})
            </Button>
          </div>

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
