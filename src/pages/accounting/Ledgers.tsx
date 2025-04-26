
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const mockLedgers = [
  {
    id: "GL001",
    account: "Cash",
    debit: 120000,
    credit: 120000,
    balance: 0,
    updated_at: "2025-04-19",
  },
  {
    id: "GL002",
    account: "Inventory",
    debit: 45000,
    credit: 0,
    balance: 45000,
    updated_at: "2025-04-20",
  },
];

const Ledgers = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Accounting Ledgers</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ledger ID</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Debit</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLedgers.map((ledger) => (
            <TableRow key={ledger.id}>
              <TableCell>{ledger.id}</TableCell>
              <TableCell>{ledger.account}</TableCell>
              <TableCell>₦{ledger.debit.toLocaleString()}</TableCell>
              <TableCell>₦{ledger.credit.toLocaleString()}</TableCell>
              <TableCell>₦{ledger.balance.toLocaleString()}</TableCell>
              <TableCell>{ledger.updated_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Ledgers;
