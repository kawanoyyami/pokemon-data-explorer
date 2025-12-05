import { Card, CardContent, Skeleton, Box } from '@mui/material';

export const SkeletonCard = () => {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} />
        <Box mt={2}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="90%" />
        </Box>
      </CardContent>
    </Card>
  );
};
