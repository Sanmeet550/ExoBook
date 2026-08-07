import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import ItemList from '../pages/Items/ItemList';
import ItemCategoryList from '../pages/Items/ItemCategoryList';
import UOMList from '../pages/Items/UOMList';
import CustomerList from '../pages/Customers/CustomerList';
import StateList from '../pages/Customers/StateList';
import CountryList from '../pages/Customers/CountryList';
import SalesList from '../pages/Sales/SalesList';
import PurchaseList from '../pages/Purchases/PurchaseList';
import ExpenseList from '../pages/Expenses/ExpenseList';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Default redirect to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Item Module Routes */}
        <Route path="items" element={<ItemList />} />
        <Route path="items/categories" element={<ItemCategoryList />} />
        <Route path="items/uom" element={<UOMList />} />

        {/* Customer Module Routes */}
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/states" element={<StateList />} />
        <Route path="customers/countries" element={<CountryList />} />

        {/* Sales Module Route */}
        <Route path="sales" element={<SalesList />} />

        {/* Purchase Module Route */}
        <Route path="purchases" element={<PurchaseList />} />

        {/* Expenses Module Route */}
        <Route path="expenses" element={<ExpenseList />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
