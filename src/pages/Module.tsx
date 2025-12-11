import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetModule } from "@/hooks/api";
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SortField = 'kode' | 'label' | 'saldo';
type SortOrder = 'asc' | 'desc';

export function ModuleOtomax() {
    const { dataModul } = useGetModule();
    const [sortField, setSortField] = useState<SortField>('kode');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const sortedData = useMemo(() => {
        const sorted = [...dataModul].sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [dataModul, sortField, sortOrder]);

    const lowBalanceModules = useMemo(() => {
        return dataModul.filter(modul => modul.saldo < 500000);
    }, [dataModul]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="ml-2 h-4 w-4 inline" />;
        }
        return sortOrder === 'asc' 
            ? <ArrowUp className="ml-2 h-4 w-4 inline" />
            : <ArrowDown className="ml-2 h-4 w-4 inline" />;
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Modul Otomax</h1>
            
            {lowBalanceModules.length > 0 && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Peringatan Saldo Rendah!</AlertTitle>
                    <AlertDescription>
                        Ada {lowBalanceModules.length} modul dengan saldo di bawah Rp 500.000:
                        <ul className="mt-2 list-disc list-inside">
                            {lowBalanceModules.map(modul => (
                                <li key={modul.kode}>
                                    {modul.label} ({modul.kode}) - {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR'
                                    }).format(modul.saldo)}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('kode')}
                        >
                            Kode
                            <SortIcon field="kode" />
                        </TableHead>
                        <TableHead 
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('label')}
                        >
                            Label
                            <SortIcon field="label" />
                        </TableHead>
                        <TableHead 
                            className="text-right cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('saldo')}
                        >
                            Saldo
                            <SortIcon field="saldo" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map((modul) => (
                            <TableRow 
                                key={modul.kode}
                                className={modul.saldo < 500000 ? 'bg-red-50' : ''}
                            >
                                <TableCell>{modul.kode}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    {modul.label}
                                    {modul.saldo < 500000 && (
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                    )}
                                </TableCell>
                                <TableCell className={`text-right ${modul.saldo < 500000 ? 'text-red-600 font-semibold' : ''}`}>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR'
                                    }).format(modul.saldo)}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}