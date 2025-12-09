interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        // Always show first page
        pages.push(1);

        // Show dots if currentPage is far from the start
        if (currentPage > 4) {
            pages.push('...');
        }

        // Calculate middle pages (2 before and after current)
        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Show dots if currentPage is far from the end
        if (currentPage < totalPages - 3) {
            pages.push('...');
        }

        // Always show last page if there are more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        // Remove duplicate numbers while preserving order
        return [...new Set(pages)];
    };

    const pageList = getPageNumbers();

    return (
        <div className="flex items-center justify-start gap-1 text-sm px-4 py-4">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded disabled:opacity-50 !cursor-pointer"
            >
                &lt;
            </button>

            {pageList.map((page, idx) => {
                if (page === '...') {
                    return <span key={`dots-${idx}`} className="px-2 py-1">...</span>;
                } else {
                    return (
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(Number(page))}
                            className={`px-3 py-1 border rounded !cursor-pointer ${page === currentPage ? 'bg-[#FF69B4] text-white' : ''}`}
                        >
                            {page}
                        </button>
                    );
                }
            })}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50 !cursor-pointer"
            >
                &gt;
            </button>
        </div>
    );
};
