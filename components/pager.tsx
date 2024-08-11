import { useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface Props {
  itemsCount: number;
  handleChangePage: (page: number) => void;
  validatePage: (page: number) => boolean;
  filter?: any;
  interval?: number;
  trigger?: boolean;
  synchronized?: boolean;
  showPages?: boolean;
}

function Pager({ itemsCount, handleChangePage, validatePage, interval = 10, filter, trigger = false, synchronized = false, showPages = true }: Props) {
  const currentPage = useRef<number>(0);
  const items = useRef<number>(itemsCount);
  const currentFilter = useRef<any>(filter);
  const currentTrigger = useRef<any>(trigger);
  const currentSynchronized = useRef<any>(synchronized);

  useEffect(() => {
    if (filter && currentFilter.current !== filter) {
      currentFilter.current = filter;
      currentPage.current = 0;
      items.current = itemsCount;
      handleChangePage(0);
    } else if (!validatePage(currentPage.current)) {
      handleSelectPage(pagesCount - 1);
    } else if (trigger !== currentTrigger.current) {
      currentTrigger.current = trigger;
      handleChangePage(currentPage.current);
    } else if (synchronized !== currentSynchronized.current) {
      currentSynchronized.current = synchronized;
      currentPage.current = 0;
      handleChangePage(currentPage.current);
    }
  });

  function handleSelectPage(new_page: number) {
    currentPage.current = new_page;
    items.current = itemsCount;
    handleChangePage(new_page);
  }

  function createPages() {
    const pages = [];
    const MAX_INDEX = 3;
    const FIRST_PAGE = 1;
    const LAST_PAGE = pagesCount - MAX_INDEX + 1;

    if (pagesCount < MAX_INDEX) {
      for (let i = FIRST_PAGE; i <= pagesCount; i += 1) {
        pages.push(i);
      }
    } else if (currentPage.current + 1 < MAX_INDEX) {
      for (let i = FIRST_PAGE; i <= MAX_INDEX; i += 1) {
        pages.push(i);
      }
      pages.push('>>');
    } else if (currentPage.current + 1 >= MAX_INDEX && currentPage.current + 1 <= pagesCount - (MAX_INDEX - 1)) {
      pages.push('<<');
      for (let i = currentPage.current; i <= currentPage.current + 2; i += 1) {
        pages.push(i);
      }
      pages.push('>>');
    } else {
      pages.push('<<');
      for (let i = LAST_PAGE; i <= pagesCount; i += 1) {
        pages.push(i);
      }
    }

    return pages;
  }

  function SelectedPage(page: any) {
    if (page === '>>') {
      handleSelectPage(pagesCount - 1);
    } else if (page === '<<') {
      handleSelectPage(0);
    } else {
      handleSelectPage(page - 1);
    }
  }

  function ShowPage(page: any) {
    switch (page) {
      case '<<':
        return (
          <button className="page-link" onClick={() => SelectedPage(page)}>
            <FaArrowLeft />
          </button>
        );
      case '>>':
        return (
          <button className="page-link" onClick={() => SelectedPage(page)}>
            <FaArrowRight />
          </button>
        );
      case currentPage.current + 1:
        return (
          <button style={{ backgroundColor: '#c0ccf3' }} className="rounded-circle page-link text-dark" onClick={() => SelectedPage(page)}>
            {page}
          </button>
        );
      default:
        return (
          <button className="page-link" onClick={() => SelectedPage(page)}>
            {page}
          </button>
        );
    }
  }

  const pagesCount = Math.ceil(itemsCount / interval);
  const pages = createPages();

  if (!showPages) {
    return null;
  }

  return (
    <>
      {pages.length > 1 && (
        <nav aria-label="Pagination">
          <ul className="pagination justify-content-center mb-0">
            {pages.map((page) => (
              <li className="page-item" key={`page${page}`}>
                {ShowPage(page)}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

export { Pager };
