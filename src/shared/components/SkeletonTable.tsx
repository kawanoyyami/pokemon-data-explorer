import { Table, TableBody, TableCell, TableRow, Skeleton, TableContainer, Paper } from '@mui/material';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable = ({ rows = 5, columns = 4 }: SkeletonTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  {colIndex === 1 ? (
                    <Skeleton variant="circular" width={64} height={64} />
                  ) : (
                    <Skeleton variant="text" width="80%" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
