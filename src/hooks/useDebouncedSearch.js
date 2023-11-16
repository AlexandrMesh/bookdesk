import { useCallback, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

const useDebouncedSearch = (searchFunc, searchText, delay) => {
  const [searchQuery, setSearchQuery] = useState(searchText || '');
  const [isBusy, setIsBusy] = useState(false);

  const debouncedSearch = useRef(
    debounce((value) => {
      searchFunc(value);
      setIsBusy(false);
    }, delay),
  );

  const handleChange = useCallback(
    (value) => {
      setIsBusy(true);
      debouncedSearch.current(value);
      setSearchQuery(value);
    },
    [setSearchQuery, searchText],
  );

  const clearSearchText = () => setSearchQuery('');

  return [searchQuery, handleChange, clearSearchText, isBusy];
};

export default useDebouncedSearch;
