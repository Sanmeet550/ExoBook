export const initialCustomers = [
  { id: 1, name: 'ABC Store', phone: '9876543210', email: 'abc@store.com', country: 'India', state: 'Maharashtra' },
  { id: 2, name: 'XYZ Store', phone: '9876543211', email: 'xyz@store.com', country: 'India', state: 'Gujarat' },
  { id: 3, name: 'John Traders', phone: '9876543212', email: 'john@traders.com', country: 'India', state: 'Karnataka' },
  { id: 4, name: 'Global Logistics', phone: '9876543213', email: 'info@globallogistics.com', country: 'United States', state: 'California' },
  { id: 5, name: 'Apex Solutions', phone: '9876543214', email: 'contact@apex.com', country: 'India', state: 'Maharashtra' }
];

export const initialStates = [
  { id: 1, name: 'Maharashtra', code: 'MH', country: 'India' },
  { id: 2, name: 'Gujarat', code: 'GJ', country: 'India' },
  { id: 3, name: 'Karnataka', code: 'KA', country: 'India' },
  { id: 4, name: 'Delhi', code: 'DL', country: 'India' },
  { id: 5, name: 'California', code: 'CA', country: 'United States' }
];

export const initialCountries = [
  { id: 1, name: 'India', code: 'IN', phoneCode: '+91' },
  { id: 2, name: 'United States', code: 'US', phoneCode: '+1' },
  { id: 3, name: 'United Kingdom', code: 'UK', phoneCode: '+44' },
  { id: 4, name: 'United Arab Emirates', code: 'AE', phoneCode: '+971' },
  { id: 5, name: 'Australia', code: 'AU', phoneCode: '+61' }
];

export const initialItems = [
  { id: 1, name: 'ExoBook Software License', code: 'EXO-001', category: 'Software', price: 499, stock: 100, unit: 'License' },
  { id: 2, name: 'Thermal Receipt Printer', code: 'HW-012', category: 'Hardware', price: 120, stock: 45, unit: 'Pcs' },
  { id: 3, name: 'Barcode Scanner Wireless', code: 'HW-015', category: 'Hardware', price: 85, stock: 30, unit: 'Pcs' },
  { id: 4, name: 'Billing Paper Rolls (Box)', code: 'SUP-002', category: 'Supplies', price: 25, stock: 200, unit: 'Box' },
  { id: 5, name: 'Cloud Backup Storage (1TB)', code: 'SRV-008', category: 'Software', price: 99, stock: 500, unit: 'Year' }
];

export const initialItemCategories = [
  { id: 1, name: 'Software', description: 'Digital products and subscriptions', itemCount: 12 },
  { id: 2, name: 'Hardware', description: 'POS equipment, printers, scanners', itemCount: 28 },
  { id: 3, name: 'Supplies', description: 'Paper rolls, ink cartridges, labels', itemCount: 45 }
];

export const initialSales = [
  { id: 1, invoiceNo: 'INV-2026-001', customerName: 'ABC Store', date: '2026-08-01', amount: '$1,250.00', status: 'Paid' },
  { id: 2, invoiceNo: 'INV-2026-002', customerName: 'XYZ Store', date: '2026-08-02', amount: '$850.00', status: 'Pending' },
  { id: 3, invoiceNo: 'INV-2026-003', customerName: 'John Traders', date: '2026-08-02', amount: '$2,100.00', status: 'Paid' }
];

export const initialPurchases = [
  { id: 1, purchaseNo: 'PO-2026-001', supplierName: 'TechSupply Co', date: '2026-07-28', amount: '$3,400.00', status: 'Completed' },
  { id: 2, purchaseNo: 'PO-2026-002', supplierName: 'PaperWorld Ltd', date: '2026-07-30', amount: '$600.00', status: 'Completed' }
];

export const initialExpenses = [
  { id: 1, expenseNo: 'EXP-101', category: 'Office Supplies', date: '2026-08-01', amount: '$145.00', notes: 'Stationery and printer ink' },
  { id: 2, expenseNo: 'EXP-102', category: 'Utilities', date: '2026-08-01', amount: '$320.00', notes: 'Electricity bill for July' }
];
