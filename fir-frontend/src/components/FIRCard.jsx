import PropTypes from "prop-types";

const statuses = ["Filed", "Under Investigation", "Resolved", "Rejected"];

const FIRCard = ({ fir, handleStatusUpdate }) => {
  if (!fir) {
    return <p className="text-red-500">Error: FIR data not available.</p>;
  }

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold text-gray-800">{fir.typeOfCrime}</h3>
      <p className="text-sm text-gray-600">📍 Location: {fir.location}</p>
      <p className="text-sm text-gray-600">📝 Description: {fir.description}</p>
      <p className="text-sm text-gray-600">📧 Filed by: {fir.citizenEmail}</p>

      <div className="flex items-center justify-between mt-4">
        <select
          value={fir.status || ""}
          onChange={(e) => handleStatusUpdate(fir._id, e.target.value)}
          className="border p-1 rounded text-gray-800"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// ✅ Define PropTypes to prevent prop errors
FIRCard.propTypes = {
  fir: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    typeOfCrime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    citizenEmail: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
  handleStatusUpdate: PropTypes.func.isRequired,
};

export default FIRCard;
