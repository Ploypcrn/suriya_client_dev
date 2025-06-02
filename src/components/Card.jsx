import PropTypes from "prop-types";
import React from "react";

function Card({ headingIcon, headingText, children }) {
  return (
    <>
      <div
        className="
        bg-white
        shadow-md
        rounded-lg
        p-4
        flex
        flex-col
        gap-4
        container
      ">
        <div className="flex items-center gap-2">
          <span
            className="
            text-2xl
            ">
            {headingIcon}
          </span>
          <span
            className="
            font-bold
            text-xl
          ">
            {headingText}
          </span>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}

Card.propTypes = {
  headingText: PropTypes.node,
  headingIcon: PropTypes.node,
  children: PropTypes.node,
};

export default Card;
