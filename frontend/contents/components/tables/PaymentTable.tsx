import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'mantine-react-table';
import { Box, Button, Badge } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv';

// Define Payment data type
interface Payment {
  id: number;
  details: string;
  amount: number;
  month: string;
  year: number;
  recipient: string[];
  team: string[];
}

interface PaymentTableProps {
  data: Payment[];
}

const PaymentTable = ({ data }: PaymentTableProps) => {
  const columns: MRT_ColumnDef<Payment>[] = [
    {
      accessorKey: 'details',
      header: 'Details',
      size: 200,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      size: 100,
    },
    {
      accessorKey: 'month',
      header: 'Month',
      size: 100,
    },
    {
      accessorKey: 'year',
      header: 'Year',
      size: 100,
    },
    {
      accessorKey: 'recipient_team',
      header: 'Recipients & Teams',
      size: 250,
      Cell: ({ row }) => (
        <Box className="space-y-1">
          <Box className="flex flex-wrap gap-1">
            {row.original.recipient.map((r, idx) => (
              <Badge key={`recipient-${idx}`} color="blue" radius="sm">
                {r}
              </Badge>
            ))}
          </Box>
          <Box className="flex flex-wrap gap-1">
            {row.original.team.map((t, idx) => (
              <Badge key={`team-${idx}`} color="green" radius="sm">
                {t}
              </Badge>
            ))}
          </Box>
        </Box>
      ),
    },
  ];

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<Payment>[]) => {
    const rowData = rows.map((row) => {
      const original = row.original;

      // Convert arrays to comma-separated strings
      return {
        ...original,
        recipient: original.recipient.join(', '),
        team: original.team.join(', '),
      };
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const transformedData = data.map((payment) => ({
      ...payment,
      recipient: payment.recipient.join(', '),
      team: payment.team.join(', '),
    }));

    const csv = generateCsv(csvConfig)(transformedData);
    download(csvConfig)(csv);
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          color="lightblue"
          onClick={handleExportData}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MantineReactTable table={table} />;
};

export default PaymentTable;
