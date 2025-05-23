
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from 'react';
import { getStatusColor, getPaymentMethodDisplay } from "./salesTableUtils";
import { Sale } from "@/types/sales";
import { SaleWithUIDetails } from "../History";

type SalesTableProps = {
  sales: SaleWithUIDetails[];
  onView: (sale: SaleWithUIDetails) => void;
};

export function SalesTable({ sales, onView }: SalesTableProps) {
  const handleRowClick = (sale: SaleWithUIDetails) => {
    onView(sale);
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>, 
    sale: SaleWithUIDetails
  ) => {
    e.stopPropagation();
    onView(sale);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden lg:table-cell">Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale: SaleWithUIDetails) => (
            <TableRow 
              key={sale.id} 
              className="cursor-pointer hover:bg-muted/50" 
              onClick={() => handleRowClick(sale)}
            >
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale._invoice_number || sale.id}</TableCell>
              <TableCell>{sale._customer || sale.customer_id || "N/A"}</TableCell>
              <TableCell className="hidden md:table-cell">{sale.created_at}</TableCell>
              <TableCell className="hidden lg:table-cell">{getPaymentMethodDisplay(sale.payment_method)}</TableCell>
              <TableCell>₦{sale.total.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(sale.status)}>
                  {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleButtonClick(e, sale)} 
                  variant="outline" 
                  size="sm"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
