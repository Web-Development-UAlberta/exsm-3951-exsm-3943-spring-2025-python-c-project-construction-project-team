// Utility function for determining badge classes
export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-warning';
    case 'approved':
      return 'bg-success';
    case 'in progress':
      return 'bg-primary';
    case 'completed':
      return 'bg-info';
    case 'declined':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};