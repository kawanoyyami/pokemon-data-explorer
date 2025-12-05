import { Box, Alert, Typography, Button } from '@mui/material';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorDisplay = ({
  message,
  onRetry,
  retryLabel = 'Retry',
}: ErrorDisplayProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      gap={2}
      p={3}
    >
      <Alert severity="error" sx={{ mb: 2 }}>
        {message}
      </Alert>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
      {!onRetry && (
        <Typography variant="body2" color="text.secondary">
          Please try again later
        </Typography>
      )}
    </Box>
  );
};
