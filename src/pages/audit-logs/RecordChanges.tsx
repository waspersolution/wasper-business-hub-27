
import { useState } from "react";
import { format } from "date-fns";
import { RecordFilters } from "./components/RecordFilters";
import { RecordDetailsDialog } from "./components/RecordDetailsDialog";
import { RecordsTable } from "./components/RecordsTable";
import { mockRecordChanges } from "./data/mockRecordChanges";

export function RecordChanges() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter logs based on search term, action, module, and date
  const filteredRecords = mockRecordChanges.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = selectedAction === "all" || record.action === selectedAction;
    const matchesModule = selectedModule === "all" || record.module === selectedModule;
    const matchesDate = !date || record.date.startsWith(format(date, "yyyy-MM-dd"));
      
    return matchesSearch && matchesAction && matchesModule && matchesDate;
  });

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  return (
    <>
      <RecordFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        date={date}
        setDate={setDate}
        isFiltersVisible={isFiltersVisible}
        setIsFiltersVisible={setIsFiltersVisible}
      />
      
      <RecordsTable 
        records={filteredRecords}
        onViewDetails={handleViewDetails}
      />

      <RecordDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        record={selectedRecord}
      />
    </>
  );
}

export default RecordChanges;
