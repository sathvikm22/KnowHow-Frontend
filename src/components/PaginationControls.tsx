import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({ page, totalPages, onPageChange }: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <Button variant="outline" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </Button>
      <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
      <Button variant="outline" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
