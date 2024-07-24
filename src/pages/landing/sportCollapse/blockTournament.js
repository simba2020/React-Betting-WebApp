import Collapse from '@kunukn/react-collapse';
import { getAssetUrl } from 'utils/EnvUtils';

const BlockTournament = ({ isOpen, data, onToggle, children, id, sport }) => {
  return (
    <div className="block w-100 collapse-tournament mt-4" id={id}>
      <div
        className="collapse-body-class row landing-tournament"
        onClick={onToggle}
        id={[sport, data.itemsPath, id, data]}
      >
        <div className="ml-3 d-flex">
          <img src={getAssetUrl(data.asset.path)} alt="img" className="logo" />
          <p className="class-name">{data.name}</p>
        </div>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </div>
  );
};

export default BlockTournament;
