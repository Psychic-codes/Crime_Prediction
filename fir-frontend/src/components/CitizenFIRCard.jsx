import PropTypes from "prop-types"; // Import PropTypes

const statusColors = {
  "Filed": "bg-gray-500",
  "RECEIVED": "bg-blue-500",
  "IN PROGRESS": "bg-yellow-500",
  "RESOLVED": "bg-green-500",
  "CLOSED": "bg-red-500",
};

const CitizenFIRCard = ({ fir }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-bold text-blue-700">{fir.typeOfCrime}</h3>
      <p className="text-sm text-gray-600 mb-2">📍 Location: {fir.location}</p>
      <p className="text-gray-700 text-sm">📝 {fir.description}</p>
      <p className="text-sm text-gray-600 mt-2">🏠 Place of Crime: {fir.placeOfCrime}</p>

      <div className="flex items-center justify-between mt-4">
        <span className={`text-white px-3 py-1 rounded-full text-xs ${statusColors[fir.status] || "bg-gray-500"}`}>
          {fir.status}
        </span>
      </div>
    </div>
  );
};

// ✅ Add PropTypes validation
CitizenFIRCard.propTypes = {
  fir: PropTypes.shape({
    typeOfCrime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    placeOfCrime: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default CitizenFIRCard;
