import React from 'react';
import { DollarSign, Users, Package, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react';
import ListView from '../../components/listview/ListView';
import { initialSales } from '../../services/mockData';
import './Dashboard.css';

export const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: '$42,580', change: '+14.2%', icon: DollarSign, isAccent: true },
    { title: 'Active Customers', value: '1,248', change: '+8.1%', icon: Users },
    { title: 'Items in Stock', value: '856', change: '-2.4%', icon: Package },
    { title: 'Total Invoices', value: '342', change: '+18.5%', icon: ShoppingCart }
  ];

  const recentSalesColumns = [
    { key: 'invoiceNo', label: 'Invoice No' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`status-badge ${val === 'Paid' ? 'paid' : 'pending'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>Welcome to Exobook Dashboard</h1>
          <p>Here is an overview of your business activities today.</p>
        </div>
        <div className="banner-badge">
          <TrendingUp size={18} color="#262755" />
          <span>Live Business Metrics</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`stat-card ${stat.isAccent ? 'accent-card' : ''}`}>
              <div className="stat-header">
                <span className="stat-title">{stat.title}</span>
                <div className="stat-icon-wrapper">
                  <Icon size={20} />
                </div>
              </div>
              <div className="stat-body">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change} <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reusable ListView for Recent Transactions */}
      <div className="dashboard-section">
        <ListView
          title="Recent Sales Invoices"
          columns={recentSalesColumns}
          data={initialSales}
          searchPlaceholder="Search recent invoices..."
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default Dashboard;
