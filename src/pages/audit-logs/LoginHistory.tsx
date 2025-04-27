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
  CheckCircle2, 
  XCircle,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/card";

const mockLoginHistory = [
  {
    id: "LOGIN001",
    user: "Jane Doe",
    email: "jane@example.com",
    status: "success",
    device: "mobile",
    browser: "Chrome Mobile",
    ip: "192.168.1.45",
    location: "Lagos, Nigeria",
    date: "2025-04-20 08:30"
  },
  {
    id: "LOGIN002",
    user: "Ibrahim Hassan",
    email: "ibrahim@example.com",
    status: "success",
    device: "desktop",
    browser: "Firefox",
    ip: "192.168.1.87",
    location: "Abuja, Nigeria",
    date: "2025-04-20 09:15"
  },
  {
    id: "LOGIN003",
    user: "Chidi Okafor",
    email: "chidi@example.com",
    status: "failed",
    device: "tablet",
    browser: "Safari",
    ip: "192.168.1.23",
    location: "Port Harcourt, Nigeria",
    date: "2025-04-20 09:45"
  },
  {
    id: "LOGIN004",
    user: "Fatima Umar",
    email: "fatima@example.com",
    status: "success",
    device: "desktop",
    browser: "Chrome",
    ip: "192.168.1.32",
    location: "Kano, Nigeria",
    date: "2025-04-20 10:30"
  },
  {
    id: "LOGIN005",
    user: "Jane Doe",
    email: "jane@example.com",
    status: "failed",
    device: "unknown",
    browser: "Unknown Browser",
    ip: "203.0.113.42",
    location: "Unknown Location",
    date: "2025-04-20 12:10"
  },
  {
    id: "LOGIN006",
    user: "Ibrahim Hassan",
    email: "ibrahim@example.com",
    status: "warning",
    device: "desktop",
    browser: "Edge",
    ip: "192.168.1.87",
    location: "Abuja, Nigeria",
    date: "2025-04-20 14:45"
  },
  {
    id: "LOGIN007",
    user: "Admin System",
    email: "admin@example.com",
    status: "success",
    device: "desktop",
    browser: "Chrome",
    ip: "192.168.1.1",
    location: "Lagos, Nigeria",
    date: "2025-04-20 16:30"
  },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
  { label: "Warning", value: "warning" },
];

const deviceOptions = [
  { label: "All Devices", value: "all" },
  { label: "Desktop", value: "desktop" },
  { label: "Mobile", value: "mobile" },
  { label: "Tablet", value: "tablet" },
  { label: "Unknown", value: "unknown" },
];

export function LoginHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  const filteredLogs = mockLoginHistory.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;
    const matchesDevice = selectedDevice === "all" || log.device === selectedDevice;
    
    const matchesDate = !date || log.date.startsWith(format(date, "yyyy-MM-dd"));
      
    return matchesSearch && matchesStatus && matchesDevice && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="h-4 w-4 text-blue-500" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4 text-violet-500" />;
      case 'tablet':
        return <Tablet className="h-4 w-4 text-cyan-500" />;
      default:
        return <Laptop className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return "bg-green-100 text-green-800 border-green-200";
      case 'failed':
        return "bg-red-100 text-red-800 border-red-200";
      case 'warning':
        return "bg-amber-100 text-amber-800 border-amber-200";
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
            placeholder="Search login history..."
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
              <label className="text-sm font-medium mb-1 block">Device</label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  {deviceOptions.map((option) => (
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
                  setSelectedStatus("all");
                  setSelectedDevice("all");
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
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Device</TableHead>
              <TableHead className="hidden md:table-cell">Browser</TableHead>
              <TableHead className="hidden lg:table-cell">IP Address</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Date/Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.id}</TableCell>
                <TableCell>
                  <div>
                    <div>{log.user}</div>
                    <div className="text-xs text-muted-foreground">{log.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(log.status)}
                    <Badge variant="outline" className={cn("capitalize", getStatusColor(log.status))}>
                      {log.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getDeviceIcon(log.device)}
                    <span className="capitalize">{log.device}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {log.browser}
                </TableCell>
                <TableCell className="hidden lg:table-cell font-mono text-xs">
                  {log.ip}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {log.location}
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

export default LoginHistory;
