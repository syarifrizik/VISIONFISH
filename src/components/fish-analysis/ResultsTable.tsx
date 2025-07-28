
import React, { useState, useRef, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Trash2,
  SortAsc,
  SortDesc,
  Filter,
  Info,
  Edit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  FishSample, 
  FishParameter,
  getFreshnessBadgeColor,
  hasInvalidValues,
  getInvalidParametersList,
  calculateFreshness
} from '@/utils/fish-analysis';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ResultsTableProps {
  results: FishSample[];
  onDelete: (id: string) => void;
  onSort: (field: keyof FishSample, ascending: boolean) => void;
  onUpdateResults?: (updatedResults: FishSample[]) => void;
}

const ResultsTable = ({ results, onDelete, onSort, onUpdateResults }: ResultsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof FishSample | null>(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [showInvalidOnly, setShowInvalidOnly] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof FishParameter } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [localResults, setLocalResults] = useState<FishSample[]>(results);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update local state when props change
  useEffect(() => {
    setLocalResults(results);
  }, [results]);
  
  const resultsPerPage = 5; // Show 5 rows per page for better readability
  
  // Filter results to show only those with value 4 if the filter is active
  const filteredResults = showInvalidOnly 
    ? localResults.filter(hasInvalidValues)
    : localResults;
    
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, filteredResults.length);
  const currentResults = filteredResults.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (field: keyof FishSample) => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
      onSort(field, !sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
      onSort(field, true);
    }
  };
  
  const renderSortIcon = (field: keyof FishSample) => {
    if (sortField !== field) return null;
    
    return sortAscending ? 
      <SortAsc className="h-3 w-3 ml-1 inline text-visionfish-neon-blue" /> : 
      <SortDesc className="h-3 w-3 ml-1 inline text-visionfish-neon-blue" />;
  };
  
  const renderInvalidScoreWarning = (value: number) => {
    return value === 4 ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 ml-1" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nilai 4 tidak termasuk dalam standar SNI dan diabaikan dalam perhitungan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : null;
  };

  // Handle cell edit start
  const handleCellClick = (id: string, field: keyof FishParameter, value: number) => {
    if (field === 'Mata' || field === 'Insang' || field === 'Lendir' || 
        field === 'Daging' || field === 'Bau' || field === 'Tekstur') {
      setEditingCell({ id, field });
      setEditValue(value.toString());
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  };

  // Handle edit value change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers between 1-9
    if (/^[1-9]$/.test(value) || value === '') {
      setEditValue(value);
    }
  };

  // Handle edit submission
  const handleEditSubmit = () => {
    if (!editingCell || !editValue) {
      setEditingCell(null);
      return;
    }

    const numValue = parseInt(editValue, 10);
    
    // Validate number is between 1-9
    if (isNaN(numValue) || numValue < 1 || numValue > 9) {
      setEditingCell(null);
      return;
    }

    // Find the sample to edit
    const sampleIndex = localResults.findIndex(sample => sample.id === editingCell.id);
    if (sampleIndex === -1) {
      setEditingCell(null);
      return;
    }

    // Create updated sample
    const updatedSample = { ...localResults[sampleIndex] };
    updatedSample[editingCell.field] = numValue;
    
    // Recalculate the score and category
    const recalculated = calculateFreshness({
      Mata: updatedSample.Mata,
      Insang: updatedSample.Insang,
      Lendir: updatedSample.Lendir,
      Daging: updatedSample.Daging,
      Bau: updatedSample.Bau,
      Tekstur: updatedSample.Tekstur
    });
    
    updatedSample.Skor = recalculated.Skor;
    updatedSample.Kategori = recalculated.Kategori;
    
    // Update the local results array
    const updatedResults = [...localResults];
    updatedResults[sampleIndex] = updatedSample;
    
    setLocalResults(updatedResults);
    
    // Propagate changes to parent component
    if (onUpdateResults) {
      onUpdateResults(updatedResults);
    }
    
    // Sort the updated results if needed
    if (sortField) {
      onSort(sortField, sortAscending);
    }
    
    setEditingCell(null);
    
    toast.success(`Nilai ${editingCell.field} diperbarui ke ${numValue}`);
  };
  
  // Handle clicking away from the edit field
  const handleClickOutside = () => {
    handleEditSubmit();
  };

  // Handle key press in edit field
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };
  
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada data analisis
      </div>
    );
  }

  const getRowClasses = (item: FishSample) => {
    return hasInvalidValues(item) 
      ? "bg-amber-500/10 hover:bg-amber-500/20 border-l-4 border-l-amber-500 animate-pulse" 
      : "hover:bg-visionfish-neon-blue/5";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          {showInvalidOnly ? (
            <Badge variant="outline" className="bg-amber-500/10 border-amber-500 text-amber-500">
              Menampilkan hanya sampel dengan nilai 4 (diabaikan SNI)
            </Badge>
          ) : (
            `Menampilkan ${startIndex + 1}-${endIndex} dari ${results.length} hasil`
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Standar SNI</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Tentang Standar SNI Organoletik</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Berdasarkan SNI 2729-2013 tentang Ikan Segar, setiap parameter organoletik memiliki nilai valid yang berbeda sesuai standar nasional.
                    Nilai yang tidak valid akan diabaikan dalam perhitungan untuk memberikan hasil yang akurat.
                  </p>
                  <p>
                    Standar penilaian SNI untuk ikan segar menggunakan skala yang disesuaikan per parameter, dengan kategori:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nilai 9: Prima</li>
                    <li>Nilai 7-8: Baik</li>
                    <li>Nilai 5-6: Sedang</li>
                    <li>Nilai 1-4: Busuk</li>
                  </ul>
                  <div className="mt-4">
                    <a 
                      href="https://www.scribd.com/document/348256275/20016-SNI-2729-2013-Ikan-Segar-pdf" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-visionfish-neon-blue hover:underline"
                    >
                      Baca SNI 2729-2013 Tentang Ikan Segar
                    </a>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Tutup</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 border-visionfish-neon-blue/30 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem
                checked={showInvalidOnly}
                onCheckedChange={setShowInvalidOnly}
              >
                Tampilkan hanya nilai 4
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setSortField('timestamp');
                setSortAscending(false); // Newer first
                onSort('timestamp', false);
              }}>
                Terbaru
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSortField('timestamp');
                setSortAscending(true); // Older first
                onSort('timestamp', true);
              }}>
                Terlama
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSortField('Skor');
                setSortAscending(false); // Highest to lowest
                onSort('Skor', false);
              }}>
                Skor (Tertinggi - Terendah)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSortField('Skor');
                setSortAscending(true); // Lowest to highest
                onSort('Skor', true);
              }}>
                Skor (Terendah - Tertinggi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ScrollArea className="rounded-md border border-visionfish-neon-blue/30 overflow-x-auto max-h-[400px]">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
              <TableRow>
                <TableHead className="w-[80px] text-visionfish-neon-blue">
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('timestamp')}
                  >
                    No. {renderSortIcon('timestamp')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Mata')}
                  >
                    Mata {renderSortIcon('Mata')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Insang')}
                  >
                    Insang {renderSortIcon('Insang')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Lendir')}
                  >
                    Lendir {renderSortIcon('Lendir')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Daging')}
                  >
                    Daging {renderSortIcon('Daging')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Bau')}
                  >
                    Bau {renderSortIcon('Bau')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Tekstur')}
                  >
                    Tekstur {renderSortIcon('Tekstur')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Skor')}
                  >
                    Skor {renderSortIcon('Skor')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-visionfish-neon-blue focus:outline-none"
                    onClick={() => handleSort('Kategori')}
                  >
                    Kategori {renderSortIcon('Kategori')}
                  </button>
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResults.map((item, index) => {
                const hasInvalid = hasInvalidValues(item);
                const invalidParams = hasInvalid ? getInvalidParametersList(item) : [];
                
                return (
                  <TableRow key={item.id || index} className={getRowClasses(item)}>
                    <TableCell className="font-medium text-visionfish-neon-blue">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className={item.Mata === 4 ? 'text-amber-500' : ''}>
                      {editingCell?.id === item.id && editingCell?.field === 'Mata' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={handleClickOutside}
                          onKeyDown={handleEditKeyDown}
                          className="w-10 p-1 border rounded text-center"
                          maxLength={1}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span 
                            className="cursor-pointer hover:bg-visionfish-neon-blue/10 px-2 py-1 rounded flex items-center" 
                            onClick={() => handleCellClick(item.id || '', 'Mata', item.Mata)}
                          >
                            {item.Mata}
                            {renderInvalidScoreWarning(item.Mata)}
                            <Edit className="h-3 w-3 ml-1 opacity-50" />
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={item.Insang === 4 ? 'text-amber-500' : ''}>
                      {editingCell?.id === item.id && editingCell?.field === 'Insang' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={handleClickOutside}
                          onKeyDown={handleEditKeyDown}
                          className="w-10 p-1 border rounded text-center"
                          maxLength={1}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span 
                            className="cursor-pointer hover:bg-visionfish-neon-blue/10 px-2 py-1 rounded flex items-center" 
                            onClick={() => handleCellClick(item.id || '', 'Insang', item.Insang)}
                          >
                            {item.Insang}
                            {renderInvalidScoreWarning(item.Insang)}
                            <Edit className="h-3 w-3 ml-1 opacity-50" />
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={item.Lendir === 4 ? 'text-amber-500' : ''}>
                      {editingCell?.id === item.id && editingCell?.field === 'Lendir' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={handleClickOutside}
                          onKeyDown={handleEditKeyDown}
                          className="w-10 p-1 border rounded text-center"
                          maxLength={1}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span 
                            className="cursor-pointer hover:bg-visionfish-neon-blue/10 px-2 py-1 rounded flex items-center" 
                            onClick={() => handleCellClick(item.id || '', 'Lendir', item.Lendir)}
                          >
                            {item.Lendir}
                            {renderInvalidScoreWarning(item.Lendir)}
                            <Edit className="h-3 w-3 ml-1 opacity-50" />
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={item.Daging === 4 ? 'text-amber-500' : ''}>
                      {editingCell?.id === item.id && editingCell?.field === 'Daging' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={handleClickOutside}
                          onKeyDown={handleEditKeyDown}
                          className="w-10 p-1 border rounded text-center"
                          maxLength={1}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span 
                            className="cursor-pointer hover:bg-visionfish-neon-blue/10 px-2 py-1 rounded flex items-center" 
                            onClick={() => handleCellClick(item.id || '', 'Daging', item.Daging)}
                          >
                            {item.Daging}
                            {renderInvalidScoreWarning(item.Daging)}
                            <Edit className="h-3 w-3 ml-1 opacity-50" />
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={item.Bau === 4 ? 'text-amber-500' : ''}>
                      {editingCell?.id === item.id && editingCell?.field === 'Bau' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={handleClickOutside}
                          onKeyDown={handleEditKeyDown}
                          className="w-10 p-1 border rounded text-center"
                          maxLength={1}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span 
                            className="cursor-pointer hover:bg-visionfish-neon-blue/10 px-2 py-1 rounded flex items-center" 
                            onClick={() => handleCellClick(item.id || '', 'Bau', item.Bau)}
                          >
                            {item.Bau}
                            {renderInvalidScoreWarning(item.Bau)}
                            <Edit className="h-3 w-3 ml-1 opacity-50" />
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={item.Tekstur === 4 ? 'text-amber-500' : ''}>
                      {editingCell?.id === item.id && editingCell?.field === 'Tekstur' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          onBlur={handleClickOutside}
                          onKeyDown={handleEditKeyDown}
                          className="w-10 p-1 border rounded text-center"
                          maxLength={1}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span 
                            className="cursor-pointer hover:bg-visionfish-neon-blue/10 px-2 py-1 rounded flex items-center" 
                            onClick={() => handleCellClick(item.id || '', 'Tekstur', item.Tekstur)}
                          >
                            {item.Tekstur}
                            {renderInvalidScoreWarning(item.Tekstur)}
                            <Edit className="h-3 w-3 ml-1 opacity-50" />
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold">{item.Skor}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getFreshnessBadgeColor(item.Kategori as any)}`}>
                        {item.Kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(item.id || '')}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              // Show maximum 5 page buttons
              let pageNumber = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNumber = currentPage - 3 + i;
                }
                if (currentPage > totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                }
              }
              
              if (pageNumber <= totalPages) {
                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-8 w-8 p-0 ${
                      currentPage === pageNumber ? "bg-visionfish-neon-blue hover:bg-visionfish-neon-blue/90" : ""
                    }`}
                  >
                    {pageNumber}
                  </Button>
                );
              }
              return null;
            })}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
