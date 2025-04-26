import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Dashboard } from "@/pages/Dashboard";
import { NotFound } from "@/pages/NotFound";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { SessionProvider } from "@/contexts/SessionContext";

// Accounting routes
import { ChartOfAccounts } from "@/pages/accounting/ChartOfAccounts";
import { JournalEntries } from "@/pages/accounting/JournalEntries";
import { BankAccounts } from "@/pages/accounting/BankAccounts";
import { Reconciliation } from "@/pages/accounting/Reconciliation";
import { Ledgers } from "@/pages/accounting/Ledgers";
import { TaxSettings } from "@/pages/accounting/TaxSettings";
import { YearEndClosing } from "@/pages/accounting/YearEndClosing";

// Reports routes
import { Dashboard as ReportsDashboard } from "@/pages/reports/Dashboard";
import { ProfitLoss } from "@/pages/reports/ProfitLoss";
import { BalanceSheet } from "@/pages/reports/BalanceSheet";
import { CashFlow } from "@/pages/reports/CashFlow";
import { TrialBalance } from "@/pages/reports/TrialBalance";
import { Sales as SalesReports } from "@/pages/reports/Sales";
import { Stock } from "@/pages/reports/Stock";
import { DeadStock } from "@/pages/reports/DeadStock";
import { Financials } from "@/pages/reports/Financials";

// Sales routes
import { History } from "@/pages/sales/History";
import { POS } from "@/pages/sales/POS";
import { POSAddItem } from "@/pages/sales/POSAddItem";
import { Customers } from "@/pages/sales/Customers";
import { CustomerGroups } from "@/pages/sales/CustomerGroups";
import { Quotations } from "@/pages/sales/Quotations";
import { Deliveries } from "@/pages/sales/Deliveries";
import { Returns as SalesReturns } from "@/pages/sales/Returns";
import { Discounts } from "@/pages/sales/Discounts";
import { PaymentPlans } from "@/pages/sales/PaymentPlans";

// Inventory routes
import { Products } from "@/pages/inventory/Products";
import { StockAdjustments } from "@/pages/inventory/StockAdjustments";
import { Transfers } from "@/pages/inventory/Transfers";
import { ReorderAlerts } from "@/pages/inventory/ReorderAlerts";

// Purchases routes
import { Suppliers } from "@/pages/purchases/Suppliers";
import { SupplierGroups } from "@/pages/purchases/SupplierGroups";
import { Orders } from "@/pages/purchases/Orders";
import { GoodsReceived } from "@/pages/purchases/GoodsReceived";
import { Ledger as PurchasesLedger } from "@/pages/purchases/Ledger";
import { Returns as PurchasesReturns } from "@/pages/purchases/Returns";

// Audit logs routes
import { AuditLogs } from "@/pages/audit-logs/AuditLogs";
import { LoginHistory } from "@/pages/audit-logs/LoginHistory";
import { RecordChanges } from "@/pages/audit-logs/RecordChanges";
import { UserActivities } from "@/pages/audit-logs/UserActivities";

// Settings routes
import { Settings } from "@/pages/settings/Settings";
import { Users } from "@/pages/settings/Users";
import { Companies } from "@/pages/settings/Companies";
import { DeviceManagement } from "@/pages/settings/DeviceManagement";
import { POSSettings } from "@/pages/settings/POSSettings";
import { ReceiptSettings } from "@/pages/settings/ReceiptSettings";
import { Attributes } from "@/pages/settings/Attributes";
import { Permissions } from "@/pages/settings/Permissions";
import { TaxCurrencies } from "@/pages/settings/TaxCurrencies";
import { Localization } from "@/pages/settings/Localization";
import { BackupRestore } from "@/pages/settings/BackupRestore";
import { DeveloperTools } from "@/pages/settings/DeveloperTools";

// Notification routes
import { Templates } from "@/pages/notifications/Templates";
import { NotificationTemplatesPage } from "@/pages/notifications/NotificationTemplatesPage";

// Billing routes
import { Subscription } from "@/pages/billing/Subscription";
import { PaymentHistory } from "@/pages/billing/PaymentHistory";
import { UpgradePlan } from "@/pages/billing/UpgradePlan";

// Import routes
import { CustomerImport } from "@/pages/extras/imports/CustomerImport";
import { ProductImport } from "@/pages/extras/imports/ProductImport";
import { SalesImport } from "@/pages/extras/imports/SalesImport";
import { Attachments } from "@/pages/extras/documents/Attachments";

function App() {
  return (
    <SessionProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounting/chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="accounting/journal-entries" element={<JournalEntries />} />
          <Route path="accounting/bank-accounts" element={<BankAccounts />} />
          <Route path="accounting/reconciliation" element={<Reconciliation />} />
          <Route path="accounting/ledgers" element={<Ledgers />} />
          <Route path="accounting/tax-settings" element={<TaxSettings />} />
          <Route path="accounting/year-end-closing" element={<YearEndClosing />} />

          {/* Reports routes */}
          <Route path="reports/dashboard" element={<ReportsDashboard />} />
          <Route path="reports/profit-loss" element={<ProfitLoss />} />
          <Route path="reports/balance-sheet" element={<BalanceSheet />} />
          <Route path="reports/cash-flow" element={<CashFlow />} />
          <Route path="reports/trial-balance" element={<TrialBalance />} />
          <Route path="reports/sales" element={<SalesReports />} />
          <Route path="reports/stock" element={<Stock />} />
          <Route path="reports/dead-stock" element={<DeadStock />} />
          <Route path="reports/financials" element={<Financials />} />

          {/* Sales routes */}
          <Route path="sales/history" element={<History />} />
          <Route path="sales/pos" element={<POS />} />
          <Route path="sales/pos-add-item" element={<POSAddItem />} />
          <Route path="sales/customers" element={<Customers />} />
          <Route path="sales/customer-groups" element={<CustomerGroups />} />
          <Route path="sales/quotations" element={<Quotations />} />
          <Route path="sales/deliveries" element={<Deliveries />} />
          <Route path="sales/returns" element={<SalesReturns />} />
          <Route path="sales/discounts" element={<Discounts />} />
          <Route path="sales/payment-plans" element={<PaymentPlans />} />

          {/* Inventory routes */}
          <Route path="inventory/products" element={<Products />} />
          <Route path="inventory/stock-adjustments" element={<StockAdjustments />} />
          <Route path="inventory/transfers" element={<Transfers />} />
          <Route path="inventory/reorder-alerts" element={<ReorderAlerts />} />

          {/* Purchases routes */}
          <Route path="purchases/suppliers" element={<Suppliers />} />
          <Route path="purchases/supplier-groups" element={<SupplierGroups />} />
          <Route path="purchases/orders" element={<Orders />} />
          <Route path="purchases/goods-received" element={<GoodsReceived />} />
          <Route path="purchases/ledger" element={<PurchasesLedger />} />
          <Route path="purchases/returns" element={<PurchasesReturns />} />

          {/* Audit logs routes */}
          <Route path="audit-logs/audit-logs" element={<AuditLogs />} />
          <Route path="audit-logs/login-history" element={<LoginHistory />} />
          <Route path="audit-logs/record-changes" element={<RecordChanges />} />
          <Route path="audit-logs/user-activities" element={<UserActivities />} />

          {/* Settings routes */}
          <Route path="settings/settings" element={<Settings />} />
          <Route path="settings/users" element={<Users />} />
          <Route path="settings/companies" element={<Companies />} />
          <Route path="settings/device-management" element={<DeviceManagement />} />
          <Route path="settings/pos-settings" element={<POSSettings />} />
          <Route path="settings/receipt-settings" element={<ReceiptSettings />} />
          <Route path="settings/attributes" element={<Attributes />} />
          <Route path="settings/permissions" element={<Permissions />} />
          <Route path="settings/tax-currencies" element={<TaxCurrencies />} />
          <Route path="settings/localization" element={<Localization />} />
          <Route path="settings/backup-restore" element={<BackupRestore />} />
          <Route path="settings/developer-tools" element={<DeveloperTools />} />

          {/* Notification routes */}
          <Route path="notifications/templates" element={<Templates />} />
          <Route path="notifications/notification-templates" element={<NotificationTemplatesPage />} />

          {/* Billing routes */}
          <Route path="billing/subscription" element={<Subscription />} />
          <Route path="billing/payment-history" element={<PaymentHistory />} />
          <Route path="billing/upgrade-plan" element={<UpgradePlan />} />

          {/* Import routes */}
          <Route path="extras/imports/customer-import" element={<CustomerImport />} />
          <Route path="extras/imports/product-import" element={<ProductImport />} />
          <Route path="extras/imports/sales-import" element={<SalesImport />} />

          {/* Document routes */}
          <Route path="extras/documents/attachments" element={<Attachments />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </SessionProvider>
  );
}

export default App;
