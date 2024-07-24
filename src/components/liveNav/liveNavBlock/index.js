import Collapse from "@kunukn/react-collapse";
import Down from "components/collapseDown";

const Block = ({ item, data, id, isOpen, onToggle, children }) => {
  return (
    <div className="block w-100 collapse-quick-link mb-2" id={id}>
      <div className="live-game-category p-2" onClick={onToggle}>
        <p className="ml-2">{data.name}</p>
        <p className="ml-auto mr-2 mt-0">
          <Down isOpen={isOpen} />
        </p>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </div>
  );
};

export default Block;
