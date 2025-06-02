import PropTypes from "prop-types";

function Topbar({ leftSlot, rightSlot }) {
  return (
    <div
      className="
      bg-white
      shadow-md
      rounded-lg
      p-4
      transition-all
      flex 
      items-center
      justify-center
    ">
      <div className="flex items-center justify-between w-full container">
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="flex gap-4 items-center">
          {leftSlot}
        </div>
        <div className="flex items-center gap-4">{rightSlot}</div>
      </div>
    </div>
  );
}

Topbar.propTypes = {
  leftSlot: PropTypes.node,
  rightSlot: PropTypes.node,
};

export default Topbar;
