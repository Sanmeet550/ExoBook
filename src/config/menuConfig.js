import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  ShoppingBag, 
  Receipt,
  Settings
} from 'lucide-react';


export const menuConfig = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    submenu: [
      { label: "Dashboard", path: "/dashboard" }
    ]
  },
  {
    key: "items",
    label: "Item",
    icon: Package,
    path: "/items",
    submenu: [
      { label: "Item", path: "/items" },
      { label: "Item Category", path: "/items/categories" },
      { label: "UOM", path: "/items/uom" }
    ]
  },
  {
    key: "customers",
    label: "Customer",
    icon: Users,
    path: "/customers",
    submenu: [
      { label: "Customer", path: "/customers" },
      { label: "State", path: "/customers/states" },
      { label: "Country", path: "/customers/countries" }
    ]
  },
  {
    key: 'master',
    label: 'Master Data',
    path: '/master',
    icon: Settings,
    submenu: [
      { label: 'Company', path: '/master/company' },
      { label: 'Warehouse', path: '/master/warehouse' },
      { label: 'Users', path: '/master/users' },
    ],
  },
  {
    key: "sales",
    label: "Sales",
    icon: ShoppingCart,
    path: "/sales",
    submenu: [
      { label: "Sales", path: "/sales" }
    ]
  },
  {
    key: "purchase",
    label: "Purchase",
    icon: ShoppingBag,
    path: "/purchases",
    submenu: [
      { label: "Purchase", path: "/purchases" }
    ]
  },
  {
    key: "expenses",
    label: "Expenses",
    icon: Receipt,
    path: "/expenses",
    submenu: [
      { label: "Expenses", path: "/expenses" }
    ]
  }
];
