
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { extractTableData, extractConclusion } from "./SpeciesInfoBoxes";
import ReactMarkdown from 'react-markdown';

interface ResultsTableProps {
  markdownData: string | null;
}

const ResultsTable = ({ markdownData }: ResultsTableProps) => {
  if (!markdownData) return null;
  
  const tableData = extractTableData(markdownData);
  const entries = Object.entries(tableData).filter(([_, value]) => value !== "");
  const conclusion = extractConclusion(markdownData);
  
  if (entries.length === 0 && !conclusion) return null;
  
  return (
    <div className="w-full overflow-hidden rounded-md border border-visionfish-neon-blue/30 dark:border-visionfish-neon-blue/50 my-4 shadow-[0_0_15px_rgba(0,183,235,0.15)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,183,235,0.25)]">
      <Table>
        <TableHeader className="bg-visionfish-neon-blue/10 dark:bg-visionfish-neon-blue/20">
          <TableRow>
            <TableHead className="w-1/3 font-semibold text-foreground">Kategori</TableHead>
            <TableHead className="font-semibold text-foreground">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(([key, value]) => (
            <TableRow key={key} className="hover:bg-visionfish-neon-blue/5 dark:hover:bg-visionfish-neon-blue/10 transition-colors">
              <TableCell className="font-medium border-r border-r-visionfish-neon-blue/20 dark:border-r-visionfish-neon-blue/30">
                {key}
              </TableCell>
              <TableCell className={key === "Nama Ilmiah" ? "italic" : ""}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {value}
                  </ReactMarkdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {conclusion && (
            <TableRow className="hover:bg-visionfish-neon-blue/5 dark:hover:bg-visionfish-neon-blue/10 transition-colors bg-visionfish-neon-blue/5">
              <TableCell className="font-medium border-r border-r-visionfish-neon-blue/20 dark:border-r-visionfish-neon-blue/30">
                Kesimpulan Hasil dari VisionFish
              </TableCell>
              <TableCell>
                <div className="prose prose-sm dark:prose-invert max-w-none font-medium">
                  <ReactMarkdown>
                    {conclusion}
                  </ReactMarkdown>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsTable;
