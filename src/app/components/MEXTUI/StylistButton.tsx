import { useState } from "react";
import { StylistButtonPropsType } from "./types";
import { CgSpinner } from "react-icons/cg";


const StylistButton: React.FC<StylistButtonPropsType> = ({
    type = "button",
    size = "sm",
    bgColor = "blue",
    bgColorOnHover = "red",
    textColor = "white",
    childrenBeforeLabel = false,
    loading = false,
    onLoading,
    loadingLabel,
    space = 1,
    label = "Stylist Button",
    children,
    ...props
}) => {


  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const RenderContent = () => {
    if (loading) {
      return (
        <>
          {childrenBeforeLabel ? (
            <>
              <CgSpinner size={16} className="animate-spin" />
              <p style={{marginLeft: space}}>{loadingLabel}</p>
            </>
          ) : (
            <>
              <p style={{marginRight: space}}>{loadingLabel}</p>
              <CgSpinner size={16} className="animate-spin" />
            </>
          )}
        </>
      );
    } else {
      return (
        <>
          {childrenBeforeLabel ? (
            <>
              {children}
              <p style={{marginLeft: space}}>{label}</p>
            </>
          ) : (
            <>
              <p style={{marginRight: space}}>{label}</p>
              {children}
            </>
          )}
        </>
      );
    }
  };

  let responsiveClasses;

  if (size === "sm") responsiveClasses = "px-3 py-[7px] text-sm";
  else if (size === "md") responsiveClasses = "px-4 py-2";
  else if (size === "lg") responsiveClasses = "px-6 py-3";


  return (
    <button
        type={type}
        {...props}
        className={`rounded-lg disabled:bg-gray-500 transition-all flex items-center outline-none font-medium ${responsiveClasses}`}

        style={{ backgroundColor: isHovering ? bgColorOnHover : bgColor, color: textColor }}
        disabled={loading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <RenderContent />
    </button>
  );
};

export default StylistButton;
