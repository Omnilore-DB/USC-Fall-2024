import React from "react";

const FundraisingReport = () => {
  // Hardcoded Data (Just for demonstration)
  const donations = [
    {
      date: "07/01/23",
      name: "Al Ortiz",
      giftTotal: "$250,000.00",
      recognitionName: "Al Ortiz",
    },
    {
      date: "07/31/23",
      name: "Leslie Criswell",
      giftTotal: "$75,000.00",
      recognitionName: "The Forum Family Foundation",
    },
    {
      date: "12/05/23",
      name: "Elyse Gura",
      giftTotal: "$25,000.00",
      recognitionName: "Elyse Gura",
    },
    {
      date: "03/02/23",
      name: "Hal Hart",
      giftTotal: "$20,000.00",
      recognitionName: "anonymous",
    },
    {
      date: "06/15/23",
      name: "Phil and Lynn Solomita",
      giftTotal: "$5,000.00",
      recognitionName: "The Philip and Lynn Solomita Family Trust",
    },
    {
      date: "10/22/23",
      name: "Julia Roberts",
      giftTotal: "$3,000.00",
      recognitionName: "Julia Roberts",
    },
    {
      date: "05/28/23",
      name: "George Santos",
      giftTotal: "$120.00",
      recognitionName: "anonymous",
    },
    {
      date: "07/02/23",
      name: "Lyle Lyle Crocodile",
      giftTotal: "$25.00",
      recognitionName: "Lyle Lyle Crocodile",
    },
  ];

  // Calculate total donations
  const totalDonations = donations.reduce((total, donation) => {
    const amount = parseFloat(
      donation.giftTotal.replace("$", "").replace(",", ""),
    );
    return total + amount;
  }, 0);

  return (
    <div className="container">
      <h3 className="mb-4 text-xl font-semibold">
        Periodic Report of OLIR Online Donation Activity
      </h3>

      {/* Donation Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Date of Gift</th>
              <th className="border px-4 py-2">Member Name</th>
              <th className="border px-4 py-2">Gift Totals</th>
              <th className="border px-4 py-2">Donor Recognition Name</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.giftTotal}</td>
                <td className="border px-4 py-2">{item.recognitionName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Donations */}
      <div className="mt-4">
        <h4 className="text-lg font-semibold">TOTAL DONATIONS</h4>
        <p className="text-xl font-bold">${totalDonations.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FundraisingReport;
