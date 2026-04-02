// pages/CreateCampaign.jsx
import Navbar from "../components/Home/Navbar";

function CreateCampaign() {
  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Create Campaign
        </h1>

        <input className="w-full border p-2 mb-3" placeholder="Title" />
        <textarea className="w-full border p-2 mb-3" placeholder="Description" />
        <input className="w-full border p-2 mb-3" placeholder="Goal Amount" />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateCampaign;