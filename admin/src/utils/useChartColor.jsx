import { useEffect, useState } from 'react';
import getChartColorsArray from 'Common/ChartsDynamicColor';

const useChartColors = (chartId) => {
  const [chartColors, setChartColors] = useState([]);

  useEffect(() => {
    const colors  = getChartColorsArray(chartId);
    setChartColors(colors);
  }, [chartId]);

  return chartColors;
};

export default useChartColors;
