import PropTypes from "prop-types";
import React from "react";

function CardWrapper({ children }) {
  return (
    <div className="w-full flex justify-center flex-col gap-4  items-center">
      {children}
    </div>
  );
}

CardWrapper.propTypes = {
  children: PropTypes.node,
};

export default CardWrapper;
