import { useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Filter, 
  Search, 
  Calendar as CalendarIcon, 
  ChevronDown,
  AlertTriangle, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const mockUserActivities = [
  {
    id: "ACT001",
    action: "Product created",
    user: "Jane Doe",
    detail: "Added product Rice 5kg - SKU: RICE005",
    module: "inventory",
    status: "success",
    date: "2025-04-20 09:15",
    ip: "192.168.1.45"
  },
  {
    id: "ACT002",
    action: "Order updated",
    user: "Ibrahim Hassan",
    detail: "Changed order status from Pending to Complete - #ORD4532",
    module: "sales",
    status: "success",
    date: "2025-04-20 10:22",
    ip: "192.168.1.87"
  },
  {
    id: "ACT003",
    action: "Payment recorded",
    user: "Chidi Okafor",
    detail: "Recorded payment of ₦45,000 for invoice #INV3421",
    module: "finance",
    status: "success",
    date: "2025-04-20 11:05",
    ip: "192.168.1.23"
  },
  {
    id: "ACT004",
    action: "Customer updated",
    user: "Fatima Umar",
    detail: "Updated contact information for Lagos Grocers Ltd",
    module: "customers",
    status: "success",
    date: "2025-04-20 12:34",
    ip: "192.168.1.32"
  },
  {
    id: "ACT005",
    action: "Stock adjustment",
    user: "Ibrahim Hassan",
    detail: "Adjusted Rice -5 units due to damage",
    module: "inventory",
    status: "warning",
    date: "2025-04-20 13:15",
    ip: "192.168.1.87"
  },
  {
    id: "ACT006",
    action: "Tax rule deleted",
    user: "Admin System",
    detail: "Deleted expired tax rule 'Holiday Discount 10%'",
    module: "settings",
    status: "error",
    date: "2025-04-20 14:50",
    ip: "192.168.1.1"
  },
  {
    id: "ACT007",
    action: "User permission change",
    user: "Admin System",
    detail: "Changed role for Ibrahim to Branch Manager",
    module: "users",
    status: "success",
    date: "2025-04-20 16:20",
    ip: "192.168.1.1"
  },
];

const moduleOptions = [
  { label: "All Modules", value: "all" },
  { label: "Inventory", value: "inventory" },
  { label: "Sales", value: "sales" },
  { label: "Finance", value: "finance" },
  { label: "Customers", value: "customers" },
  { label: "Settings", value: "settings" },
  { label: "Users", value: "users" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
];

export function UserActivities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  const filteredLogs = mockUserActivities.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesModule = selectedModule === "all" || log.module === selectedModule;
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;
    
    const matchesDate = !date || log.date.startsWith(format(date, "yyyy-MM-dd"));
      
    return matchesSearch && matchesModule && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return "bg-green-100 text-green-800 border-green-200";
      case 'warning':
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 'error':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 gap-1"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isFiltersVisible ? "rotate-180" : ""
          )} />
        </Button>
      </div>
      
      {isFiltersVisible && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Module</label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {moduleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSelectedModule("all");
                  setSelectedStatus("all");
                  setDate(undefined);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
              <TableHead className="hidden lg:table-cell">IP Address</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.id}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {log.module}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(log.status)}
                    <Badge variant="outline" className={cn("capitalize", getStatusColor(log.status))}>
                      {log.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-[250px] truncate">
                  {log.detail}
                </TableCell>
                <TableCell className="hidden lg:table-cell font-mono text-xs">
                  {log.ip}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {log.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default UserActivities;
