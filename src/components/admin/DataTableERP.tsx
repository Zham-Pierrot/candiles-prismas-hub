import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { DateFilterValue } from '@/hooks/useTableFilters';
import { useIsMobile } from '@/hooks/use-mobile';

// ─── Types ───

export interface KPICard {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  separator?: boolean;
  destructive?: boolean;
}

export interface StatusConfig {
  [key: string]: { label: string; className: string };
}

interface DataTableERPProps<T> {
  title: string;
  kpis: KPICard[];
  columns: ColumnDef<T>[];
  data: T[];
  actions?: RowAction<T>[];
  statuses: StatusConfig;
  statusOptions: string[];
  // Filter state
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  dateFilter: DateFilterValue;
  onDateChange: (v: DateFilterValue) => void;
  clientFilter: string;
  onClientChange: (v: string) => void;
  clients: string[];
  // Sort
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  // Pagination
  page: number;
  pageSize: number;
  totalPages: number;
  totalFiltered: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  // Row click
  onRowClick?: (item: T) => void;
  // Header actions
  headerActions?: ReactNode;
  // Mobile card renderer
  mobileCardRender?: (item: T) => ReactNode;
  getItemId: (item: T) => string;
}

const dateOptions: { value: DateFilterValue; label: string }[] = [
  { value: 'all', label: 'Todas las fechas' },
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: '3months', label: 'Últimos 3 meses' },
];

export function DataTableERP<T extends Record<string, any>>({
  title,
  kpis,
  columns,
  data,
  actions,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  statuses,
  dateFilter,
  onDateChange,
  clientFilter,
  onClientChange,
  clients,
  sortField,
  sortDirection,
  onSort,
  page,
  pageSize,
  totalPages,
  totalFiltered,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  headerActions,
  mobileCardRender,
  getItemId,
}: DataTableERPProps<T>) {
  const isMobile = useIsMobile();
  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, totalFiltered);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDirection === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
      : <ChevronDown className="h-3.5 w-3.5 text-primary" />;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading text-2xl font-bold">{title}</h2>
        {headerActions}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <div className={`flex items-center justify-center h-9 w-9 rounded-lg ${kpi.color || 'bg-primary/10 text-primary'}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                <p className="font-heading font-bold text-lg leading-tight">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="py-3 px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por folio o cliente..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={v => onDateChange(v as DateFilterValue)}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {dateOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {clients.length > 0 && (
                <Select value={clientFilter} onValueChange={onClientChange}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Cliente" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table / Mobile Cards */}
      <Card className="border-none shadow-sm overflow-hidden">
        {isMobile && mobileCardRender ? (
          <div className="divide-y">
            {data.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No se encontraron registros</div>
            ) : (
              data.map(item => (
                <div key={getItemId(item)} onClick={() => onRowClick?.(item)} className="cursor-pointer hover:bg-muted/30 transition-colors">
                  {mobileCardRender(item)}
                </div>
              ))
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.filter(c => !isMobile || !c.hideOnMobile).map(col => (
                  <TableHead
                    key={String(col.key)}
                    className={`${col.className || ''} ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                    onClick={() => col.sortable && onSort(String(col.key))}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <SortIcon field={String(col.key)} />}
                    </div>
                  </TableHead>
                ))}
                {actions && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12 text-muted-foreground">
                    No se encontraron registros
                  </TableCell>
                </TableRow>
              ) : (
                data.map(item => (
                  <TableRow
                    key={getItemId(item)}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.filter(c => !isMobile || !c.hideOnMobile).map(col => (
                      <TableCell key={String(col.key)} className={`py-2.5 px-4 ${col.className || ''}`}>
                        {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="py-2.5 px-2" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action, i) => (
                              <span key={i}>
                                {action.separator && <DropdownMenuSeparator />}
                                <DropdownMenuItem
                                  onClick={() => action.onClick(item)}
                                  className={action.destructive ? 'text-destructive' : ''}
                                >
                                  {action.icon && <span className="mr-2">{action.icon}</span>}
                                  {action.label}
                                </DropdownMenuItem>
                              </span>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Mostrando</span>
            <span className="font-medium text-foreground">{totalFiltered > 0 ? startIdx : 0}-{endIdx}</span>
            <span>de</span>
            <span className="font-medium text-foreground">{totalFiltered}</span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={String(pageSize)} onValueChange={v => onPageSizeChange(Number(v))}>
              <SelectTrigger className="w-[70px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 min-w-[60px] text-center">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Reusable status badge
export function StatusBadge({ status, config }: { status: string; config: StatusConfig }) {
  const s = config[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  return <Badge className={`${s.className} font-medium`}>{s.label}</Badge>;
}
