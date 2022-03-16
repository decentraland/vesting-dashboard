import { useState, useEffect, useCallback } from "react";
import Responsive from "semantic-ui-react/dist/commonjs/addons/Responsive";

let CURRENT_WIDTH = Responsive.onlyMobile.maxWidth;

function useResponsive() {
  const [width, setWidth] = useState(CURRENT_WIDTH);
  useEffect(() => {
    function updateWidth() {
      const currentWidth = window.innerWidth;

      if (CURRENT_WIDTH !== currentWidth) {
        CURRENT_WIDTH = currentWidth;
      }

      if (width !== currentWidth) {
        setWidth(currentWidth);
      }
    }

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return useCallback(
    function responsive(limits = {}) {
      if (limits.minWidth !== undefined && width < limits.minWidth) {
        return false;
      }

      if (limits.maxWidth !== undefined && width > limits.maxWidth) {
        return false;
      }

      return true;
    },
    [width]
  );
}

export default useResponsive;
