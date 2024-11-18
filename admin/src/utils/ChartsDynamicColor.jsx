function rgbToHex(rgb) {
    // Extract RGB values using regular expressions
    const rgbValues = rgb.match(/\d+/g);
  
    if (rgbValues && rgbValues.length === 3) {
      const [r, g, b] = rgbValues.map(Number);
  
      // Ensure the values are within the valid range (0-255)
      const validR = Math.max(0, Math.min(255, r));
      const validG = Math.max(0, Math.min(255, g));
      const validB = Math.max(0, Math.min(255, b));
  
      // Convert each component to its hexadecimal representation
      const rHex = validR.toString(16).padStart(2, '0');
      const gHex = validG.toString(16).padStart(2, '0');
      const bHex = validB.toString(16).padStart(2, '0');
  
      // Combine the hexadecimal values with the "#" prefix
      const hexColor = `#${rHex}${gHex}${bHex}`;
      return hexColor.toUpperCase(); // Convert to uppercase for consistency
    }
  
    return '';
  }
  
  // Common function to get charts colors from class
  function getChartColorsArray(chartId) {
    const chartElement = document.getElementById(chartId);
  
    if (chartElement) {
      const colors = chartElement.dataset.chartColors;
  
      if (colors) {
        const parsedColors = JSON.parse(colors);
  
        const mappedColors = parsedColors.map((value) => {
          const newValue = value.replace(/\s/g, '');
  
          if (!newValue.includes('#')) {
            const element = document.querySelector(newValue);
  
            if (element) {
              const styles = window.getComputedStyle(element);
              const backgroundColor = styles.backgroundColor;
              return backgroundColor || newValue;
            } else {
              const divElement = document.createElement('div');
              divElement.className = newValue;
              document.body.appendChild(divElement);
  
              const styles = window.getComputedStyle(divElement);
              const backgroundColor = styles.backgroundColor.includes('#') ? styles.backgroundColor : rgbToHex(styles.backgroundColor);
              return backgroundColor || newValue;
            }
          } else {
            return newValue;
          }
        });
  
        return mappedColors;
      } else {
        console.warn(`chart-colors attribute not found on: ${chartId}`);
      }
    }
  
    return undefined;
  }
  
  export default getChartColorsArray;
  