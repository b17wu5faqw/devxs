import { useMediaQuery } from '@mui/material';

const useDetect = () => {
  const isMobile = useMediaQuery('(max-width:999.98px)');
  const isDesktop = useMediaQuery('(min-width:1200px)');
  return { isMobile ,isDesktop};
};

export default useDetect;
