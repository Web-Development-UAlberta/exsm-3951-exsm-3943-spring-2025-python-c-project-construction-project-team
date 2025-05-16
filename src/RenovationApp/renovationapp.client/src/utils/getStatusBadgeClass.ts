// Utility function for determining badge classes
export const getRequestStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'new':
      return 'bg-primary';
    case 'pending':
      return 'bg-warning';
    case 'approved':
      return 'bg-success';
    case 'in progress':
      return 'bg-info';
    case 'completed':
      return 'bg-dark';
    case 'declined':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};


export const getProjectStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'created':
      return 'bg-primary';
    case 'Pending':
      return 'bg-warning';
    case 'on hold':
      return 'bg-warning';
    case 'in progress':
      return 'bg-info';
    case 'completed':
      return 'bg-dark';
    case 'cancelled':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};