import { getAssetUrl } from 'utils/EnvUtils';

function RacingIcon(props) {
  return (
    <div
      className="country-unit-horse p-3 text-center mr-2 mb-2"
      onClick={() => {
        props.goToDetail(props.id);
      }}
    >
      <img
        src={getAssetUrl('sports-icons/horseracing.svg')}
        className="mb-2"
        alt="img"
      />
      <p>{props.data}</p>
    </div>
  );
}

export default RacingIcon;
