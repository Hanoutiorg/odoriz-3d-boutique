
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/product/ProductCard';

const Catalogue = () => {
  const location = useLocation();
  const { 
    products, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    resetFilters, 
    getFilteredProducts,
    searchProductsByQuery 
  } = useProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Pour Homme', label: 'Pour Homme' },
    { value: 'Pour Femme', label: 'Pour Femme' },
    { value: 'Niche', label: 'Niche' }
  ];

  const brands = [
    { value: 'all', label: 'Toutes les marques' },
    ...Array.from(new Set(products.map(p => p.brand).filter(Boolean))).map(brand => ({
      value: brand as string,
      label: brand as string
    }))
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom (A-Z)' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Meilleures notes' },
    { value: 'newest', label: 'Nouveautés' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    
    if (filter === 'new') {
      updateFilters({ sortBy: 'newest' });
    } else if (filter === 'bestsellers') {
      updateFilters({ sortBy: 'rating' });
    }
  }, [location.search, updateFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProductsByQuery(searchQuery);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'category') {
      updateFilters({ category: value === 'all' ? '' : value });
    } else if (filterType === 'brand') {
      updateFilters({ brand: value === 'all' ? '' : value });
    } else if (filterType === 'sortBy') {
      updateFilters({ sortBy: value });
    }
  };

  const handlePriceChange = (value) => {
    updateFilters({ 
      minPrice: value[0], 
      maxPrice: value[1] 
    });
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Erreur lors du chargement des produits: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-playfair font-bold text-center mb-8">
          Notre Catalogue
        </h1>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un parfum, une marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Rechercher</Button>
          </div>
        </form>

        {/* Filtres */}
        <div className="bg-card p-6 rounded-lg mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filtres</h2>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <Select 
                value={filters.category || 'all'} 
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marque */}
            <div>
              <label className="block text-sm font-medium mb-2">Marque</label>
              <Select 
                value={filters.brand || 'all'} 
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Prix: {filters.minPrice}€ - {filters.maxPrice}€
              </label>
              <div className="px-3 py-2">
                <Slider
                  min={0}
                  max={500}
                  step={10}
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium mb-2">Trier par</label>
              <Select 
                value={filters.sortBy || 'name'} 
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} produit(s) trouvé(s)
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grille de produits */}
        <motion.div
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProductCard 
                product={product} 
                viewMode={viewMode} 
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              Aucun produit ne correspond à vos critères de recherche.
            </p>
            <Button onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Catalogue;
